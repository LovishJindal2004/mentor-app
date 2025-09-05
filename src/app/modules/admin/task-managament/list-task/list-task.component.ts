import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import { DatePipe } from '@angular/common';

export interface Task {
  guid: string;
  title: string;
  description?: string;
  status: string;
  date?: string;
  CreatedBy?: string;
  completed?: boolean;
}

@Component({
  selector: 'app-list-task',
  imports: [MatTableModule, MatTabsModule, MatExpansionModule, MatButtonModule, MatIconModule, MatButtonToggleModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './list-task.component.html',
  styleUrl: './list-task.component.scss'
})
export class ListTaskComponent implements OnInit {
  displayedColumns: string[] = ['task','createdby','createdon', 'action'];
  tasks: Task[] = [];
  isLoading: boolean = false;
  
  activeTasks = new MatTableDataSource<Task>([]);
  completedTasks = new MatTableDataSource<Task>([]);
  
  constructor(
    private _router: Router,
    private _taskService: TaskService
  ){}
  
  ngOnInit(): void {
    this.loadTasks();
  }
  
  loadTasks(): void {
    this.isLoading = true;
    
    this._taskService.getAssignedTaskList()
      .then((response: any) => {
        if (response && response.data) {
          this.tasks = response.data.map(task => ({
            ...task,
            completed: task.status === 'Completed'
          }));
          this.refreshTables();
        }
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error loading tasks:', error);
        this.isLoading = false;
      });
  }

  markCompleted(task: Task) {
    task.completed = true;
    task.status = 'Completed';
    // Here you would typically call an API to update the task status
    // this._taskService.updateTaskStatus(task.id, 'Completed');
    this.refreshTables();
  }

  markActive(task: Task) {
    task.completed = false;
    task.status = 'Active';
    // Here you would typically call an API to update the task status
    // this._taskService.updateTaskStatus(task.id, 'Active');
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