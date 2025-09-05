import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../task.service';
import { CommonModule, DatePipe } from '@angular/common';import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ViewChild, AfterViewInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SettingsComponent } from 'app/layout/common/settings/settings.component';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

export interface Task {
  guid: string;
  title: string;
  description?: string;
  status: number | string;
  date?: string;
  CreatedBy?: string;
  completed?: boolean;
}

@Component({
  selector: 'app-list-task',
  imports: [
    MatTableModule, 
    MatTabsModule,
    MatIconModule, 
    CommonModule, 
    RouterModule, 
    MatExpansionModule, 
    MatButtonModule, 
    MatIconModule, 
    MatButtonToggleModule, 
    MatProgressSpinnerModule, 
    MatPaginatorModule,
    FuseDrawerComponent,
    // SettingsComponent,
    ViewTaskComponent,
    DatePipe
  ],templateUrl: './list-task.component.html',
  styleUrl: './list-task.component.scss'
})
export class ListTaskComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['task','createdby','createdon', 'action'];
  tasks: Task[] = [];
  isLoading: boolean = false;
  private _unsubscribeAll = new Subject<void>();
  
  activeTasks = new MatTableDataSource<Task>([]);
  completedTasks = new MatTableDataSource<Task>([]);
  @ViewChild('activePaginator') activePaginator!: MatPaginator;
  @ViewChild('completedPaginator') completedPaginator!: MatPaginator;
  @ViewChild('drawer') drawer!: MatDrawer;
  selectedTask: any;
  showTaskModal: boolean = false;

  constructor(
    private _router: Router,
    private _taskService: TaskService
  ){}
  
  ngOnInit(): void {
    this.loadTasks();
    // this._taskService.onTasksChanged
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(() => {
    //     this.loadTasks();
    //   });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  ngAfterViewInit() {
    this.activeTasks.paginator = this.activePaginator;
    this.completedTasks.paginator = this.completedPaginator;
  }
  openDrawer(task: any): void {
    this.selectedTask = task;
    this.drawer.open();
  }
  showTask(){    
    this.showTaskModal = true;
  }
  onSidePanelClose(){
    this.showTaskModal = false;
  }
  
  loadTasks(): void {
    this.isLoading = true;
    let data = {
      pageNumber: 1,
      pageSize: 10,
      orderBy: "",
      sortOrder: "",
    }
    this._taskService.getAssignedTaskList(data)
      .then((response: any) => {
        if (response && response.data) {
          this.tasks = response.data.map(task => ({
            ...task,
            completed: task.status === 3 || task.status === 'Completed'
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

  markCompleted(taskid) {
    this._taskService.updateTaskStatus(taskid,3).then(res=>{
      if(res){
      this.loadTasks();
      this.refreshTables();   
      }
    });
    
  }

  markActive(taskid) {
    this._taskService.updateTaskStatus(taskid,0).then(res=>{
      if(res){

        this.loadTasks();
          this.refreshTables();  
      }
    });
  }

  private refreshTables() {
    this.activeTasks.data = this.tasks.filter((t) => !t.completed);
    this.completedTasks.data = this.tasks.filter((t) => t.completed);
  }
  AssignTask(){
    this._router.navigate(['/task/assign'])
  }
}