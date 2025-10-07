import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student.service';
import { DatePipe, CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AssignCourseComponent } from '../assign-course/assign-course.component';
import { AssignCourseFormComponent } from '../assign-course-form/assign-course-form.component';

@Component({
  selector: 'app-assigned-course',
  imports: [MatTableModule,CommonModule, MatDialogModule, MatIconModule, MatSortModule, MatMenuModule, MatPaginatorModule, MatButtonModule, DatePipe, CommonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  
  templateUrl: './assigned-course.component.html',
  styleUrl: './assigned-course.component.scss'
})
export class AssignedCourseComponent implements OnInit {
  assignedCourses: any[] = [];
  userId: string;
  displayedColumns: string[] = ['courseName', 'startDate', 'endDate', 'isActive','Edit'];
  dialogRef: any;

  constructor(
    private _router: ActivatedRoute,
    private _studentService: StudentService,
    private router: Router,
    private _matDialog: MatDialog,

  ) {
    this._router.params.subscribe(params => {
      this.userId = params?.['userId'];
    });
  }

  ngOnInit(): void {
    this.loadAssignedCourses();
    this._studentService.OnCourseAssignedtoStudentChanged.subscribe(res=>{      
      this.loadAssignedCourses();
    })
  }

  loadAssignedCourses() {
    this._studentService.getassignedCourse(this.userId).then((res: any[]) => {
      this.assignedCourses = res || [];
    }).catch(err => {
      console.error('Error fetching assigned courses:', err);
    });
  }

  goBack() {
    this.router.navigate(['/student']); // adjust route as needed
  }
  AddCourse(){
    this.dialogRef = this._matDialog.open(AssignCourseComponent, {
      panelClass: 'user-course-form-dialog',
      data: { action: this.userId }
    });
  }
  editSubscription(course) {
    const req = {
      id: this.userId,
      courseName: course.courseName,
      courseId: course.courseId,
      startDate: course.startDate,
      endDate: course.endDate,
      subscriptionStatus: course.isActive,
    };
  
    // ✅ Correct way to open the next popup
    this.dialogRef = this._matDialog.open(AssignCourseFormComponent, {
      panelClass: 'user-course-form-dialog',
      width: '600px',
      disableClose: true,
      data: req
    });
  }
}

