import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface StudentReport {
  name: string;
  date: string;
  videosWatched: number;
  questionsAttempted: number;
  timeSpent: string;
  streak: string;
  weakTopics: string[];
  recommendations: string[];
}

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
  subjects = ['Anatomy', 'Physiology', 'Biochemistry', 'Pathology'];

  selectedStudent = 'Student1';
  students = ['Student1', 'Student2', 'Student3', 'Student4', 'Student5'];

  selectedActivity = "Today's Activity";
  activityOptions = ["Today's Activity", 'Weekly Summary', 'Monthly Report'];

  studentReports: StudentReport[] = [];

  ngOnInit(): void {
    this.studentReports = [
      { name: 'Student1', date: 'Today', videosWatched: 2, questionsAttempted: 5, timeSpent: '1hr 15mins', streak: '4 days', weakTopics: ['Cardiac Cycle', 'Renal Physiology'], recommendations: ['Review Cardiac Videos', 'Practice Renal MCQs'] },
      { name: 'Student2', date: 'Yesterday', videosWatched: 3, questionsAttempted: 10, timeSpent: '2hr 30mins', streak: '7 days', weakTopics: ['Neuroanatomy', 'Immunology'], recommendations: ['Schedule Neuroanatomy Review', 'Take Immunology Practice Test'] },
      { name: 'Student3', date: '2 days ago', videosWatched: 1, questionsAttempted: 15, timeSpent: '45mins', streak: '2 days', weakTopics: ['Biochemical Pathways', 'Cell Biology'], recommendations: ['Watch Metabolism Videos', 'Review Cell Structure Notes'] },
      { name: 'Student4', date: '3 days ago', videosWatched: 5, questionsAttempted: 20, timeSpent: '3hr 10mins', streak: '10 days', weakTopics: ['Pharmacology', 'Pathology'], recommendations: ['Focus on Drug Mechanisms', 'Practice Pathology Questions'] },
      { name: 'Student5', date: '1 week ago', videosWatched: 0, questionsAttempted: 0, timeSpent: '0mins', streak: '0 days', weakTopics: ['Engagement', 'Participation'], recommendations: ['Schedule Check-in Meeting', 'Set Weekly Goals'] }
    ];
  }

  onDateChange(_: any): void { }
  onSubjectChange(v: string): void { this.selectedSubject = v; }
  onStudentChange(v: string): void { this.selectedStudent = v; }
  onActivityChange(v: string): void { this.selectedActivity = v; }

  get currentReport(): StudentReport | undefined {
    return this.studentReports.find(r => r.name === this.selectedStudent);
  }
}
