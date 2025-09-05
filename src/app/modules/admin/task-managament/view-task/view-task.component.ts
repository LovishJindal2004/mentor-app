import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { TaskService } from '../task.service';

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
@Component({
  selector: 'app-view-task',  
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.scss'
})
export class ViewTaskComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isOpen = false;
  @Input() taskId: string | null = null;

  @Output() close = new EventEmitter<void>();

  // Internal state
  form: FormGroup;
  titleControl = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]);
  descriptionControl = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(10)]);
  priorityControl = new FormControl({ value: 'medium', disabled: true }, [Validators.required]);
  statusIdControl = new FormControl({ value: null, disabled: true });
  assigneeControl = new FormControl({ value: '', disabled: true });
  // Local data
  columns: Array<{ id: string; title: string }> = [
    { id: 'new', title: 'New task' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' },
  ];

  currentTaskComments: Comment[] = [];
  newComment = '';
  icon = '📝';
  title = '';
  showComments = true;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.form = this.fb.group({
      title: this.titleControl,
      description: this.descriptionControl,
      priority: this.priorityControl,
      statusId: this.statusIdControl,
      assignee: this.assigneeControl
    });
  }

  ngOnInit() {
    if (this.isOpen) document.body.classList.add('modal-open');
  }

  ngOnDestroy() {
    document.body.classList.remove('modal-open');
  }

  ngOnChanges(changes: SimpleChanges) {
    // toggle body lock
    if (changes.isOpen) {
      if (this.isOpen) document.body.classList.add('modal-open');
      else document.body.classList.remove('modal-open');
    }
    // load task when id changes and panel is open
    if (changes.taskId && this.taskId && this.isOpen) {
      // this.loadTask(this.taskId);
    }
  }

  // private async loadTask(taskId: string) {
  //   try {
  //     const task = await this.taskService.getTaskById(taskId); // implement in TaskService
  //     // Patch form fields and title
  //     this.title = task.title ?? 'Untitled Task';
  //     this.form.patchValue({
  //       title: task.title ?? '',
  //       description: task.description ?? '',
  //       priority: task.priority ?? 'medium',
  //       statusId: task.statusId ?? 'new',
  //       assignee: task.assignee ?? ''
  //     });
  //     // Load comments from localStorage or service
  //     const key = `task-comments-${taskId}`;
  //     const saved = localStorage.getItem(key);
  //     this.currentTaskComments = saved ? JSON.parse(saved) : [];
  //   } catch (e) {
  //     // Optionally notify
  //   }
  // }

  onClose() {
    this.close.emit();
  }

  getAssigneeInitials(): string {
    const assignee = this.assigneeControl?.value || 'Me';
    return assignee.split(' ').map((n: string) => n).join('').toUpperCase().slice(0, 2);
  }

  getCurrentUserInitials(): string {
    return 'TW';
  }

  addComment(event?: Event) {
    if (event instanceof KeyboardEvent && !event.ctrlKey) return;
    if (!this.newComment?.trim() || !this.taskId) return;

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
    localStorage.setItem(`task-comments-${this.taskId}`, JSON.stringify(this.currentTaskComments));
  }

  cancelComment() {
    this.newComment = '';
  }

  trackByCommentId(index: number, c: Comment) { return c.id; }

  getCommentUserInitials(c: Comment) {
    return c.author.split(' ').map(n => n).join('').toUpperCase().slice(0, 2);
  }

  toggleCommentMenu(commentId: string) {
    this.currentTaskComments.forEach(c => c.showMenu = c.id === commentId ? !c.showMenu : false);
    if (this.taskId) localStorage.setItem(`task-comments-${this.taskId}`, JSON.stringify(this.currentTaskComments));
  }

  deleteComment(comment: Comment) {
    const idx = this.currentTaskComments.findIndex(c => c.id === comment.id);
    if (idx > -1) {
      this.currentTaskComments.splice(idx, 1);
      if (this.taskId) localStorage.setItem(`task-comments-${this.taskId}`, JSON.stringify(this.currentTaskComments));
    }
  }

  likeComment(comment: Comment) {
    comment.liked = !comment.liked;
    comment.likes += comment.liked ? 1 : -1;
    if (this.taskId) localStorage.setItem(`task-comments-${this.taskId}`, JSON.stringify(this.currentTaskComments));
  }

  editComment(comment: Comment) {
    comment.showMenu = false;
  }

  replyToComment(comment: Comment) {}
}