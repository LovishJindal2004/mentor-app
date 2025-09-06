import { Component, OnInit, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
  ValidationErrors,
  FormControl,
} from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

// import {CalendarViewComponent} from '../calendar-view/calendar-view.component';
import { TaskService } from '../task.service';
import { Subscription } from 'rxjs';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule } from '@angular/router';
import { helperService } from 'app/core/auth/helper';

type Priority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  assignee?: string;
  estimatedTimeHours?: number;
  scheduleDate?: string | null;
  type?: string;
}

interface TaskType {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
  forTasks: boolean;
  forEvents: boolean;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  pageNumber?: number; // Add this
}

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  canEdit: boolean;
  liked: boolean;
  likes: number;
  showMenu: boolean;
}

interface CalendarTask {
  id: string;
  title: string;
  dayIndex: number;
  typeId: string;
  durationMinutes: number;
}


@Component({
  selector: 'app-kanban-board-view',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule, DragDropModule, ViewTaskComponent, MatIconModule, MatButtonToggleModule],
  templateUrl: './mentor-kanban-view.component.html',
  styleUrl: './mentor-kanban-view.component.scss'
})
export class MentorKanbanViewComponent implements OnInit, OnDestroy {
  weekStart = this.getStartOfWeek(new Date());
  days = this.buildDays(this.weekStart);
  activeTool: 'tasks' | 'calendar' = 'tasks';
  columns: Column[] = [];
  showTaskModal: boolean = false;
  taskForm: FormGroup;
  currentColumn: Column | null = null;
  editingTask: Task | null = null;
  selectedStatusId: string | null = null;
  sidenavOpen = true;
  dayTasks: CalendarTask[][] = Array.from({ length: 7 }).map(() => []);
  panelOpen = false;
  panelTaskId: string | null = null;

  pageNumber = 1;
  pageSize = 5;
  isLoading = false;
  hasMore = true;

  showEditTypesModal = false;
  taskTypes: TaskType[] = [
    { id: 'operational', name: 'Operational', color: '#2f6fec', enabled: true, forTasks: true, forEvents: false },
    { id: 'technical', name: 'Technical', color: '#17a2b8', enabled: true, forTasks: true, forEvents: false },
    { id: 'strategic', name: 'Strategic', color: '#28a745', enabled: true, forTasks: true, forEvents: false },
    { id: 'hiring', name: 'Hiring', color: '#6f42c1', enabled: true, forTasks: true, forEvents: false },
    { id: 'financial', name: 'Financial', color: '#ffc107', enabled: true, forTasks: true, forEvents: false },
    { id: 'meeting', name: 'Meeting', color: '#fd7e14', enabled: false, forTasks: false, forEvents: true },
    { id: 'online-call', name: 'Online call', color: '#6610f2', enabled: false, forTasks: false, forEvents: true },
    { id: 'interview', name: 'Interview', color: '#e83e8c', enabled: false, forTasks: false, forEvents: true },
    { id: 'type1', name: 'Type 1', color: '#fd7e14', enabled: false, forTasks: false, forEvents: true },
    { id: 'type2', name: 'Type 2', color: '#20c997', enabled: false, forTasks: false, forEvents: true }
  ];
  showTypeDropdown = false;
  editTypesActiveTab = 'tasks';

  // Comments
  newComment: string = '';
  currentTaskComments: Comment[] = [];
  _userDetails: any
  // Subscriptions
  private _taskSubscription: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private _taskService: TaskService,
    private _helperService: helperService,
  ) {
    this.taskForm = this.fb.group({
      title: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      description: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(10)]],
      priority: [{ value: 'medium', disabled: true }, Validators.required],
      dueDate: [{ value: null, disabled: true }, [Validators.required, this.futureDateValidator()]],
      assignee: [{ value: '', disabled: true }, [Validators.minLength(2), Validators.maxLength(50)]],
      statusId: [{ value: null, disabled: true }],
      estimatedTimeHours: [{ value: 0, disabled: true }, [Validators.min(0)]],
      scheduleDate: [{ value: null, disabled: true }],
      type: [{ value: 'operational', disabled: true }, Validators.required]
    });

    this._userDetails = this._helperService.getUserDetail();
    // Note: Comment section remains enabled
  }

  private boardInitialized = false;
  private loadingStatuses = new Set<string>();

  async ngOnInit() {
    this.loadTaskTypes();
    await this.initializeBoard();
    this.boardInitialized = true;
    this.loadAllColumnTasks(); // Load tasks for all columns
  }

  ngOnDestroy() {
    if (this._taskSubscription) {
      this._taskSubscription.unsubscribe();
    }
  }

  loadAllColumnTasks() {
  if (!this.boardInitialized) return;

  this.columns.forEach(column => {
    this.loadTasksForColumn(column, false);
  });
}

  // New method to load tasks for a specific column
  loadTasksForColumn(column: Column, loadMore: boolean = false) {
  const columnId = column.id;
  if (this.loadingStatuses.has(columnId)) return;

  const apiStatus = this.reverseMapStatus(columnId);

  this.loadingStatuses.add(columnId);

  // Track page number per column
  if (!column.pageNumber) column.pageNumber = 1;
  const pageNumber = loadMore ? column.pageNumber + 1 : 1;

  const data = {
    pageNumber,
    pageSize: this.pageSize,
    orderBy: "",
    sortOrder: "",
  };

  this._taskService.getAssignedTaskList(data, apiStatus).then((response: any) => {
    if (response && response.data && Array.isArray(response.data)) {
      if (response.data.length > 0) {
        this.processTasksFromApiForColumn(response.data, column, loadMore);
        column.pageNumber = pageNumber; // Only increment if new tasks returned
      } else {
        this.hasMore = false; // No more tasks
      }
    }
    this.loadingStatuses.delete(columnId);
  }).catch(error => {
    console.error(`Error loading tasks for column ${columnId}:`, error);
    this.loadingStatuses.delete(columnId);
  });
}

  processTasksFromApiForColumn(apiTasks: any[], targetColumn: Column, append: boolean = false) {
  if (!targetColumn || !targetColumn.tasks) {
    console.warn('Target column not found or invalid');
    return;
  }

  if (!append) {
    targetColumn.tasks = []; // Clear existing tasks if not appending
  }

  console.log(`Processing ${apiTasks.length} tasks for column: ${targetColumn.title}`);

  apiTasks.forEach(apiTask => {
    // Check if task already exists in this column to prevent duplicates
    const existingTask = targetColumn.tasks.find(t => t.id === apiTask.guid);
    if (existingTask && !append) {
      return; // Skip if task already exists and we're not appending
    }

    const task: Task = {
      id: apiTask.guid,
      title: apiTask.title || 'Untitled Task',
      description: apiTask.description || '',
      priority: this.mapPriority(apiTask.priority), // Use priority field, not taskType
      dueDate: apiTask.date ? new Date(apiTask.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      assignee: apiTask.students ? apiTask.students.join(', ') : '',
      estimatedTimeHours: 1,
      scheduleDate: null,
      type: this.mapTaskType(apiTask.taskType)
    };

    targetColumn.tasks.push(task);
  });

  console.log(`Column ${targetColumn.title} now has ${targetColumn.tasks.length} tasks`);
}

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private buildDays(start: Date) {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  loadTasks(loadMore: boolean = false) {
    console.warn('loadTasks called - consider using loadTasksForColumn instead');
    this.loadAllColumnTasks();
  }

  loadMoreTasksForColumn(column: Column) {
    this.loadTasksForColumn(column, true);
  }

  deleteTask(column: Column, task: Task) {
    this._taskService.deleteTask(task.id)
      .then(() => {
        const index = column.tasks.indexOf(task);
        if (index > -1) {
          column.tasks.splice(index, 1);
        }
        this._taskService.openSnackBar('Task deleted successfully', 'Close');
      })
      .catch(error => {
        console.error('Error deleting task:', error);
        this._taskService.openSnackBar('Failed to delete task', 'Close');

        // Still remove from local UI as fallback
        const index = column.tasks.indexOf(task);
        if (index > -1) {
          column.tasks.splice(index, 1);
        }
      });
  }

  showTask() {
    this.showTaskModal = true;
  }
  onSidePanelClose() {
    this.showTaskModal = false;
  }

  openViewTask(taskId: string) {
    this.panelTaskId = taskId;
    this.panelOpen = true;
    document.body.classList.add('modal-open');
  }
  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log(event.previousIndex, event.currentIndex + 1);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      var newStatus :number = 0;
      if(event.container.id === 'cdk-drop-list-0' ) {
        newStatus = 0; // New
      }else if(event.container.id === 'cdk-drop-list-1' ) {
        newStatus = 2; // Scheduled
      }else if(event.container.id === 'cdk-drop-list-2' ) {
        newStatus = 3; // In Progress
      }
      

      this._taskService.updateTaskStatus(task.id, newStatus)
        .then(() => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          this._taskService.openSnackBar('Task status updated', 'Close');
        })
        .catch(error => {
          console.error('Error updating task status:', error);
          this._taskService.openSnackBar('Failed to update task status', 'Close');

          // Still update UI as fallback
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        });
    }
  }


  closePanel() {
    this.panelOpen = false;
    this.panelTaskId = null;
    document.body.classList.remove('modal-open');
  }

  processTasksFromApi(apiTasks: any[], append: boolean = false) {
    // Safety check: ensure columns are initialized
    if (!this.columns || this.columns.length === 0) {
      console.warn('Columns not initialized yet, skipping task processing');
      return;
    }

    if (!append) {
      this.columns.forEach(column => {
        if (column && column.tasks) {
          column.tasks = [];
        }
      });
    }

    apiTasks.forEach(apiTask => {
      const taskId = apiTask.guid;

      const task: Task = {
        id: taskId,
        title: apiTask.title || 'Untitled Task',
        description: apiTask.description || '',
        priority: this.mapPriority(apiTask.taskType),
        dueDate: apiTask.date ? new Date(apiTask.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        assignee: apiTask.students ? apiTask.students.join(', ') : '',
        estimatedTimeHours: 1,
        scheduleDate: null,
        type: this.mapTaskType(apiTask.taskType)
      };

      const column = this.columns.find(c => c.id === status);

      // Safety check before pushing task
      if (column && column.tasks) {
        column.tasks.push(task);
      } else if (this.columns.length > 0 && this.columns[0].tasks) {
        // Fallback to first column if status mapping fails
        this.columns[0].tasks.push(task);
      }
    });
  }

  onColumnScroll(event: any, column: Column) {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      this.loadMoreTasksForColumn(column);
    }
  }


  reverseMapStatus(columnId: string): number {
  switch (columnId) {
    case '0': // Convert to string comparison if your column IDs are strings
    case 'new': 
      return 0;
    case '1':
    case 'scheduled': 
      return 1;
    case '2':
    case 'inprogress': 
      return 2;
    case '3':
    case 'completed': 
      return 3;
    case '4':
    case 'request': 
      return 4;
    default: 
      console.warn(`Unknown column ID: ${columnId}`);
      return 0;
  }
}

  mapPriority(taskType: number): Priority {
    switch (taskType) {
      case 0: return 'low';
      case 1: return 'medium';
      case 2: return 'high';
      default: return 'medium';
    }
  }

  mapTaskType(taskType: number): string {
    // Map API task type to our task type IDs
    switch (taskType) {
      case 0: return 'operational';
      case 1: return 'technical';
      case 2: return 'strategic';
      default: return 'operational';
    }
  }

  async initializeBoard() {
  try {
    const statusResponse: any = await this._taskService.status();

    this.columns = (statusResponse || []).map((status: any) => ({
      id: String(status.id), // Ensure this matches your reverseMapStatus mapping
      title: status.name,
      tasks: []
    }));
    
    console.log('Initialized columns:', this.columns.map(c => ({ id: c.id, title: c.title })));
  } catch (error) {
    console.error('Failed to load statuses:', error);
    this.columns = [];
  }
}



  createDefaultTasks() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);



    // Add default tasks to the "New task" column
    const newTaskColumn = this.columns.find(c => c.id === 'new');
    if (newTaskColumn) {
      // newTaskColumn.tasks.push(...defaultTasks);
    }

    // Add a sample completed task
    const completedTask: Task = {
      id: 'default-completed',
      title: 'Sample Completed Task ✅',
      description: 'This is what a completed task looks like. Great job!',
      priority: 'high',
      dueDate: today.toISOString().split('T')[0],
      assignee: 'You',
      estimatedTimeHours: 2,
      scheduleDate: null,
      type: 'operational'
    };

    const completedColumn = this.columns.find(c => c.id === 'completed');
    if (completedColumn) {
      completedColumn.tasks.push(completedTask);
    }
  }

  trackByTypeId(index: number, type: TaskType): string {
    return type.id;
  }

  getTaskTypeColor(task: Task): string {
    const taskType = this.taskTypes.find(t => t.id === (task.type || 'operational'));
    return taskType ? taskType.color : '#2f6fec';
  }

  getTaskTypeName(task: Task): string {
    const taskType = this.taskTypes.find(t => t.id === (task.type || 'operational'));
    return taskType ? taskType.name : 'Operational';
  }

  getTaskTypeBackgroundColor(task: Task): string {
    const color = this.getTaskTypeColor(task);
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  }

  futureDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(control.value);
      return inputDate >= today ? null : { pastDate: true };
    };
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.type-selector') && !target.closest('.type-selector-compact')) {
      this.showTypeDropdown = false;
    }
  }


  editTask(task: Task, column: Column) {
    this.editingTask = task;
    this.currentColumn = column;
    this.selectedStatusId = column.id;

    // Patch values but all fields are disabled except comments
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee ?? '',
      statusId: column.id,
      estimatedTimeHours: task.estimatedTimeHours ?? 0,
      scheduleDate: task.scheduleDate ?? null,
      type: task.type ?? 'operational'
    });

    // Load comments - this section remains enabled
    this.loadTaskComments();
    this.showTaskModal = true;
    document.body.classList.add('modal-open');
  }



  closeTaskModal() {
    this.showTaskModal = false;
    this.editingTask = null;
    this.currentColumn = null;
    this.taskForm.reset();
    this.selectedStatusId = null;
    this.newComment = '';
    this.currentTaskComments = [];
    document.body.classList.remove('modal-open');
  }

  toggleSidebar() {
    this.sidenavOpen = !this.sidenavOpen;
  }


  loadTaskTypes() {
    const saved = localStorage.getItem('taskTypes');
    if (saved) {
      try {
        this.taskTypes = JSON.parse(saved);
      } catch (error) {
        console.error('Error loading task types:', error);
      }
    }
  }

  // Side panel helper methods
  getCurrentColumnTitle(): string {
    if (this.currentColumn) return this.currentColumn.title;
    const statusId = this.taskForm.get('statusId')?.value;
    const column = this.columns.find(c => c.id === statusId);
    return column?.title || 'New task';
  }

  getAssigneeInitials(): string {
    const assignee = this.taskForm.get('assignee')?.value || 'Me';
    return assignee.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getCurrentUserInitials(): string {
    return 'TW';
  }

  getScheduledDay(): string {
    const date = this.taskForm.get('scheduleDate')?.value;
    return date ? new Date(date).getDate().toString() : '';
  }

  getScheduledMonth(): string {
    const date = this.taskForm.get('scheduleDate')?.value;
    return date ? new Date(date).toLocaleDateString('en-US', { month: 'short' }) : '';
  }

  // Comment methods
  addComment(event?: Event) {
    // Cast to KeyboardEvent if it's a keyboard event
    if (event instanceof KeyboardEvent) {
      if (!event.ctrlKey) return; // Only submit on Ctrl+Enter for keyboard events
    }

    if (!this.newComment?.trim()) return;

    const comment: Comment = {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      text: this.newComment.trim(),
      author: 'Tanish Wahangbam',
      createdAt: new Date(),
      canEdit: true,
      liked: false,
      likes: 0,
      showMenu: false
    };

    this.currentTaskComments.push(comment);
    this.newComment = '';
    this.saveTaskComments();
  }

  cancelComment() {
    this.newComment = '';
  }

  trackByCommentId(index: number, comment: Comment): string {
    return comment.id;
  }

  getCommentUserInitials(comment: Comment): string {
    return comment.author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  toggleCommentMenu(commentId: string) {
    this.currentTaskComments.forEach(c => {
      c.showMenu = c.id === commentId ? !c.showMenu : false;
    });
  }

  editComment(comment: Comment) {
    comment.showMenu = false;
  }

  deleteComment(comment: Comment) {
    const index = this.currentTaskComments.findIndex(c => c.id === comment.id);
    if (index > -1) {
      this.currentTaskComments.splice(index, 1);
      this.saveTaskComments();
    }
  }

  likeComment(comment: Comment) {
    comment.liked = !comment.liked;
    comment.likes += comment.liked ? 1 : -1;
    this.saveTaskComments();
  }

  replyToComment(comment: Comment) {
    // Implement reply functionality
  }

  private saveTaskComments() {
    if (this.editingTask) {
      const key = `task-comments-${this.editingTask.id}`;
      localStorage.setItem(key, JSON.stringify(this.currentTaskComments));
    }
  }

  private loadTaskComments() {
    if (this.editingTask) {
      const key = `task-comments-${this.editingTask.id}`;
      const saved = localStorage.getItem(key);
      this.currentTaskComments = saved ? JSON.parse(saved) : [];
    }
  }

  // Form Control Getters
  get titleControl(): FormControl {
    return this.taskForm.get('title') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.taskForm.get('description') as FormControl;
  }

  get dueDateControl(): FormControl {
    return this.taskForm.get('dueDate') as FormControl;
  }

  get assigneeControl(): FormControl {
    return this.taskForm.get('assignee') as FormControl;
  }

  get statusIdControl(): FormControl {
    return this.taskForm.get('statusId') as FormControl;
  }

  get priorityControl(): FormControl {
    return this.taskForm.get('priority') as FormControl;
  }

  get estimatedTimeHoursControl(): FormControl {
    return this.taskForm.get('estimatedTimeHours') as FormControl;
  }

  get typeControl(): FormControl {
    return this.taskForm.get('type') as FormControl;
  }

}
