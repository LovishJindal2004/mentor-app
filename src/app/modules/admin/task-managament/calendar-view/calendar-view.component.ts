import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { TaskService } from '../task.service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { helperService } from 'app/core/auth/helper';

interface CalendarTask {
  id: string;
  title: string;
  dayIndex: number;
  typeId: string;
  date: number;
}

@Component({
  selector: 'app-calendar-view',
  imports: [CommonModule, DragDropModule, FormsModule, RouterModule, MatIconModule, MatButtonToggleModule, ViewTaskComponent],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss'
})
export class CalendarViewComponent implements OnDestroy {
  weekStart = this.getStartOfWeek(new Date());
  days = this.buildDays(this.weekStart);
  dayTasks: CalendarTask[][] = Array.from({ length: 7 }).map(() => []);

  panelOpen = false;
  panelTaskId: string | null = null;

  showDatePicker = false;
  monthCursor = this.getMonthStart(new Date());

  types = [
    { id: 'operational', name: 'Operational', color: '#2f6fec' },
    { id: 'technical', name: 'Technical', color: '#17a2b8' },
    { id: 'strategic', name: 'Strategic', color: '#28a745' },
    { id: 'hiring', name: 'Hiring', color: '#6f42c1' },
    { id: 'financial', name: 'Financial', color: '#ffc107' },
    { id: 'meeting', name: 'Meeting', color: '#fd7e14' },
    { id: 'interview', name: 'Interview', color: '#e83e8c' }
  ];

  showTaskModal = false;
  modalDayIndex: number = 0;
  editingIndex: number | null = null;
  formTitle = '';
  formDuration = 15;
  formTypeId = 'operational';
  _userDetails:any
  private _taskSubscription?: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
     private _taskService: TaskService,    
     private _helperService: helperService,) {
    this.refreshCalendarFromApi();
    
    // Subscribe to task changes (same as Kanban component)
    this._taskSubscription = this._taskService.onTasksChanged?.subscribe((response: any) => {
      if (response && response.data && Array.isArray(response.data)) {
        this.populateWeekFromApiTasks(response.data);
      }
    });    
    this._userDetails = this._helperService.getUserDetail();
  }

  ngOnDestroy() {
    this._taskSubscription?.unsubscribe();
  }

  get dayDropListIds(): string[] {
    return Array.from({ length: 7 }).map((_, i) => `day-${i}`);
  }

  openViewTask(taskId: string) {
    this.panelTaskId = taskId;
    this.panelOpen = true;
    document.body.classList.add('modal-open');
  }

  closePanel() {
    this.panelOpen = false;
    this.panelTaskId = null;
    document.body.classList.remove('modal-open');
    this.refreshCalendarFromApi();
  }

  extractDayIndex(containerId: string | null): number | null {
    if (!containerId) return null;
    const match = containerId.match(/^day-(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  }

  prevWeek() {
    const d = new Date(this.weekStart);
    d.setDate(d.getDate() - 7);
    this.setWeek(d);
  }

  nextWeek() {
    const d = new Date(this.weekStart);
    d.setDate(d.getDate() + 7);
    this.setWeek(d);
  }

  today() {
    this.setWeek(new Date());
  }

  private setWeek(date: Date) {
    this.weekStart = this.getStartOfWeek(date);
    this.days = this.buildDays(this.weekStart);
    this.refreshCalendarFromApi();
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

  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  private getMonthStart(date: Date): Date {
    const d = new Date(date.getFullYear(), date.getMonth(), 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  get monthLabel(): string {
    return this.monthCursor.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  }

  prevMonth() {
    const d = new Date(this.monthCursor);
    d.setMonth(d.getMonth() - 1);
    this.monthCursor = this.getMonthStart(d);
  }

  nextMonth() {
    const d = new Date(this.monthCursor);
    d.setMonth(d.getMonth() + 1);
    this.monthCursor = this.getMonthStart(d);
  }

  get monthGrid(): Date[] {
    const first = new Date(this.monthCursor);
    const startDow = (first.getDay() + 6) % 7;
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - startDow);
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      days.push(d);
    }
    return days;
  }

  isSameMonth(d: Date): boolean {
    return d.getMonth() === this.monthCursor.getMonth() && d.getFullYear() === this.monthCursor.getFullYear();
  }

  isToday(d: Date): boolean {
    const t = new Date();
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
  }

  selectDate(d: Date) {
    this.setWeek(d);
    this.monthCursor = this.getMonthStart(d);
    this.showDatePicker = false;
  }

  openEditTask(task: CalendarTask, dayIndex: number, index: number) {
    this.modalDayIndex = dayIndex;
    this.editingIndex = index;
    this.formTitle = task.title;
    this.formTypeId = task.typeId;
    this.showTaskModal = true;
    document.body.classList.add('modal-open');
  }
  
  deleteTask(dayIndex: number, taskIndex: number) {
    if (confirm('Delete this task?')) {
      this.dayTasks[dayIndex].splice(taskIndex, 1);
    }
  }

  getTypeColor(typeId: string): string {
    return this.types.find(t => t.id === typeId)?.color || '#2f6fec';
  }

  getTypeName(typeId: string): string {
    return this.types.find(t => t.id === typeId)?.name || 'Operational';
  }

  trackByTaskId(index: number, task: CalendarTask): string {
    return task.id;
  }

  // NEW: Fetch and map from API instead of localStorage
  private refreshCalendarFromApi() {
    console.log('🔄 Refreshing calendar from API...');
    this.dayTasks = Array.from({ length: 7 }).map(() => []);

    const data = {
      pageNumber: 1,
      pageSize: 10,
      orderBy: "",
      sortOrder: "",
    };

    this._taskService.getAssignedTaskList(data).then((response: any) => {
      if (response && response.data && Array.isArray(response.data)) {
        console.log('✅ Fetched tasks from API:', response.data); 
        this.populateWeekFromApiTasks(response.data);
      }
    }).catch(error => {
      console.error('Calendar: failed to read tasks from API', error);
      this._taskService.openSnackBar('Failed to load tasks from server', 'Close');
    });
  }

  private populateWeekFromApiTasks(apiTasks: any[]) {
    // Clear week slots
    this.dayTasks = Array.from({ length: 7 }).map(() => []);

    const start = this.weekStart;
    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    for (const apiTask of apiTasks) {
      // Use scheduleDate first, fallback to date field (same as original logic)
      const dateStr: string | null = apiTask.scheduleDate || apiTask.date || null;
      if (!dateStr) continue;

      const d = new Date(dateStr);
      if (isNaN(d.getTime())) continue;

      if (d >= start && d < end) {
        const idx = Math.floor((d.getTime() - start.getTime()) / 86400000);
        if (idx >= 0 && idx < 7) {
          const ct: CalendarTask = {
            id: String(apiTask.guid ?? crypto.randomUUID?.() ?? Date.now()),
            title: String(apiTask.title ?? 'Untitled'),
            dayIndex: idx,
            typeId: this.mapTaskType(apiTask.taskType),
            date: Number(apiTask.date)
          };
          this.dayTasks[idx].push(ct);
        }
      }
    }

    // Trigger change detection if needed
    this.cdr.markForCheck?.();
  }

  // Map API task type to calendar type (same mapping as Kanban component)
  private mapTaskType(taskType: number): string {
    switch (taskType) {
      case 0: return 'operational';
      case 1: return 'technical';
      case 2: return 'strategic';
      default: return 'operational';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateShort(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}
