import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StudentService } from '../student.service';
import { AssignCourseFormComponent } from '../assign-course-form/assign-course-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-course',
  imports: [
    // MatTableDataSource,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCheckboxModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './assign-course.component.html',
  styleUrl: './assign-course.component.scss'
})
export class AssignCourseComponent implements OnInit, OnDestroy {
  courseList: any[] = [];
  displayedColumns: string[] = ['Action', 'CourseName'];
  dataSource = new MatTableDataSource<any>([]);
  private _unsubscribeAll = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // From dialog data
  assignedCourses: any;
  userId: any;

  // Pagination
  totalCount = 0;
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20];
  dialogRef: any;

  constructor(
    private _studentService: StudentService,
    private _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
    console.log(_data,"_data")
    this.assignedCourses = this._data?.list;
    this.userId = this._data?.action;
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex + 1;
        this.loadCourses();
      });
    }
  }

  private loadCourses(): void {

    this._studentService.getUnassignedCourseList(this.userId).then((res: any) => {
      this.courseList =res

      this.dataSource = new MatTableDataSource(this.courseList);
    });
  }

  assignCourses(): void {
    const selectedCourseIds = this.courseList
      .filter(course => course.selected)
      .map(course => course.courseId);

    const payload = {
      userId: this.userId,
      courseIds: selectedCourseIds
    };

    // this._studentService.assignCourseToUser(payload).then(res => {
    //   if (res) {
    //     this._matDialog.closeAll();
    //     this._studentService.onCourseAssignmentChanged.next('');
    //   }
    // });
  }

  closeDialog(): void {
    this._matDialog.closeAll();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  courseSelected(course) {
    const req = {
      id: this.userId,
      courseName: course.courseName,
      courseId: course.courseId,
      startDate: course.startDate,
      endDate: course.endDate,
      subscriptionStatus: course.isActive,
    };
  
    // Close the current popup (optional)
    this._matDialog.closeAll();
  
    // ✅ Correct way to open the next popup
    this.dialogRef = this._matDialog.open(AssignCourseFormComponent, {
      panelClass: 'user-course-form-dialog',
      width: '600px',
      disableClose: true,
      data: req
    });
  }
  
}
