import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { Router } from '@angular/router';

export interface Task {
  id: number;
  name: string;
  completed: boolean;
  createdby:string
  createdon:string
}

@Component({
  selector: 'app-list-task',
  imports: [MatTableModule, MatTabsModule, MatExpansionModule, MatButtonModule, MatIconModule, MatButtonToggleModule],
  templateUrl: './list-task.component.html',
  styleUrl: './list-task.component.scss'
})
export class ListTaskComponent {
  displayedColumns: string[] = ['task','createdby','createdon', 'action'];
  constructor(
    private _router: Router
  ){}
  tasks: Task[] = [
    { id: 1, name: 'Finish Angular assignment', completed: false,createdby:'Lovish',createdon:'26 May 2025'  },
    { id: 2, name: 'Review PR', completed: false,createdby:'Lovish',createdon:'27 May 2025' },
    { id: 3, name: 'Team meeting', completed: true,createdby:'Lovish',createdon:'28 May 2025' },
  ];

  activeTasks = new MatTableDataSource<Task>(
    this.tasks.filter((t) => !t.completed)
  );
  completedTasks = new MatTableDataSource<Task>(
    this.tasks.filter((t) => t.completed)
  );

  markCompleted(task: Task) {
    task.completed = true;
    this.refreshTables();
  }

  markActive(task: Task) {
    task.completed = false;
    this.refreshTables();
  }

  private refreshTables() {
    this.activeTasks.data = this.tasks.filter((t) => !t.completed);
    this.completedTasks.data = this.tasks.filter((t) => t.completed);
  }
  AssignTask(){
    this._router.navigate(['/task/assign'])
  }
}