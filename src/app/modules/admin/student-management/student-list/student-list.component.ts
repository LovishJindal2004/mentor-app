// student-list.component.ts
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { StudentService } from '../student.service';
import { StudentFormComponent } from '../student-form/student-form.component';
import { AssignMentorComponent } from '../assign-mentor/assign-mentor.component';
import { AssignCourseFormComponent } from '../assign-course-form/assign-course-form.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-student-list',
  imports: [MatTableModule, MatIconModule, MatSortModule, MatMenuModule, MatPaginatorModule, MatButtonModule, DatePipe, CommonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent implements OnInit, OnDestroy {
  studentList: any[] = [];
  // FIXED: Added missing columns that exist in your HTML template
  displayedColumns: string[] = ['UserName', 'Email', 'PhoneNumber','Course', 'StartEnd', 'EndDate', 'SubsciptionStatus', 'Action','AssignCourse'];
  dataSource = new MatTableDataSource<any>([]);
  private _unsubscribeAll = new Subject<void>();
  confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;
  searchControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalCount = 0;   
  pageSize = 10;    
  pageIndex = 0;
  dialogRef: any;
  keyword = '';

  constructor(
    private _studentService: StudentService,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this._studentService.onStudentManagementChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.loadMentee();
      });
      
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),          
        distinctUntilChanged(),     
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(value => {
        this.keyword = value || '';
        this.pageIndex = 0;
        this.loadMentee();
      });
      
    this.loadMentee();
  }

  loadMentee(): void {
    const req = {
      keyword: this.keyword,
      pageNumber: this.pageIndex + 1, // API uses 1-based indexing
      pageSize: this.pageSize,
      orderBy: '',
      sortOrder: ''
    };

    this._studentService.getStudentList(req).then((res: any) => {
      this.studentList = res?.data || [];
      
      // MAIN FIX: Don't assign paginator and sort to dataSource for server-side pagination
      this.dataSource = new MatTableDataSource(this.studentList);
      
      // Update pagination info from API response
      this.totalCount = res?.totalCount || 0;
      this.pageSize = res?.pageSize || this.pageSize;
      
      // IMPORTANT FIX: Update paginator state manually
      if (this.paginator) {
        this.paginator.pageIndex = this.pageIndex;
        this.paginator.pageSize = this.pageSize;
        this.paginator.length = this.totalCount;
      }
    }).catch(error => {
      console.error('Error loading students:', error);
      this.studentList = [];
      this.dataSource = new MatTableDataSource([]);
      this.totalCount = 0;
    });
  }
  
  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMentee();
  }

  onSortChange(sort: Sort): void {
    this.pageIndex = 0; // Reset to first page when sorting
    this.loadMenteeWithSort(sort);
  }
  
  loadMenteeWithSort(sort: Sort): void {
    const req = {
      keyword: this.keyword,
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      orderBy: sort.active,
      sortOrder: sort.direction
    };
    
    this._studentService.getStudentList(req).then((res: any) => {
      this.studentList = res?.data || [];
      this.dataSource = new MatTableDataSource(this.studentList);
      
      this.totalCount = res?.totalCount || 0;
      this.pageSize = res?.pageSize || this.pageSize;
      
      if (this.paginator) {
        this.paginator.pageIndex = this.pageIndex;
        this.paginator.pageSize = this.pageSize;
        this.paginator.length = this.totalCount;
      }
    }).catch(error => {
      console.error('Error loading students with sort:', error);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  AssignCourse(element: any): void {
    this.dialogRef = this._matDialog.open(AssignCourseFormComponent, {
      panelClass: 'user-course-form-dialog',
      data: { action: element }
    });
    
    // Uncomment and modify as needed
    // this.dialogRef.afterClosed().subscribe((response: any) => {
    //   if (!response) return;
    //   // Handle response
    // });
  }

  addStudent(): void {
    this.dialogRef = this._matDialog.open(StudentFormComponent, {
      panelClass: 'user-form-dialog',
      data: { action: 'new' }
    });
    
    // Uncomment and modify as needed
    // this.dialogRef.afterClosed().subscribe((response: any) => {
    //   if (!response) return;
    //   // Handle response
    // });
  }

  editUser(id: string): void {
    this.dialogRef = this._matDialog.open(StudentFormComponent, {
      panelClass: 'user-form-dialog',
      data: { action: 'edit', userId: id }
    });
    
    // Uncomment and modify as needed
    // this.dialogRef.afterClosed().subscribe((response: any) => {
    //   if (!response) return;
    //   // Handle response
    // });
  }

  deleteUser(UserID: any): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmationDialogComponent, {
      disableClose: false,
      panelClass: 'delete-dialog'
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const req = { id: UserID };
        this._studentService.deleteUser(req);
        this._studentService.onStudentManagementChanged.next('');
      }
      this.confirmDialogRef = null;
    });
  }

  assignMentor(student: any): void {
    this.dialogRef = this._matDialog.open(AssignMentorComponent, {
      panelClass: 'assign-student-dialog',
      data: student?.id
    });
  }

  UndeleteUser(userDetails: any): void {
    userDetails.isDeleted = false;
    this._studentService.updateUser(userDetails).then(res => {
      this._studentService.onStudentManagementChanged.next('');
    });
  }
}