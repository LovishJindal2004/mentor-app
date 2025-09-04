import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { helperService } from 'app/core/auth/helper';
import { StudentService } from '../../student-management/student.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-assign-student',
  imports: [MatTableModule, MatIconModule, MatPaginatorModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './assign-student.component.html',
  styleUrl: './assign-student.component.scss'
})
export class AssignStudentComponent implements OnInit, OnDestroy {
  studentList: any[] = [];
  displayedColumns: string[] = ['checkbox','UserName', 'Email', 'PhoneNumber'];
  dataSource = new MatTableDataSource<any>([]);
  private _unsubscribeAll = new Subject<void>();
  confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;

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
        const req = {
          keyword: '',
          pageNumber: 1,
          pageSize: 10,
          orderBy: '',
          sortOrder: ''
        };
        this._studentService.getAssignedStudentList(req,this.userDetails?.Id).then((res: any) => {
          this.studentList = res?.data || [];
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