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
        'http://localhost:5064/api/todo/', 
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
    this.tasks = this.tasks.filter(task => task.id != id);
  }

  /**
   * Обработчик события выполнения задачи
   * @param id
   */
  onComplete(id: number): void {
    const findIndex = this.tasks.findIndex(task => task.id == id);

    if (findIndex >= 0) {
      this.httpService
      .updateData('http://localhost:5064/api/todo/' + id, this.tasks[findIndex])
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
      .getAllData('http://localhost:5064/api/todo/')
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
