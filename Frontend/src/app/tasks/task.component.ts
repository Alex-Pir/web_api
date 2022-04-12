import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from './task.interface';

@Component({
    selector: 'task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
  })
  export class TaskComponent {
    @Input() task?: Task;
    @Input() isComplete: boolean = false;
    @Output() onDeleteTask = new EventEmitter();
    @Output() onCompleteTask = new EventEmitter();

    /**
     * Отправляет событие о выполнении задачи
     */
    complete(): void {
      if (this.task) {
        this.onCompleteTask.emit(this.task.id as number);
      }
    }

    /**
     * Удаляет задачу
     */
    delete(): void {
      if (this.task) {
        this.onDeleteTask.emit(this.task.id as number);
      }
    }
  }