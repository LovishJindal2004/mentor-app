import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StudentService } from '../student.service';
import { helperService } from 'app/core/auth/helper';
import { TaskService } from '../../task-managament/task.service';
import { MatInputModule } from '@angular/material/input';

interface CourseModule {
  title: string;
  duration: string;
  assignmentStatus: string;
  dueDate?: string;
  isAssigned: boolean;
  color?: string;
  progress?: number; // Progress percentage (0-100)
}

@Component({
  selector: 'app-view-progress',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './view-progress.component.html',
  styleUrl: './view-progress.component.scss'
})
export class ViewProgressComponent implements OnInit {
  courseModules: any = [];
  selectedDate: Date | null = null;
  selectedVideoOption: string = 'Video';
  videoOptions: string[] = ['Video', 'Test', 'QBank'];
  
  selectedSubject: any;
  subjects: any = [];

  examTypes: any = [];
  selectedExamType: any;
  
  selectedStudent: any;
  students: any = [];
  userDetails: any;

  constructor(
    private _studentService: StudentService,
    private _helperService: helperService,
    private _cdr: ChangeDetectorRef,
  ){    
    this.userDetails = this._helperService.getUserDetail();
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    this._cdr.detectChanges();
    this.loadData();
  }

  onSubjectChange(subject: any): void {
    this.selectedSubject = subject;
    this.loadData();
  }

  onExamTypeChange(examtype: any): void {
    this.selectedExamType = examtype;
    this.loadData();
  }

  onStudentChange(student: any): void {
    this.selectedStudent = student;
    // Reset and reload subjects/exam types for the new student
    this.resetAndLoadOptions();
  }

  onVideoOptionChange(option: string): void {
    this.selectedVideoOption = option;
    this.courseModules = []; // Clear existing data
    this.resetAndLoadOptions();
  }
  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} 00:00:00`;
  }

  private resetAndLoadOptions(): void {
    if (this.selectedVideoOption === 'Video') {
      this._studentService.getVideoSubjects(this.selectedStudent.id).then((res:any) => {
        this.subjects = res;
        if (res && res?.length > 0) {
          this.selectedSubject = res[0];
          this.loadData();
        } else {
          this.courseModules = [];
        }
      });
    } else if (this.selectedVideoOption === 'QBank') {
      if (this.selectedStudent?.id) {
        this._studentService.getQBankSubjects(this.selectedStudent.id).then((res:any) => {
          this.subjects = res;
          if (res && res?.length > 0) {
            this.selectedSubject = res[0];
            this.loadData();
          } else {
            this.courseModules = [];
          }
        });
      }
    } else if (this.selectedVideoOption === 'Test') {
      if (this.selectedStudent?.id) {
        this._studentService.getTestExamTypes(this.selectedStudent.id).then((res:any) => {
          this.examTypes = res;
          if (res && res?.length > 0) {
            this.selectedExamType = res[0];
            this.loadData();
          } else {
            this.courseModules = [];
          }
        });
      }
    }
  }

  private loadData(): void {
    if (!this.selectedStudent) return;

    // Format date as "All" or specific date format as needed by your API
    const dateParam = this.selectedDate ? this.formatDateToString(this.selectedDate) : ''; // You can modify this logic based on your requirements
    
    if (this.selectedVideoOption === 'Video') {
      this._studentService.getVideos(this.selectedSubject.id, this.selectedStudent.id, dateParam).then(res => {
      // this._studentService.getVideos(this.selectedSubject.id, this.selectedStudent?.id).then(res => {
        this.courseModules = res || [];
      }).catch(err => {
        console.error('Error loading videos:', err);
        this.courseModules = [];
      });
    } else if (this.selectedVideoOption === 'QBank') {
      this._studentService.getQBankExams(this.selectedSubject.subjectId, this.selectedStudent.id, dateParam).then(res => {
      // this._studentService.getQBankExams(this.selectedSubject.subjectId, this.selectedStudent.id).then(res => {
        this.courseModules = res || [];
      }).catch(err => {
        console.error('Error loading QBank exams:', err);
        this.courseModules = [];
      });
    } else if (this.selectedVideoOption === 'Test') {
      this._studentService.getTestExams(this.selectedExamType.examType, this.selectedExamType.name, this.selectedStudent.id, dateParam).then(res => {
      // this._studentService.getTestExams(this.selectedExamType.examType, this.selectedExamType.name, this.selectedStudent.id).then(res => {
        this.courseModules = res || [];
      }).catch(err => {
        console.error('Error loading test exams:', err);
        this.courseModules = [];
      });
    }
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
        // Initialize with default module type after student is selected
        this.resetAndLoadOptions();
      }
    }).catch(err => {
      console.error('Error loading students:', err);
      this.students = [];
    });
  }
  getTotalSeconds(time: string): number {
    const parts = time.split(':').map(Number); // ["1","20","43"] → [1,20,43]
    let seconds = 0;
  
    if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      seconds = parts[0] * 60 + parts[1];
    } else {
      seconds = parts[0];
    }
  
    return seconds;
  }
  getWatchedPercentage(watchedTime: number, videoLength: string): number {
    const totalSeconds = this.getTotalSeconds(videoLength);
    if (totalSeconds === 0) return 0;
    return (watchedTime / totalSeconds) * 100;
  }
}