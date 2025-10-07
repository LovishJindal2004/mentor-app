import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { ApiErrorHandlerService } from 'app/modules/common/services/api-error-handling.service';
import { QbankSubject } from '../qbanks.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { QBanksService } from '../qbanks.service';

@Component({
  selector: 'app-exam-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    NgApexchartsModule,
    MatProgressBarModule,
    MatListModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatDatepickerModule,
    FormsModule,
    MatSnackBarModule,
    MatPaginatorModule,
    RouterModule,
    MatDialogModule],
  templateUrl: './exam-list.component.html',
  styleUrl: './exam-list.component.scss'
})
export class ExamListComponent implements OnInit {
  noOfExamCompleted: number = 0;
  subjectId: any;
  QbankExamData: any[] = [];
  filteredExamData: any[] = [];  // to store filtered data
  subjectDetail: QbankSubject[] = [];
  examStatus: number = 0;
  dataLoaded: boolean = false;
  noOfexams: number = 0;
  courseId: string = '';

  constructor(
    private _qbankservice: QBanksService,
    private activeRoute: ActivatedRoute,
    private _datagurd: DataGuardService,
    private _errorHandling: ApiErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.courseId = this._datagurd.getCourseId();

    this.activeRoute.params.subscribe(paramsId => {
      if (paramsId.subjectId) {
        this.subjectId = Number(paramsId.subjectId);
      } else {
        this.subjectId = 0;
      }
    });

    this._qbankservice.getQbanksubjectsbyCourseId(this.courseId).subscribe((res: QbankSubject[]) => {
      this.subjectDetail = res;
      if (this.subjectId) {
        this.getsubjectAndQbank(this.subjectId);
      }
    }, (error) => {
      this._errorHandling.handleError(error);
    });
  }

  getsubjectAndQbank(subjectId: number): void {
    this.subjectId = subjectId;
    this._qbankservice.getQbnkTopicExamList(subjectId, this.courseId).subscribe((res: any) => {
      this.QbankExamData = res;
      this.filteredExamData = res;  // Initialize with all data
      this.dataLoaded=true;
    }, (error) => {
      this._errorHandling.handleError(error);
    });
  }

  FilterbyExamStatus(ExamStatus: number) {
    this.examStatus = ExamStatus;
    if (ExamStatus === 0) {
      this.filteredExamData = this.QbankExamData;  // Show all exams
    } else {
      this.filteredExamData = this.QbankExamData.map(topic => {
        return {
          ...topic,
          exams: topic.exams.filter(exam => exam.examStatus === ExamStatus)
        };
      }).filter(topic => topic.exams.length > 0);  // Remove topics with no exams
    }
  }

  Goback() {
    // Navigation logic here
  }
}
