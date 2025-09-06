import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { CommanService } from 'app/modules/common/services/common.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { StudentService } from '../student.service';
import { CourseService } from '../../course-management/course.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student-form',
  imports: [MatToolbarModule, MatButtonModule, MatInputModule, CommonModule, MatIconModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatSlideToggleModule, MatDatepickerModule, MatChipsModule, MatSelectModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.scss'
})
export class StudentFormComponent {
  dialogTitle: any;
  userModel: any;
  registerForm: FormGroup;
  private _unsubscribeAll: Subject<any>;
  action: any;
  countryList: any;
  categoryList: any;
  courses: any;
  stateList: any;
  instituteList: any;
  // selectedRoles: any;
  // roleOptions: any;

  constructor(
    public matDialogRef: MatDialogRef<StudentFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _commonService: CommanService,
    private _courseService: CourseService,
    private _studentService: StudentService,
  ) {
    this._unsubscribeAll = new Subject();
    this.action = _data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Mentee';
      console.log(_data?.userId, "_data")
      this._studentService.getUserDetailsbyId(_data?.userId).then((res: any) => {

        this.userModel = res;
        this.userModel.courseIds = res?.courseIds[0];

        this.userModel.collegeID = res.collegeId;
        this.userModel.MedicalCourseYear = res.medicalCourseYear;

        this.onChangeCountry({ value: this.userModel.countryId });

        this.onChangeState({ value: this.userModel.stateId });
      })


    }
    else {
      this.dialogTitle = 'Add New Mentee ';

      this.userModel = new User();
    }
    var self = this;

    this.registerForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      // role: ['Mentor', Validators.required],
      mobile: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      institute: [''],
      category: [''],
      dateOfBirth: [''],
      IsActive: [true, Validators.required],
      isDeleted: ['']
      // UniqueID: ['', Validators.nullValidator],
      // Tenant: ['', Validators.required],
      // RegNo: ['']
    });

    this._commonService.getCountry().then(function (data) {
      self.countryList = data;
    });
    this._commonService.getStudentCategory().then(function (data) {
      self.categoryList = data;
    });
    this._commonService.getCourses().subscribe(function (data) {
      self.courses = data;
    });
  }
  updateUser(User: any) {
    this.matDialogRef.close(User);
  }
  onChangeCountry(event: any) {
    var self = this;

    self._commonService.getStateByCountry(event.value).then(function (data) {
      self.stateList = data;
    });
  }
  onChangeState(event: any) {
    var self = this;

    self._commonService.getCollegeByState(event.value).then(function (data) {
      self.instituteList = data;
    });
  }
  save(userModel: any) {
    var self = this;
    if (this.action === 'edit') {
      const payload = {
        ...userModel,
        password: userModel.password || "",
        confirmPassword: userModel.password || "",
        // CurrentPassword: response.password || "",
        phoneCountryCode: '+91',
        role: 'Mentee',

      };
      let data = {
        courseId: payload.courseIds,
        userId: payload.id
      }
      this._studentService.updateUser(payload).then(function (data) {
        self._studentService.openSnackBar(data.message, 'Close');
        self._studentService.onStudentManagementChanged.next('');
        self.matDialogRef.close();
      });
    } else {
      const payload = {
        ...userModel,
        confirmPassword: userModel.password,
        role: 'Mentee',
        phoneCountryCode: '+91',
        isActive:true

      };
      this._studentService.createUser(payload).subscribe((data) => {
        self._studentService.openSnackBar(data, 'Close');
        self._studentService.onStudentManagementChanged.next('');
        self.matDialogRef.close();

      })
    }
  }
}

