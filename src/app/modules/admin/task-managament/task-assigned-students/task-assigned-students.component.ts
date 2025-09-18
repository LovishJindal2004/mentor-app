import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { helperService } from 'app/core/auth/helper';
import { TaskService } from '../task.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-assigned-students',
  imports: [MatTableModule, MatIconModule, MatPaginatorModule, MatButtonModule, RouterModule],
  templateUrl: './task-assigned-students.component.html',
  styleUrl: './task-assigned-students.component.scss'
})
export class TaskAssignedStudentsComponent  implements OnInit, OnDestroy {
  studentList: any[] = [];
  displayedColumns: string[] = ['UserName', 'Email', 'PhoneNumber','Status','Action'];
  dataSource = new MatTableDataSource<any>([]);
  private _unsubscribeAll = new Subject<void>();
  confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dialogRef: any;
  userDetails: any;
  taskGuid: string;
  taskName: string;

  constructor(
    private _taskService: TaskService,
    private _helperService: helperService,
    private _router: ActivatedRoute,
  ) {
    this._router.params.subscribe(res=>{
      this.taskGuid = res?.taskId
    })
    // this.userDetails = this._helperService.getUserDetail();

  }

  ngOnInit(): void {
    this._taskService.onAssignedStudentManagementChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        const req = {
          keyword: '',
          pageNumber: 1,
          pageSize: 10,
          orderBy: '',
          sortOrder: ''
        };
        this._taskService.getAssignedStudentList(this.taskGuid).then((res: any) => {
          this.studentList = res?.assignedTo || [];
          this.taskName = res?.title
          this.dataSource = new MatTableDataSource(this.studentList);
          this.dataSource.paginator = this.paginator; // ✅ attach paginator
        });
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
