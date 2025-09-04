import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MentorService } from './mentor.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MentorFormComponent } from './mentor-form/mentor-form.component';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-mentor-management',
  imports: [MatTableModule, MatIconModule,MatSortModule, MatMenuModule, MatPaginatorModule, MatButtonModule, RouterModule, CommonModule, MatFormFieldModule, FormsModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './mentor-management.component.html',
  styleUrl: './mentor-management.component.scss'
})
export class MentorManagementComponent implements OnInit, OnDestroy {
  mentorList: any[] = [];
  displayedColumns: string[] = ['UserName', 'Email', 'PhoneNumber','Status', 'Action'];
  dataSource = new MatTableDataSource<any>([]);
  private _unsubscribeAll = new Subject<void>();
  confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;
  searchControl = new FormControl('');
  dialogRef: any;
  keyword='';
  constructor(
    private _mentorService: MentorService,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this._mentorService.onMentorManagementChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.loadMentors();
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
        this.loadMentors();
      });
      this.loadMentors();
  }
  loadMentors(): void {
    const req = {
      keyword: this.keyword,
      pageNumber: this.pageIndex + 1, // API is 1-based
      pageSize: this.pageSize,
      orderBy: '',
      sortOrder: ''
    };

    this._mentorService.getMentorList(req).then((res: any) => {
      this.mentorList = res?.data || [];
      this.dataSource = new MatTableDataSource(this.mentorList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort; 
      this.totalCount = res?.totalCount || 0;
      this.pageSize = res?.pageSize || this.pageSize;
    });
  }
  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMentors();
  }
  onSortChange(sort: Sort) {
    this.pageIndex = 0;
    this.loadMentorsWithSort(sort);
  }
  loadMentorsWithSort(sort: Sort): void {
    const req = {
      keyword: this.keyword,
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      orderBy: sort.active,       // e.g., "Email"
      sortOrder: sort.direction   // "asc" | "desc"
    };
    this._mentorService.getMentorList(req).then((res: any) => {
      this.mentorList = res?.data || [];
      this.dataSource = new MatTableDataSource(this.mentorList);
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
  addMentor() {
    var self = this;
    this.dialogRef = this._matDialog.open(MentorFormComponent, {
      panelClass: 'user-form-dialog',
      data: {
        action: 'new'
      }
    });
    // this.dialogRef.afterClosed()
    //     .subscribe((response: any) => {
    //         console.log(response,"response")
    //         if (!response) {
    //             return;
    //         }
    //         const payload = {
    //           ...response,
    //           confirmPassword: response.password,
    //           role: 'Mentor',
    //           phoneCountryCode: '+91',

    //       };
    //       this._mentorService.createUser(payload).subscribe({
    //         next: (message: string) => {
    //           console.log(message, "data response");
    //           this._mentorService.openSnackBar(message, 'Close');
    //           this._mentorService.onMentorManagementChanged.next('');
    //         },
    //         error: (err) => {
    //           console.error('Error creating user:', err);

    //           if (err.error && err.error.exception) {
    //             const errorMessage = err.error.exception;
    //             this._mentorService.openSnackBar(errorMessage, "Close");
    //           } else if (typeof err.error === 'string') {
    //             // sometimes backend sends plain text errors too
    //             this._mentorService.openSnackBar(err.error, "Close");
    //           } else {
    //             this._mentorService.openSnackBar("An unexpected error occurred.", "Close");
    //           }
    //         }
    //       });
    //     });
  }
  editUser(id) {
    var self = this;
    this.dialogRef = this._matDialog.open(MentorFormComponent, {
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
    //       role: 'Mentor',

    //     };
    //     this._mentorService.updateUser(payload).then(res=>{
    //       self._mentorService.openSnackBar(res.message, 'Close');
    //       self._mentorService.onMentorManagementChanged.next('');
    //     })
    //     let data = {
    //       courseIds: payload.courseIds,
    //       userId: payload.id
    //     }
    //     this._mentorService.assignedCourse(data).then(res=>{

    //     })
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
        this._mentorService.deleteUser(req);
        this._mentorService.onMentorManagementChanged.next('');
      }
      this.confirmDialogRef = null;
    });

  }
  UndeleteUser(userDetails) {
    userDetails.isDeleted = false;
    this._mentorService.updateUser(userDetails).then(res => {
      this._mentorService.onMentorManagementChanged.next('');
    })
  }
  activeUser(userDetails) {
    userDetails.isActive = true;
    this._mentorService.updateUser(userDetails).then(res => {
      this._mentorService.onMentorManagementChanged.next('');
    })
  }
  inactiveUser(userDetails) {
    userDetails.isActive = false;
    this._mentorService.updateUser(userDetails).then(res => {
      this._mentorService.onMentorManagementChanged.next('');
    })
  }

}

