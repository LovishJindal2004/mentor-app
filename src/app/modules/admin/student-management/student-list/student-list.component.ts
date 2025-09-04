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
  displayedColumns: string[] = ['UserName', 'Email', 'PhoneNumber','Course','SubsciptionStatus', 'Action','AssignCourse'];
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
  keyword='';

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
        this.pageIndex = 0; // reset to first page when searching
        this.loadMentee();
      });
      this.loadMentee();
  }
  loadMentee(): void {
    const req = {
      keyword: this.keyword,
      pageNumber: this.pageIndex + 1, // API is 1-based
      pageSize: this.pageSize,
      orderBy: '',
      sortOrder: ''
    };

    this._studentService.getStudentList(req).then((res: any) => {
      this.studentList = res?.data || [];
      this.dataSource = new MatTableDataSource(this.studentList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort; 
      this.totalCount = res?.totalCount || 0;
      this.pageSize = res?.pageSize || this.pageSize;
    });
  }
  
  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMentee();
  }
  onSortChange(sort: Sort) {
    this.pageIndex = 0;
    this.loadMenteeWithSort(sort);
  }
  
  loadMenteeWithSort(sort: Sort): void {
    const req = {
      keyword: this.keyword,
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      orderBy: sort.active,       // e.g., "Email"
      sortOrder: sort.direction   // "asc" | "desc"
    };
    this._studentService.getStudentList(req).then((res: any) => {
      this.studentList = res?.data || [];
      this.dataSource = new MatTableDataSource(this.studentList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort; 
      this.totalCount = res?.totalCount || 0;
      this.pageSize = res?.pageSize || this.pageSize;
    });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  AssignCourse(element){
    var self = this;
    this.dialogRef = this._matDialog.open(AssignCourseFormComponent, {
      panelClass: 'user-course-form-dialog',
      data: {
        action: element
      }
    });
    // this.dialogRef.afterClosed()
    //   .subscribe((response: any) => {
    //     console.log(response, "response")
    //     if (!response) {
    //       return;
    //     }
    //     let payload = {
    //       courseId: response.courseIds,
    //       isActive: response.isActive,
    //       startDate: response.startDate,
    //       endDate: response.endDate,
    //       userId: response.Id,
    //     }
    //     this._studentService.assignedCourse(payload).then((data:any) => {
    //       self._studentService.openSnackBar('Course Assigned', 'Close');
    //       self._studentService.onStudentManagementChanged.next('');

    //     }).catch(err => {
    //       console.error('Error assigning course:', err);
    //       // Check if the error contains the messages array
    //       if (err.error && err.error.exception) {

    //         const errorMessage = err.error.exception
    //         self._studentService.openSnackBar(errorMessage, "Close");


    //       } else {
    //         // Fallback for other errors
    //         self._studentService.openSnackBar("An unexpected error occurred.", "Close");
    //       }
    //     });
    //   });
  }
  addStudent() {
    var self = this;
    this.dialogRef = this._matDialog.open(StudentFormComponent, {
      panelClass: 'user-form-dialog',
      data: {
        action: 'new'
      }
    });
    // this.dialogRef.afterClosed()
    //   .subscribe((response: any) => {
    //     console.log(response, "response")
    //     if (!response) {
    //       return;
    //     }
    //     const payload = {
    //       ...response,
    //       confirmPassword: response.password,
    //       role: 'Mentee',
    //       phoneCountryCode: '+91',

    //     };
    //     this._studentService.createUser(payload).then((data) => {
    //       self._studentService.openSnackBar(data, 'Close');
    //       self._studentService.onStudentManagementChanged.next('');

    //     }).catch(err => {
    //       console.error('Error creating user:', err);
    //       // Check if the error contains the messages array
    //       if (err.error && err.error.exception) {

    //         const errorMessage = err.error.exception
    //         self._studentService.openSnackBar(errorMessage, "Close");


    //       } else {
    //         // Fallback for other errors
    //         self._studentService.openSnackBar("An unexpected error occurred.", "Close");
    //       }
    //     });
    //   });
  }
  editUser(id) {
    var self = this;
    this.dialogRef = this._matDialog.open(StudentFormComponent, {
      panelClass: 'user-form-dialog',
      data: {
        action: 'edit',
        userId: id
      }
    });
    // this.dialogRef.afterClosed()
    //   .subscribe((response: any) => {
    //     if (!response) {
    //       return;
    //     }
    //     const payload = {
    //       ...response,
    //       password: response.password || "",
    //       confirmPassword: response.password || "",
    //       // CurrentPassword: response.password || "",
    //       phoneCountryCode: '+91',
    //       role: 'Mentee',

    //     };
    //     let data = {
    //       courseId: payload.courseIds,
    //       userId: payload.id
    //     }
    //         this._studentService.updateUser(payload).then(function (data) {
    //           self._studentService.openSnackBar(data.message, 'Close');
    //           self._studentService.onStudentManagementChanged.next('');
    //         });          
    //   });

  }
  deleteUser(UserID: any): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmationDialogComponent, {
      disableClose: false,
      panelClass: 'delete-dialog'
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        let req = {
          id: UserID
        }
        this._studentService.deleteUser(req);
        this._studentService.onStudentManagementChanged.next('');
      }
      this.confirmDialogRef = null;
    });

  }
  assignMentor(student){
    this.dialogRef = this._matDialog.open(AssignMentorComponent, {
      panelClass: 'assign-student-dialog',
      data: student?.id
  });
  }
  UndeleteUser(userDetails){
    userDetails.isDeleted = false;
    this._studentService.updateUser(userDetails).then(res=>{
      this._studentService.onStudentManagementChanged.next('');
    })
  }

}

