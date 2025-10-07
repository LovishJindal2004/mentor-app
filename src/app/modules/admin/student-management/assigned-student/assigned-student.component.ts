import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { StudentService } from '../student.service';
import { helperService } from 'app/core/auth/helper';

@Component({
  selector: 'app-assigned-student',
  imports: [MatTableModule, MatIconModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './assigned-student.component.html',
  styleUrl: './assigned-student.component.scss'
})
export class AssignedStudentComponent implements OnInit, OnDestroy {
  studentList: any[] = [];
  displayedColumns: string[] = ['UserName', 'Email', 'PhoneNumber'];
  dataSource = new MatTableDataSource<any>([]);
  private _unsubscribeAll = new Subject<void>();
  confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;
  totalCount: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dialogRef: any;
  userDetails: any;

  constructor(
    private _studentService: StudentService,
    private _helperService: helperService,
  ) {
    this.userDetails = this._helperService.getUserDetail();
  }

  ngOnInit(): void {
    this._studentService.onStudentManagementChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.loadStudents(1, 10);
      });
  }

  ngAfterViewInit(): void {
    // Listen to paginator changes
    this.paginator.page
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((event: PageEvent) => {
        this.loadStudents(event.pageIndex + 1, event.pageSize);
      });
  }

  loadStudents(pageNumber: number, pageSize: number): void {
    const req = {
      keyword: '',
      pageNumber: pageNumber,
      pageSize: pageSize,
      orderBy: '',
      sortOrder: ''
    };
    
    this._studentService.getAssignedStudentList(req, this.userDetails?.Id).then((res: any) => {
      this.studentList = res?.data || [];
      this.totalCount = res?.totalCount || 0;
      this.dataSource = new MatTableDataSource(this.studentList);
      // Don't attach paginator here - it causes issues with server-side pagination
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}