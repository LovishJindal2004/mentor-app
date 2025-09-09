import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
    MatTabsModule, 
    MatIconModule, 
    MatButtonModule, 
    MatMenuModule, 
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './view-progress.component.html',
  styleUrl: './view-progress.component.scss'
})
export class ViewProgressComponent implements OnInit {
  selectedTab = 0;
  courseModules: CourseModule[] = [];
  selectedDate: Date | null = null;
  selectedVideoOption: string = 'Video';
  videoOptions: string[] = ['Video', 'Test', 'QBank'];
  
  // Filter options
  selectedSubject: string = 'Anatomy';
  subjects: string[] = ['Anatomy', 'Physiology', 'Biochemistry', 'Pathology'];
  
  selectedStudent: string = 'Student1';
  students: string[] = ['Student1', 'Student2', 'Student3', 'Student4'];
  
  onDateChange(event: any): void {
    console.log('Date selected:', this.selectedDate);
    // Implement filtering logic based on date
  }
  
  onSubjectChange(subject: string): void {
    this.selectedSubject = subject;
    console.log('Subject selected:', subject);
    // Implement filtering logic based on subject
  }
  
  onStudentChange(student: string): void {
    this.selectedStudent = student;
    console.log('Student selected:', student);
    // Implement filtering logic based on student
  }
  
  onVideoOptionChange(option: string): void {
    this.selectedVideoOption = option;
    console.log('Video option selected:', option);
    // Implement filtering logic based on video option
  }

  ngOnInit(): void {
    // Initialize with sample data based on the mockup
    this.courseModules = [
      {
        title: 'Introduction',
        duration: '1:42:40',
        assignmentStatus: 'Assigned',
        isAssigned: true,
        dueDate: 'June 1',
        color: 'green',
        progress: 75 // 75% complete
      },
      {
        title: 'General Basic',
        duration: '01:05:06',
        assignmentStatus: 'Not Assigned',
        isAssigned: false,
        color: 'blue',
      },
      {
        title: 'Refractory Period',
        duration: '01:12:28',
        assignmentStatus: 'Not Assigned',
        isAssigned: false,
      },
      {
        title: 'Basics',
        duration: '08:08:08',
        assignmentStatus: 'Today',
        isAssigned: true,
        color: 'pink',
        progress: 100 // 100% complete
      },
      {
        title: 'Auto-Excitable Cell Action Potential',
        duration: '12:10:00',
        assignmentStatus: 'Tomorrow',
        isAssigned: true,
        progress: 45 // 45% complete
      },
      {
        title: 'Cardiac Excitable',
        duration: '02:05:07',
        assignmentStatus: 'Assigned',
        isAssigned: true,
        dueDate: 'June 6',
        progress: 60 // 60% complete
      }
    ];
  }
}
