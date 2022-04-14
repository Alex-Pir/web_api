import {Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from './tasks/task.interface';
import {HttpService} from "./http.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpService]
})
export class AppComponent implements OnInit{
  name: string = "Alexander";
  showName: boolean = false;
  showActiveTasks: boolean = true;
  tasks: Array<Task> = [];
  completeTasks: Array<Task> = [];
  url: string = 'http://localhost:5064/api/todo/';

  constructor(private httpService: HttpService) {}

  /**
   * Добавляет задачу в массив
   */
  addTask(myForm: NgForm): void {

    const taskName = myForm.value.task;

    if (taskName.trim().length == 0) {
      return;
    }

    let task: Task = {
      id: 0,
      title: taskName,
      isDone: false
    };

    this.httpService
      .addData(
        this.url, 
        task
      )
      .subscribe((id: number) => {
        task.id = id;

        this.tasks.push(
          task
        );

        myForm.reset();
      });
  }

  /**
   * Обработчик события удаления задачи
   */
  onDelete(id: number): void {
    let task = this.tasks.filter(item => item.id == id);
    let isDoneTask = false;

    console.log(task);

    if (task.length == 0) {
      task = this.completeTasks.filter(item => item.id == id);
      console.log(task);
      isDoneTask = true;
    }
    
    if (task.length == 0) {
      return;
    }

    this.httpService.deleteData(this.url + id).subscribe(() => {
      if (isDoneTask) {
        this.completeTasks = this.completeTasks.filter(item => item.id != id);
      } else {
        this.tasks = this.tasks.filter(item => item.id != id);
      }
    });
    
  }

  /**
   * Обработчик события выполнения задачи
   * @param id
   */
  onComplete(id: number): void {
    const findIndex = this.tasks.findIndex(task => task.id == id);

    if (findIndex >= 0) {
      this.httpService
      .updateData(this.url + id, this.tasks[findIndex])
      .subscribe((task: Task) => {
        this.completeTasks.push(
          this.tasks[findIndex]
        );

        this.tasks.splice(findIndex, 1);
      });
    }
  }

  /**
   * Получаем массив с задачами при инициализации
   */
  ngOnInit(): void {
    this.httpService
      .getAllData(this.url)
      .subscribe((data: Task[]) => {
        
        for (let value of data) {
          if (!value.hasOwnProperty('id') || !value.hasOwnProperty('title')) {
            continue;
          }

          let task: Task = {
            id: value.id,
            title: value.title,
            isDone: value.isDone
          };

          if (task.isDone) {
            this.completeTasks.push(task);
          } else {
            this.tasks.push(task);
          }
        }
      });
  }
}
