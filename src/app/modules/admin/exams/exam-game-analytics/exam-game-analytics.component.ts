import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApexOptions } from 'apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  NgApexchartsModule
} from "ng-apexcharts";
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { ExamService } from '../exams.service';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExamGameHeaderComponent } from '../exam-game-header/exam-game-header.component';
export type linearChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-exam-game-analytics',
  imports: [CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    NgApexchartsModule,
    MatTableModule,
    // CarouselModule,
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
  RouterModule],
  templateUrl: './exam-game-analytics.component.html',
  styleUrl: './exam-game-analytics.component.scss'
})
export class ExamGameAnalyticsComponent implements OnInit {
  selected = 'Tamil Nadu';
  pieChartOptions: ApexOptions = {};
  isDropdownActive = false;

  selectedType: 'allIndia' | 'stateselected' = 'stateselected';

  examId:string;
  userInfo: any;
  taskGuid:string;
  examDetails:any;
  examActivity:any;
  examSubjectsWiseAnalytics:any;
  topScorers:any;
  compareWithOthers:boolean = false;
  dataLoaded:boolean = false;
  url = '/my-images/default-profile.png';
  defaultImageUrl = '/my-images/default-profile.png';
  showAllItems: boolean = false;
  toppersByState: boolean = true;
  practiceMode: boolean = false;
  isCBTExamType: any;
  constructor(
    private _router : Router,
    private _location : Location,
    private cdr: ChangeDetectorRef,
    private _examService : ExamService,
    private _dataGuard : DataGuardService,
    // private _studentService: StudentService,
    private _route : ActivatedRoute
  ) {
    this._route.params.subscribe(res=>{
      this.examId = res.examId;
      this.taskGuid = res.taskId;
    });
    this._route.queryParams.subscribe(res => {
      if (res['isPracticeMode']) {
        this.practiceMode = res['isPracticeMode'] === 'true';
        this.isCBTExamType =  res['isPracticeMode'] === 'true'
        this.cdr.detectChanges();
      }else{
      }
    });

    this.pieChartOptions = {
    series: [{
      name: 'Score',
      data: [97, 77, 98, 75, 79, 34, 72, 44] // Example data
    }],
    chart: {
      height: 350,
      type: 'radar',
      toolbar: {
        show: false,  // This removes the menu
      },
    },
    // title: {
    //   text: 'Performance Metrics'
    // },
    xaxis: {
      categories: [
        'Flexibility', 'Customer Orientation', 'Cooperation', 'Commitment',
        'Product/Service Expertise', 'Integrity', 'Goal Orientation', 'Initiative'
      ],
      labels: {
        style: {
          colors: ['#FBB13C', '#28B463', '#5DADE2', '#85C1E9', '#E74C3C', '#F1C40F', '#85C1E9', '#F5B041'],
          fontSize: '14px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      show: false,
    },
    plotOptions: {
      radar: {
        size: 100,
        polygons: {
          strokeColors: '#e9e9e9',
          fill: {
            colors: ['#f8f8f8', '#fff']
          }
        }
      }
    },
    stroke: {
      width: 2,
      colors: ['#00A5A8']
    },
    fill: {
      opacity: 0.4
    },
    markers: {
      size: 4,
      colors: ['#fff'],
      strokeColors: ['#FBB13C', '#28B463', '#5DADE2', '#85C1E9', '#E74C3C', '#F1C40F', '#85C1E9', '#F5B041'],
      strokeWidth: 2,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val}%`;
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${val}%`;
      },
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        colors: ['#000']
      },
      background: {
        enabled: false,
        dropShadow: {
          enabled: false,
          top: 0,
          left: 0,
          blur: 0,
          color: '#000',
          opacity: 0
        }
      },
      offsetY: 5
    },
    responsive: [
      {
        breakpoint: 768, // Adjust for mobile devices
        options: {
          chart: {
            height: 300
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '10px'  // Smaller font for mobile
              }
            }
          },
          markers: {
            size: 3 // Smaller markers for mobile
          },
          dataLabels: {
            style: {
              fontSize: '10px'  // Smaller data labels for mobile
            }
          }
        }
      }
    ]
  };


} 

  ngOnInit(): void {
    console.log(this.isCBTExamType,"isCBTExamType")
    this.getUserProfile();
    if(this.isCBTExamType != undefined){
      this._examService.getpredefineExamResultv2(this.examId,this.taskGuid).subscribe(res=>{
        this.examDetails = res.examDetails;
        this.examActivity = res.activity[0];
        this.examSubjectsWiseAnalytics = res.subjectsWiseAnalytics;
        this.dataLoaded = true;
      })
    }else{
      this._examService.getpredefineExamResult(this.examId,this.taskGuid).subscribe(res=>{
        this.examDetails = res.examDetails;
        this.examActivity = res.activity[0];
        this.examSubjectsWiseAnalytics = res.subjectsWiseAnalytics;
        this.dataLoaded = true;
      })
    }
    
  }
  getUserProfile(){
    // this._studentService.getProfile().subscribe((response: any) => {
    //   this.userInfo = response;
    //   this.url = this.userInfo?.imageUrl?.length > 0 ? 'https://api.adrplexus.com/SAAS-DEV/' + this.userInfo?.imageUrl : this.defaultImageUrl;
    // });
  }
  selectAllIndia(): void {
    this.selectedType = 'allIndia';
    this.toppersByState = false;
    this.getTopppers();
  }
  selectState(): void {
    this.selectedType = 'stateselected';
    this.toppersByState = true;
    this.getTopppers();
  }
  compareWithothers(){
    this.compareWithOthers = true;
    this.getTopppers();
  }
  backToResultScreen(){
    this.compareWithOthers = false;
  }
  getTopppers(){
    this._examService.getExamTopScorers(this.examId,this.taskGuid,this.toppersByState).subscribe(res=>{
      this.topScorers = res;
    });
  }

  // handleStateSelection(event: MatSelectChange): void {
  //   this.selectedType = 'select';
  //   this.selected = event.value;
  // }
  // CompareToOthers(){
  //   this._router.navigate(['/exam-management/comparewithothers'])
  // } 
  Gotoback(){
    // this._location.back();
    
    // if (this.examDetails?.examType == 3) {
    //   if(courseid === '30d831e2-406b-11f0-9097-02419699f700' || courseid === '1f6283ec-2022-11f0-9097-02419699f700'){
    //     this._router.navigate([`/exam-management/list/${this.examDetails.testCategory}/${this.examDetails.examType}/examtype`]);
    //   }else{
    //     this._router.navigate([`/exam-management/list/${this.examDetails.testCategory}/${this.examDetails.examType}`]);
    //   }
    // } else {
    //   this._router.navigate([`/exam-management/list/${this.examDetails.testCategory}/${this.examDetails.examType}`]);
    // }
    // if (window.history.length > 1) {
    //   this._location.back();
    // } else {
    //   this._router.navigate(['/exam-management/overall-progress']); // Navigate to a default page if no history exists
    // }
    this._router.navigate(['/task/list']);
  }
  formattedTime(sec){
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const remainingSeconds = sec % 60;

    // Format the time as HH:MM:SS with leading zeros if necessary
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }
  pad(number: number): string {
    return number < 10 ? '0' + number : number.toString();
  }
  toggleItems() {
    this.showAllItems = !this.showAllItems;
  }

}
