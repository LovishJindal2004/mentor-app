import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { QBanksService } from '../qbanks.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule, Location } from '@angular/common';
import { ApiErrorHandlerService } from 'app/modules/common/services/api-error-handling.service';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
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
import { QbankGameHeaderComponent } from '../qbank-game-header/qbank-game-header.component';

@Component({
  selector: 'app-bookmark-question-details',
  imports: [CommonModule,
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
    MatDialogModule,
    QbankGameHeaderComponent,
  RouterModule],
  templateUrl: './bookmark-question-details.component.html',
  styleUrls: ['./bookmark-question-details.component.scss']
})
export class BookmarkQuestionDetailsComponent implements OnInit {

  @ViewChild('myDialog') questionOverview!: ElementRef;
  @ViewChild('myDialog2') examExit!: ElementRef;
  FormHideShow: boolean = false;
  title = "Approved Question";
  indexToFilter = 0;
  questionDetails: Array<any> = [];
  currentQuestionDetail: any = {};
  FilterQuestionData: any = [];
  time: number = 0;
  timerInterval: any;
  timerRunning: boolean = false;
  QuestionId: any;
  IsDefaultExplanation: boolean = false;
  loadedQuestionDetails: { [key: string]: any } = {};
  questionid: any;
  currentOpenPopup: string;
  courseId: string = '';
  subjectid: any;
  pageNumber: number = 1;
  pageSize: number = 12;
  totalQuestions: number = 0;
  globalIndex: number = 0; // New variable to track the overall question index

  constructor(
    private _qbnakservice: QBanksService,
    private errorhandling: ApiErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private _dataGuardService: DataGuardService,
    private sanitizer: DomSanitizer
  ) {
    this.route.params.subscribe(res => {
      this.questionid = res['Questionid'];
      this.subjectid = res['subjectId'];
    });
    this.route.queryParams.subscribe(res => {
      if (res) {
        this.pageNumber = res['pageNumber'] || this.pageNumber;
        this.pageSize = res['pageSize'] || this.pageSize;
      }
    });
  }

  ngOnInit(): void {
    this.courseId = this._dataGuardService.getCourseId();
    this.loadQuestion(this.pageNumber, this.pageSize);
  }

  loadQuestion(pageNumber: number, pageSize: number, isNavigatingBack: boolean = false, isNavigatingNext: boolean = false,isBookmark:boolean=false): void {
    this._qbnakservice.getBookmarkQbnkQuestionDetails(this.subjectid, pageNumber, pageSize).subscribe(
      (res: any) => {
        if (res) {
          this.questionDetails = res.data;
          this.totalQuestions = res.totalCount;

          if (this.questionid && !isNavigatingBack && !isNavigatingNext) {
            this.indexToFilter = this.questionDetails.findIndex(question => question.questionDetailID === parseInt(this.questionid, 10));
          } else if (isNavigatingBack) {
            this.indexToFilter = this.questionDetails.length - 1;
          } else if (isNavigatingNext) {
            this.indexToFilter = 0; // Set indexToFilter to 0 when navigating to the next page
          } else {
            this.indexToFilter = 0; // Reset indexToFilter to 0 when loading a new page
          }

          if (this.indexToFilter !== -1) {
            this.FilterQuestionData = this.questionDetails.filter((_, index) => index === this.indexToFilter);
            // this.getquestiondetails(this.FilterQuestionData[0].questionDetailID);
          } else {
            if(!isBookmark){
              this.location.back();
            }
            this.indexToFilter = 0;
            this.FilterQuestionData = this.questionDetails.slice(0, 1);
            if (this.FilterQuestionData.length > 0) {
              // this.getquestiondetails(this.FilterQuestionData[0].questionDetailID);
            }
          }

          // Update globalIndex
          this.globalIndex = (pageNumber - 1) * pageSize + this.indexToFilter;
        }
      },
      (error) => {
        this.errorhandling.handleError(error);
        this.router.navigate(['']);
      }
    );
  }


  sanitizeExplanationContent(explanation: string) {
    const sanitizedHtml = explanation?.replace(/\\/g, '');
    return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
  }
  receiveDataFromHeader(data: string, OpenPopup: boolean) {// this function for Open popup according to header click
this.location.back();
  }
  setExplanation(): void {
    this.IsDefaultExplanation = !this.IsDefaultExplanation;
  }

  previousQuestion(): void {
    if (this.globalIndex > 0) {
      if (this.indexToFilter > 0) {
        this.indexToFilter--;
        this.filterQuestion(this.indexToFilter);
      } else if (this.pageNumber > 1) {
        this.pageNumber--;
        this.loadQuestion(this.pageNumber, this.pageSize, true); // Pass a flag to indicate we are navigating back
      }
      this.globalIndex--; // Decrement globalIndex when navigating to the previous question
    }
  }
  NextQuestion(): void {
    if (this.globalIndex < this.totalQuestions - 1) {
      if ((this.indexToFilter + 1) < this.questionDetails.length) {
        this.indexToFilter++;
        this.filterQuestion(this.indexToFilter);
      } else if (this.pageNumber * this.pageSize < this.totalQuestions) {
        this.pageNumber++;
        this.loadQuestion(this.pageNumber, this.pageSize, false, true); // Add a flag to indicate next navigation
      }
      this.globalIndex++; // Increment globalIndex when navigating to the next question
    }
  }


  filterQuestion(IndexValue: number): void {
    this.FilterQuestionData = this.questionDetails.filter((_, index) => index === IndexValue);
    // this.getquestiondetails(this.FilterQuestionData[0].questionDetailID);
  }

  getNext(event: any): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadQuestion(this.pageNumber, this.pageSize);
  }
  getTotalUsers(questionData: any): number {
    if (!questionData || !questionData.choices) return 0;
    return questionData.choices.reduce((total, choice) => total + (choice.pollCount || 0), 0);
  }
  Goback(): void {
    if(this.totalQuestions>0){
      this.location.back();
    }else{
      this.router.navigate(['/qbanks/subjects'])
    }
   
  }
  BookmarkQuestions(Qustion: any, IsBookMark: boolean) {
    Qustion.isBoomarked = IsBookMark ? false : true;
    
    const request = {
      examid: Qustion.examId,
      questionId: Qustion.questionDetailID,
      courseId: Qustion.courseId,
      IsBookMark: !IsBookMark
    };
  
    this._qbnakservice.BookmarkQbnkQuestion(request).subscribe((res) => {
      if (res) {
        // Adjust the questionDetails array locally before calling loadQuestion
        this.questionDetails = this.questionDetails.filter(q => q.questionDetailID !== Qustion.questionDetailID);

        if (this.questionDetails.length === 0) {
          if (this.pageNumber > 1) {
            this.pageNumber--; // Move to the previous page
          }
        } else if (this.indexToFilter >= this.questionDetails.length) {
          this.indexToFilter = this.questionDetails.length - 1; // Move to the last available question
        }
        this.loadQuestion(this.pageNumber, this.pageSize,false,false,true);
      }
    }, (error) => {
      this.errorhandling.handleError(error);
    });
  }
  getUniqueIntegrationTypes(integrations: any[]): string[] {
  if (!integrations) return [];
  
  // Create a Set of unique integration types
  const types = integrations.map(integration => integration.integrationType);
  return [...new Set(types)]; // Return unique types as an array
}
}
