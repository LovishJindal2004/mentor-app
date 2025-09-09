import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../task.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { SettingsComponent } from 'app/layout/common/settings/settings.component';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { helperService } from 'app/core/auth/helper';

export interface Task {
  guid: string;
  title: string;
  description?: string;
  status: number | string;
  date?: string;
  createdBy?: string;
  completed?: boolean;
  commentsCount?: number;
}

export interface ApiResponse {
  data: Task[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
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
    ViewTaskComponent,
    DatePipe
  ],
  templateUrl: './list-task.component.html',
  styleUrl: './list-task.component.scss'
})
export class ListTaskComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['task','createdby','createdon', 'action'];
  allTasks: Task[] = [];
  isLoading: boolean = false;
  private _unsubscribeAll = new Subject<void>();
  
  // Separate data sources for active and completed tasks
  activeTasks = new MatTableDataSource<Task>([]);
  completedTasks = new MatTableDataSource<Task>([]);
  
  // Pagination info
  activeTasksPagination = {
    currentPage: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0
  };
  
  completedTasksPagination = {
    currentPage: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0
  };
  
  @ViewChild('activePaginator', { static: false }) activePaginator!: MatPaginator;
  @ViewChild('completedPaginator', { static: false }) completedPaginator!: MatPaginator;
  @ViewChild('drawer') drawer!: MatDrawer;
  
  selectedTask: any;
  showTaskModal: boolean = false;
  selectedTaskId: any;
  _userDetails: any;

  constructor(
    private _router: Router,
    private _helperService: helperService,
    private _taskService: TaskService
  ){
    this._userDetails = this._helperService.getUserDetail();
  }
  
  ngOnInit(): void {
    this.loadTasks();
  }

  ngAfterViewInit(): void {
    // Configure paginators to use server-side pagination
    this.setupPaginators();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private setupPaginators(): void {
    if (this.activePaginator) {
      // Disable built-in pagination since we're doing server-side
      this.activePaginator.page.subscribe((event: PageEvent) => {
        this.activeTasksPagination.currentPage = event.pageIndex + 1;
        this.activeTasksPagination.pageSize = event.pageSize;
        this.loadActiveTasks();
      });
    }

    if (this.completedPaginator) {
      this.completedPaginator.page.subscribe((event: PageEvent) => {
        this.completedTasksPagination.currentPage = event.pageIndex + 1;
        this.completedTasksPagination.pageSize = event.pageSize;
        this.loadCompletedTasks();
      });
    }
  }

  openDrawer(task: any): void {
    this.selectedTask = task;
    this.drawer.open();
  }

  showTask(taskId: string): void {    
    this.selectedTaskId = taskId;
    this.showTaskModal = true;
  }

  onSidePanelClose(): void {
    this.showTaskModal = false;
    this.selectedTaskId = null;
  }
  
  // Load all tasks initially or use separate methods for active/completed
  loadTasks(): void {
    this.loadActiveTasks();
    this.loadCompletedTasks();
  }

  private loadActiveTasks(): void {
    this.isLoading = true;
    const data = {
      pageNumber: this.activeTasksPagination.currentPage,
      pageSize: this.activeTasksPagination.pageSize,
      orderBy: "",
      sortOrder: "",
      status: 0 // Active tasks status
    };

    this._taskService.getAssignedTaskList(data)
      .then((response: ApiResponse) => {
        if (response && response.data) {
          const activeTasks = response.data.filter(task => 
            task.status === 0 || task.status === 'Active' || task.status !== 3
          );
          
          this.activeTasks.data = activeTasks;
          this.activeTasksPagination = {
            currentPage: response.currentPage,
            pageSize: response.pageSize,
            totalCount: response.totalCount,
            totalPages: response.totalPages
          };

          // Update paginator length
          if (this.activePaginator) {
            this.activePaginator.length = this.activeTasksPagination.totalCount;
            this.activePaginator.pageIndex = this.activeTasksPagination.currentPage - 1;
            this.activePaginator.pageSize = this.activeTasksPagination.pageSize;
          }
        }
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error loading active tasks:', error);
        this.isLoading = false;
      });
  }

  private loadCompletedTasks(): void {
    const data = {
      pageNumber: this.completedTasksPagination.currentPage,
      pageSize: this.completedTasksPagination.pageSize,
      orderBy: "",
      sortOrder: "",
      status: 3 // Completed tasks status
    };

    this._taskService.getAssignedTaskList(data)
      .then((response: ApiResponse) => {
        if (response && response.data) {
          const completedTasks = response.data.filter(task => 
            task.status === 3 || task.status === 'Completed'
          );
          
          this.completedTasks.data = completedTasks;
          this.completedTasksPagination = {
            currentPage: response.currentPage,
            pageSize: response.pageSize,
            totalCount: response.totalCount,
            totalPages: response.totalPages
          };

          // Update paginator length
          if (this.completedPaginator) {
            this.completedPaginator.length = this.completedTasksPagination.totalCount;
            this.completedPaginator.pageIndex = this.completedTasksPagination.currentPage - 1;
            this.completedPaginator.pageSize = this.completedTasksPagination.pageSize;
          }
        }
      })
      .catch(error => {
        console.error('Error loading completed tasks:', error);
      });
  }

  markCompleted(taskid: string): void {
    this._taskService.updateTaskStatus(taskid, 3).then(res => {
      if (res) {
        // Refresh both tables since task moved from active to completed
        this.loadTasks();
      }
    });
  }

  markActive(taskid: string): void {
    this._taskService.updateTaskStatus(taskid, 0).then(res => {
      if (res) {
        // Refresh both tables since task moved from completed to active
        this.loadTasks();
      }
    });
  }

  // Handle pagination events
  onActivePageChange(event: PageEvent): void {
    this.activeTasksPagination.currentPage = event.pageIndex + 1;
    this.activeTasksPagination.pageSize = event.pageSize;
    this.loadActiveTasks();
  }

  onCompletedPageChange(event: PageEvent): void {
    this.completedTasksPagination.currentPage = event.pageIndex + 1;
    this.completedTasksPagination.pageSize = event.pageSize;
    this.loadCompletedTasks();
  }

  AssignTask(): void {
    this._router.navigate(['/task/assign']);
  }
}