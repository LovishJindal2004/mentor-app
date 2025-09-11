import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StudentService } from '../student.service';
import { helperService } from 'app/core/auth/helper';

@Component({
  selector: 'app-view-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './view-reports.component.html',
  styleUrl: './view-reports.component.scss'
})
export class ViewReportsComponent implements OnInit {
  selectedTab = 0;
  selectedDate: Date | null = null;
  selectedSubject = 'Anatomy';
  selectedStudent: any;
  students: any[] = [];
  selectedActivity = "Today's Activity";
  activityOptions = ["Today's Activity", 'Weekly Summary', 'Monthly Report'];
  userDetails: any;

  currentReport: any = null; // Store single report object

  constructor(
    private _studentService: StudentService,
    private _helperService: helperService,
  ) {
    this.userDetails = this._helperService.getUserDetail();
  }

  ngOnInit(): void {
    const req = {
      keyword: '',
      pageNumber: 1,
      pageSize: 100,
      orderBy: '',
      sortOrder: ''
    };
    this._studentService.getAssignedStudentList(req, this.userDetails?.Id).then((res: any) => {
      this.students = res?.data || [];
      if (this.students.length > 0) {
        this.selectedStudent = this.students[0];
        this.onStudentChange(this.selectedStudent);
      }
    });
  }

  onStudentChange(student: any): void {
    if (!student) return;
    this.selectedStudent = student;
    this._studentService.getStudentReport(student.id).then((res: any) => {
      this.currentReport = res; // Direct assignment since response is a single object
    });
  }
}
