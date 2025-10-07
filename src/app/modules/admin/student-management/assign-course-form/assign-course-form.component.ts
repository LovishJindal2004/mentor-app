import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { User } from 'app/core/user/user.types';
import { CommanService } from 'app/modules/common/services/common.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-assign-course-form',
  imports: [MatToolbarModule, MatButtonModule, MatInputModule, CommonModule, MatIconModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatSlideToggleModule, MatDatepickerModule, MatChipsModule, MatSelectModule],
  templateUrl: './assign-course-form.component.html',
  styleUrl: './assign-course-form.component.scss'
})
export class AssignCourseFormComponent implements OnInit{

  registerForm: FormGroup;
  userModel: any;
  courses: any;
  constructor(
    public matDialogRef: MatDialogRef<AssignCourseFormComponent>,
    private _formBuilder : FormBuilder,
    private _commonService : CommanService,
    private _studentService : StudentService,
    @Inject(MAT_DIALOG_DATA) public _data: any,
  ){
    console.log(_data,"_data")
    this.registerForm = this._formBuilder.group({
      course: [''],
      startDate: [''],
      endDate: [''],
      IsActive: [false],
    });

    this.userModel = new User();
    this.userModel.Id = this._data.id;
    this.userModel.courseName = this._data.courseName;
    this.userModel.courseIds = this._data.courseId;
    this.userModel.startDate = this._data.startDate;
    this.userModel.endDate = this._data.endDate;
    this.userModel.endDate = this._data.endDate;
    this.userModel.isActive = this._data.subscriptionStatus ? this._data.subscriptionStatus : false;
  }
  ngOnInit(): void {
    // this._commonService.getCourses().subscribe((data)=> {
    //   this.courses = data;
    // });
  }
  assignCourse(user:any){
    let self = this;
    let payload = {
      courseId: user.courseIds,
      isActive: user.isActive,
      startDate: user.startDate,
      endDate: user.endDate,
      userId: user.Id,
    }
    this._studentService.assignedCourse(payload).then((data:any) => {
      self._studentService.openSnackBar('Course Assigned', 'Close');
      self._studentService.onStudentManagementChanged.next('');
      self._studentService.OnCourseAssignedtoStudentChanged.next('');
      this.matDialogRef.close();

    }).catch(err => {
      console.error('Error assigning course:', err);
      // Check if the error contains the messages array
      if (err.error && err.error.exception) {

        const errorMessage = err.error.exception
        self._studentService.openSnackBar(errorMessage, "Close");


      } else {
        // Fallback for other errors
        self._studentService.openSnackBar("An unexpected error occurred.", "Close");
      }
    });
  }
}
