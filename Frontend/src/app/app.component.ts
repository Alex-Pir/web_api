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

    this.httpService
      .addData('/todo/api/', taskName)
      .subscribe((task: Task) => {
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

    this.httpService
      .updateData('/todo/api/', this.tasks[findIndex])
      .subscribe((task: Task) => {
        this.completeTasks.push(
          task
        );

        this.tasks.splice(findIndex, 1);
      });
  }

  /**
   * Получаем массив с задачами при инициализации
   */
  ngOnInit(): void {
    this.httpService
      .getAllData('/todo/api/')
      .subscribe((data: Task[]) => {

        for (let value of data) {
          if (!value.hasOwnProperty('id') || !value.hasOwnProperty('name')) {
            continue;
          }

          this.tasks.push({
            id: value.id,
            title: value.title,
            isDone: value.isDone
          });
        }
      });
  }
}
