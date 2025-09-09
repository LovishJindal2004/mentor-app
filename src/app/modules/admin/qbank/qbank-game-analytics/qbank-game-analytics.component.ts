import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApexOptions } from 'apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions
} from "ng-apexcharts";
import { QBankService } from '../qbank.service';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { ApiErrorHandlerService } from 'app/modules/common/services/api-error-handling.service';
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
import { QbankGameHeaderComponent } from '../qbank-game-header/qbank-game-header.component';

export type linearChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};


@Component({
  selector: 'app-qbank-game-analytics',
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    // NgApexchartsModule,
    MatProgressBarModule,
    MatListModule,
    MatRadioModule,
    MatSlideToggleModule,
    // PdfViewerModule,
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
    MatDialogModule,
  RouterModule],
  templateUrl: './qbank-game-analytics.component.html',
  styleUrl: './qbank-game-analytics.component.scss'
})
export class QbankGameAnalyticsComponent implements OnInit {
  @Input() percentage: number = 50;
  @ViewChild("pieChart") pieChart: ChartComponent;
  pieChartOptions: ApexOptions = {};
  examid: any;
  resultDetail: any = [];
  examDetails: any = [];
  noofCorrectQuestion: any = 0;
  noofmissedQuestion: any = 0;
  noOfWrongQuestion: any = 0;
  noOfunattemp: any = 0;
  dataLoaded: boolean = false;
  taskGuid:string= '';
  practiceMode : boolean = false;

  constructor(
    private router: ActivatedRoute, 
    private route: Router, 
    private _qbankservice:QBankService,
    private _datagurd: DataGuardService,
    // private _studentservice: StudentService, 
    private errhandling: ApiErrorHandlerService
  ) {
    this.router.params.subscribe(res => {
      console.log(res,"res");
      this.examid = res['examId'];
      this.taskGuid = res['taskId'];
    })
    this.router.queryParams.subscribe(res => {
      this.practiceMode = res['isPracticeMode'] === 'true';
    })
    this._qbankservice.getQbankExamResult(this.examid,this.taskGuid).subscribe((response: any) => {
      if(response){
 
      this.resultDetail = response.activity;
      this.examDetails = response.examDetails;

      this.noofCorrectQuestion = (this.resultDetail.noOfCorrect * 100) / this.examDetails.noOfQuestions;
      this.noOfWrongQuestion = (this.resultDetail.noOfInCorrect * (100 - this.noofCorrectQuestion) / (this.examDetails.noOfQuestions - this.resultDetail.noOfCorrect));
      this.noOfunattemp = (this.resultDetail.noOfUnAttempt * (100 - (this.noofCorrectQuestion + this.noOfWrongQuestion)) / (this.examDetails.noOfQuestions - (this.resultDetail.noOfCorrect + this.resultDetail.noOfInCorrect)));
        this.noofmissedQuestion =
            ((this.examDetails.noOfQuestions - (this.resultDetail.noOfCorrect + this.resultDetail.noOfInCorrect)) /
                this.examDetails.noOfQuestions) * 100;              


      // this.noofmissedQuestion = (this.examDetails.noOfQuestions - (this.resultDetail.noOfCorrect + this.resultDetail.noOfInCorrect + this.resultDetail.noOfUnAttempt)) * (100 - (this.noofCorrectQuestion + this.noOfWrongQuestion + this.noOfunattemp)) / (this.examDetails.noOfQuestions - (this.resultDetail.noOfCorrect + this.resultDetail.noOfInCorrect + this.resultDetail.noOfUnAttempt));
      this.noofCorrectQuestion = Number.isNaN(this.noofCorrectQuestion) ? 0 : this.noofCorrectQuestion;
      this.noOfWrongQuestion = Number.isNaN(this.noOfWrongQuestion) ? 0 : this.noOfWrongQuestion;
      this.noOfunattemp = Number.isNaN(this.noOfunattemp) ? 0 : this.noOfunattemp;
      this.noofmissedQuestion = Number.isNaN(this.noofmissedQuestion) ? 0 : this.noofmissedQuestion;
      this.pieChartOptions = {
        series: [Math.round(this.noOfWrongQuestion), Math.round(this.noofCorrectQuestion), Math.round(this.noofmissedQuestion), Math.round(this.noOfunattemp)],
        chart: {
          type: "donut",
          height: 250 // Adjust the height to accommodate space for the labels
        },
        labels: ["InCorrect", "Correct", "Missed", "unAttemp"],
        colors: ["#EA4435", "#28C397", "#F9BC15", "#6E6E6E"],
        // offsetY:20,
        dataLabels: {
          enabled: false,
        },

        responsive: [
          {
            breakpoint: 1921,
            options: {
              chart: {
                width: 260
              },
              legend: {
                 show: false,
              }
            },
            
            
          }
        ]
        
      };
      this.dataLoaded = true;
      }
    
    
    }, (error) => {
      if (error) {
        this.route.navigate(['/'])
      }
      this.errhandling.handleError(error);
    }
    )

  }

  ngOnInit(): void {
  }

}
