import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { helperService } from 'app/core/auth/helper';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, MatIconModule],
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
  currentTaskComments: any = [];
  commentsPage = 1;
  commentsSize = 10;
  commentsHasMore = true;
  isLoadingComments:boolean = false;
  // Local data
  columns: Array<{ id: string; title: string }> = [
    { id: 'new', title: 'New task' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' },
  ];

  newComment = '';
  icon = '📝';
  title = '';
  showComments = true;
  taskDetails: any;
  _userdetails : any;
  isEditingDescription = false;
  editableDescription = '';

  constructor(
    private fb: FormBuilder,
     private _taskService: TaskService,
     private _router: Router,
     private _helperService: helperService,
    ) {
    this.form = this.fb.group({
      title: this.titleControl,
      description: this.descriptionControl,
      priority: this.priorityControl,
      statusId: this.statusIdControl,
      assignee: this.assigneeControl
    });
    if(this.taskId){
    this._taskService.getTaskDetails(this.taskId).then(res=>{
      this.taskDetails = res;
    })}    
    this._userdetails = this._helperService.getUserDetail();
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
  
    // load task details whenever taskId changes AND panel is open
    if (changes.taskId && this.taskId && this.isOpen) {
      this.loadTask(this.taskId);
    }
  }
  private async loadTask(taskId: string) {
    try {
      const task: any = await this._taskService.getTaskDetails(taskId);
      this.taskDetails = task;
      this.title = task.title ?? 'Untitled Task';
      this.form.patchValue({
        title: task.title ?? '',
        description: task.description ?? '',
        priority: task.priority ?? 'medium',
        statusId: task.statusId ?? 'new',
        assignee: task.assignee ?? ''
      });
      // Now load comments only from API
      this.loadComments(true);  
    } catch (err) {
      console.error("Failed to load task", err);
    }
  }
  toggleEditDescription() {
    if (this.isEditingDescription) {
      // Save action
      this.taskDetails.description = this.editableDescription;
  
      // Call API to update in backend
      this.updateTaskDescription(this.taskId, this.editableDescription);
    } else {
      // Switch to edit mode
      this.editableDescription = this.taskDetails?.description || '';
    }
  
    this.isEditingDescription = !this.isEditingDescription;
  }
  
  updateTaskDescription(taskId: string, description: string) {
    let req = {
      taskGuid: taskId,
      description: description
    }
    try {
      this._taskService.updateTaskDescription(req).then(res=>{        
          // this._taskService.openSnackBar('Description updated!','')
      })
    }
    catch (err) {
      this._taskService.openSnackBar("Failed to load task", err);
    }

    
  }
  NavigatetoExam(res) {
    if (this._userdetails.Roles == 'Mentee') {
      if (res?.type == 1) {
        if (res?.status == 3) {
          this._router.navigate([`/exams/game-analytics/${res.guid}/${this.taskDetails.guid}`])
        } else {
          this._router.navigate([`/exams/game-view/${res.guid}/${this.taskDetails.guid}`])
        }
      }
      else if (res?.type == 2) {
        if (res?.status == 3) {
          this._router.navigate([`/qbank/game-analytics/${res.guid}/${this.taskDetails.guid}`])
        } else {
          this._router.navigate([`/qbank/details/${res.guid}/${this.taskDetails.guid}`])
        }
      }
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
  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'New Task';
      case 1: return 'Scheduled';
      case 2: return 'InProgress';
      case 3: return 'Completed';
      case 4: return 'Request';
      default: return 'Unknown';
    }
  }
  
  getResourceType(type: number): string {
    switch (type) {
      case 0: return 'Video';
      case 1: return 'Test';
      case 2: return 'QBank';
      default: return 'Other';
    }
  }
  onClose() {
    this.close.emit();
  }

  getAssigneeInitials(): string {
    const assignee = this.assigneeControl?.value || 'Me';
    return assignee.split(' ').map((n: string) => n).join('').toUpperCase().slice(0, 2);
  }

  getCurrentUserInitials(): string {
    const userdetails = this._helperService.getUserDetail();
    const name = userdetails?.Name[0].toUpperCase();
    return name;
  }

  cancelComment() {
    this.newComment = '';
  }

  trackByCommentId(index: number, c: any) { return c.guid || c.commentId; }


  getCommentUserInitials(c: Comment) {
    return c.author.split(' ').map(n => n).join('').toUpperCase().slice(0, 2);
  }

  // toggleCommentMenu(commentId: string) {
  //   this.currentTaskComments.forEach(c => c.showMenu = c.id === commentId ? !c.showMenu : false);
  //   // if (this.taskId) localStorage.setItem(`task-comments-${this.taskId}`, JSON.stringify(this.currentTaskComments));
  // }


  replyToComment(comment: Comment) {}
  loadComments(reset = true) {
    if(reset){
      this.currentTaskComments = [];
      this.commentsPage = 1;
      this.commentsHasMore = true;
    }
    if (!this.taskId || !this.commentsHasMore || this.isLoadingComments) return;
    this.isLoadingComments = true;
    let data = { 
      keyword: '',
      pageNumber: this.commentsPage,
      pageSize: this.commentsSize,
      orderBy: '',
      sortOrder: ''
    }
    this._taskService.getComments(data, this.taskId).then((res: any) => {
      const data: Comment[] = res.data ?? [];
      if(data.length < this.commentsSize) this.commentsHasMore = false;
      this.currentTaskComments = [...this.currentTaskComments, ...data];
      this.commentsPage++;
      this.isLoadingComments = false;
    });
  }
  
  addComment(event?: Event) {
    if (!this.newComment?.trim() || !this.taskId) return;
    let data = {
      commentId: 0,
      taskGuid: this.taskId,
      content: this.newComment,
    }
    this._taskService.createComment(data).then((comment:any) => {
      // this.currentTaskComments.unshift(this.newComment); // Add to top (or reload page if needed)
      this.newComment = '';
      this.loadComments(true);
    });
  }
  
  editComment(comment: Comment) {
    let data = {
      commentId: 0,
      taskGuid: this.taskId,
      guid: '',
      content: '',
    }
    // e.g. open an inline edit UI, then call update API:
    this._taskService.updateComment(data).then(() => {
      // Optionally reload or update locally
    });
  }
  
  // deleteComment(comment: Comment) {
  //   this._taskService.deleteComment(comment.id).then(() => {
  //     this.currentTaskComments = this.currentTaskComments.filter(c => c.id !== comment.id);
  //   });
  // }

  toggleCommentMenu(commentId: any) {
    // debugger
    this.currentTaskComments.forEach((c: any) => {
      if (c.commentId === commentId) {
        c.showMenu = !c.showMenu; // toggle only clicked one
      } else {
        c.showMenu = false;       // close all others
      }
    });
  }
  
  
  toggleEditComment(comment: any) {
    // Only this comment goes into edit mode
    this.currentTaskComments.forEach((c: any) => {
      c.isEditing = false; // reset all others
    });
  
    comment.isEditing = true;
    comment.showMenu = false;
    comment.editableContent = comment.content; // preload current text
  }
  
  cancelEdit(comment: any) {
    comment.isEditing = false;
  }
  
  saveComment(comment: any) {
    console.log(comment,"comment")
    try {
      const updatedContent = comment.editableContent.trim();
      if (!updatedContent) return;
      let req = {
        taskGuid: this.taskId,
        guid: comment.guid,
        content: updatedContent
      }
      // Call API to save update
      this._taskService.updateComment(req).then(res => {
        comment.content = updatedContent;  // update UI
        comment.isEditing = false;
      });
    } catch (err) {
      this._taskService.openSnackBar("Update failed", 'Close');
    }
  }
  
  deleteComment(comment: any) {
    if (confirm("Are you sure you want to delete this comment?")) {
      // this.commentService.deleteComment(comment.id).subscribe({
      //   next: () => {
      //     this.taskDetails.comments = this.taskDetails.comments.filter((c: any) => c.id !== comment.id);
      //   },
      //   error: (err) => {
      //     console.error("Delete failed", err);
      //   }
      // });
    }
  }
  
  // For infinite scroll
  onCommentsScroll(event: any) {
    const elem = event.target;
    if (elem.scrollHeight - elem.scrollTop <= elem.clientHeight + 80) {
      this.loadComments(false);
    }
  }
}