import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApexOptions } from 'apexcharts';
import { Subscription } from 'rxjs';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { ExamService } from 'app/modules/admin/exams/exams.service';
import { ApiErrorHandlerService } from 'app/modules/common/services/api-error-handling.service';
import { Examlisting } from '../test.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TestService } from '../test.service';

@Component({
  selector: 'app-test-list',
  imports: [CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    NgApexchartsModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatRadioModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatTabsModule,
    MatSnackBarModule,
  RouterLink],
  templateUrl: './test-list.component.html',
  styleUrl: './test-list.component.scss'
})
export class TestListComponent implements OnInit {
  CourseId: any;
  private routeSub: Subscription;
  pieChartOptions: ApexOptions = {};
  examList: Array<Examlisting> = [];
  examtype: number = 0;
  ExamName: string;
  noOfExamCompleted: number = 0;
  noOfexams: number = 0;
  examStatus: number = 1;
  examListoriginalData: any = [];
  constructor(
    private router: Router,
    private _route: ActivatedRoute,
    private _router: Router,
    private _datgurd: DataGuardService,
    private _examservice: TestService,
    private _errorhandling: ApiErrorHandlerService) {
    this._route.params.subscribe(res => {
      this.examList = [];
      this.ExamName = res.categoryname;
      this.examtype = res.examtype;
    })
  }

  ngOnInit(): void {
    this.CourseId = this._datgurd.getCourseId();
    
    // Subscribe to route parameters
    this.routeSub = this._route.params.subscribe(res => {
      this.ExamName = res.categoryname;
      this.examtype = res.examtype;
      // Call the method to fetch the exam list whenever parameters change
      this.fetchExamList();
    });
  }
  private fetchExamList(): void {
    this._examservice.getcategoryExamList(this.examtype, this.ExamName).subscribe(res => {
      this.examList = res;
      this.examListoriginalData = res;
      this.noOfExamCompleted = 0;
      this.noOfexams = 0;

      this.examList.forEach((exam: any) => {
        if (exam.status === 3) {
          this.noOfExamCompleted += 1;
        }
        this.noOfexams += 1;
        this.updatepieChart();
      });
    }, (error) => {
      this._errorhandling.handleError(error);
    });
  }
  updatepieChart() {
    this.pieChartOptions = {
      series: [this.noOfExamCompleted, this.noOfexams - this.noOfExamCompleted],
      chart: {
        type: "donut",
        height: 110 // Adjust the height to accommodate space for the labels
      },
      labels: ["Completed", "Not Completed"],
      colors: ["#19a9a0", "#dcdcdc"],
      // offsetY:20,
      responsive: [
        {
          breakpoint: 1921,
          options: {
            chart: {
              width: 80
            },
            legend: {
              show: false,
            },
            dataLabels: {
              enabled: false,
              enabledOnSeries: [1]
            },
          }
        }
      ]
    };
  }
  FilterbyExamStatus(ExamStatus: number) {
    this.examStatus = ExamStatus;

    if (this.examStatus === 1) {
      // If ExamStatus is 0, reset to the original data
      this.examList = this.examListoriginalData;
    } else {
      this.examList = this.examListoriginalData.filter((exam: any) => exam.status === ExamStatus);
    }
  }
  goToExam() {
    this.router.navigate(['/exam-management/game-view']);
  }
   ngOnDestroy(): void {
    // Unsubscribe from the route parameters observable to avoid memory leaks
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  navigateToGameview(exam){
    let link = '';
    if (exam.status === 3) {
      link = '/exam-management/game-analytics/' + exam.guid;
    } else if (this.examtype === 6) {
      link = '/exam-management/cbtgameview/' + exam.guid;
    } else {
      link = '/exam-management/game-view/' + exam.guid;
    }
    this.router.navigate([link]);
  }
  NavigatetoOverall(){
    this._router.navigate(['/exam-management/overall-progress']);
  }
  }