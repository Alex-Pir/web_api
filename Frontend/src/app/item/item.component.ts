import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {
  @Input() text?: string;
  @Output() onDeleteTask = new EventEmitter();

  delete(): void {
    this.onDeleteTask.emit(this.text as string);
  }
}
