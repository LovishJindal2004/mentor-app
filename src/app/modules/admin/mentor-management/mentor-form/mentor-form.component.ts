import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MentorService } from '../mentor.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';


@Component({
  selector: 'app-mentor-form',
  imports: [MatToolbarModule, MatButtonModule, MatTabsModule, MatInputModule, CommonModule, MatIconModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatSlideToggleModule, MatDatepickerModule, MatChipsModule, MatSelectModule],
  templateUrl: './mentor-form.component.html',
  styleUrl: './mentor-form.component.scss'
})
export class MentorFormComponent {
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
  expertiseChips: string[] = [];
  // selectedRoles: any;
  // roleOptions: any;

  constructor(
    public matDialogRef: MatDialogRef<MentorFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _commonService: CommanService,
    private _mentorService: MentorService,
  ) {
    this._unsubscribeAll = new Subject();
    this.action = _data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Mentor';
      console.log(_data?.userId, "_data")
      this._mentorService.getUserDetailsbyId(_data?.userId).then((res: any) => {

        this.userModel = res;

        this.userModel.collegeID = res.collegeId;
        this.userModel.MedicalCourseYear = res.medicalCourseYear;

        this.onChangeCountry({ value: this.userModel.countryId });

        this.onChangeState({ value: this.userModel.stateId });

        const certificationsHtml = this.userModel.certifications;

        const certArray = this.parseHtmlListToArray(certificationsHtml);

        const formArray = this.registerForm.get('certifications') as FormArray;
        formArray.clear();

        certArray.forEach(cert => formArray.push(new FormControl(cert)));

        this.expertiseChips = this.parseHtmlListToArray(this.userModel.expertiseAreas);
        
        const expertiseAreasHtml = this.userModel.expertiseAreas;

        const expertiseArray = this.parseHtmlListToArray(expertiseAreasHtml);

        const formArray2 = this.registerForm.get('expertiseAreas') as FormArray;
        formArray2.clear();

        expertiseArray.forEach(cert => formArray2.push(new FormControl(cert)));
      })


    }
    else {
      this.dialogTitle = 'Add New Mentor';

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
      isDeleted: [''],
      course: [''],
      bio: [''],
      experienceYears: [''],
      expertiseAreas: this._formBuilder.array([]),
      certifications: this._formBuilder.array([]),
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
  parseHtmlListToArray(htmlString: string): string[] {
    if (!htmlString) return [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    const lis = tempDiv.querySelectorAll('li');
    return Array.from(lis).map(li => li.textContent?.trim() || '');
  }
  get certifications(): FormArray {
    return this.registerForm.get('certifications') as FormArray;
  }
  
  addCertificate() {
    this.certifications.push(new FormControl(''));
  }
  
  removeCertificate(index: number) {
    this.certifications.removeAt(index);
  }
  get expertiseAreas(): FormArray {
    return this.registerForm.get('expertiseAreas') as FormArray;
  }
  addExpertiseFromInput(value: string) {
    const trimmedValue = value.trim();
    if (trimmedValue && !this.expertiseChips.includes(trimmedValue)) {
      this.expertiseChips.push(trimmedValue);
    }
  }
  removeExpertiseChip(index: number) {
    this.expertiseChips.splice(index, 1);
  }
  
  addexpertiseArea() {
    this.expertiseAreas.push(new FormControl(''));
  }
  
  removeexpertiseArea(index: number) {
    this.expertiseAreas.removeAt(index);
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
  convertArrayToHtmlList(arr: string[]): string {
    if (!arr || arr.length === 0) {
      return '';
    }
    let htmlList = '<ul>';
    for (let item of arr) {
      htmlList += `<li>${item}</li>`;
    }
    htmlList += '</ul>';
    return htmlList;
  }
  save(user: any) {
    const certificationArray = this.registerForm.get('certifications').value;
    const certificationsHtmlString = this.convertArrayToHtmlList(certificationArray);
    // const expertiseAreasArray = this.registerForm.get('expertiseAreas').value;
    const expertiseAreasHtmlString = this.convertArrayToHtmlList(this.expertiseChips);
    user.certifications = certificationsHtmlString;
    user.expertiseAreas = expertiseAreasHtmlString;
    var self = this;
    if (this.action === 'edit') {
      const payload = {
        ...user,
        password: user.password || "",
        confirmPassword: user.password || "",
        // CurrentPassword: response.password || "",
        phoneCountryCode: '+91',
        role: 'Mentor',

      };
      this._mentorService.updateUser(payload).then(res=>{
        self._mentorService.openSnackBar(res.message, 'Close');
        self._mentorService.onMentorManagementChanged.next('');
        this.matDialogRef.close();
      })
      let data = {
        courseIds: payload.courseIds,
        userId: payload.id
      }
      this._mentorService.assignedCourse(data).then(res=>{
      })
    }else{
      const payload = {
        ...user,
        confirmPassword: user.password,
        role: 'Mentor',
        phoneCountryCode: '+91',
        isActive:true

      };
      this._mentorService.createUser(payload).subscribe({
        next: (message: string) => {
          console.log(message, "data response");
          this._mentorService.openSnackBar(message, 'Close');
          this._mentorService.onMentorManagementChanged.next('');
          this.matDialogRef.close();
        },
        error: (err) => {
          console.error('Error creating user:', err);

          if (err.error && err.error.exception) {
            const errorMessage = err.error.exception;
            this._mentorService.openSnackBar(errorMessage, "Close");
          } else if (typeof err.error === 'string') {
            // sometimes backend sends plain text errors too
            this._mentorService.openSnackBar(err.error?.messages[0], "Close");
          } else {
            this._mentorService.openSnackBar("An unexpected error occurred.", "Close");
          }
        }
      });
    }
  }
}
