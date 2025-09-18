import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { StudentService } from '../../student-management/student.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-student',
  imports: [MatTableModule, MatIconModule, MatPaginatorModule, MatButtonModule, MatCheckboxModule, FormsModule],
  templateUrl: './assign-student.component.html',
  styleUrl: './assign-student.component.scss'
})
export class AssignStudentComponent implements OnInit, OnDestroy {
  studentList: any[] = [];
  displayedColumns: string[] = ['Action', 'UserName', 'Email', 'PhoneNumber'];
  dataSource = new MatTableDataSource<any>([]);
  private _unsubscribeAll = new Subject<void>();
  confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dialogRef: any;
  assignedUsers: any;
  mentorId: any;

  // Pagination properties
  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20];

  constructor(
    private _studentService: StudentService,
    private _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private _data: any,
  ) {
    console.log(this._data, "_data");
    this.assignedUsers = this._data?.list;
    this.mentorId = this._data?.mentorId;
  }

  ngOnInit(): void {
    this._studentService.onAssignBulkStudent
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.loadStudents();
      });
  }

  ngAfterViewInit(): void {
    // Set up paginator event listener
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex + 1; // MatPaginator is 0-based, API is 1-based
        this.loadStudents();
      });
    }
  }

  private loadStudents(): void {
    const req = {
      keyword: '',
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      orderBy: '',
      sortOrder: ''
    };

    this._studentService.getUnAssignedStudentList(req).then((res: any) => {
      const assignedIds = this.assignedUsers?.map((u: any) => u.id) || [];

      this.studentList = (res?.data || []).map((student: any) => ({
        ...student,
        selected: assignedIds.includes(student.id) // mark assigned students
      }));

      // Update pagination info from API response
      this.totalCount = res?.totalCount || 0;
      this.currentPage = res?.currentPage || 1;

      // Update data source without paginator (we handle pagination manually)
      this.dataSource = new MatTableDataSource(this.studentList);
      
      // Don't attach paginator to dataSource - we're handling it manually
      // this.dataSource.paginator = this.paginator; // ❌ Remove this line
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  assignMentor() {
    const selectedStudentIds = this.studentList
      .filter(student => student.selected)
      .map(student => student.id);

    // Log as JSON array
    let data = {
      "mentorGuid": this.mentorId,
      "studentList": selectedStudentIds
    }
    this._studentService.assignedMentortoStudent(data).then(res => {
      if(res){
        this._matDialog.closeAll();
        this._studentService.onStudentManagementChanged.next('');
      }
    })
  }

  closeDialog(){    
    this._matDialog.closeAll();
  }
}