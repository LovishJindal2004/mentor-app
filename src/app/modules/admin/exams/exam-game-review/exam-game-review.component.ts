import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common'


import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { ApiErrorHandlerService } from 'app/modules/common/services/api-error-handling.service';
import { QuestionReponse } from '../exams.model';
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
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ExamGameHeaderComponent } from '../exam-game-header/exam-game-header.component';

@Component({
  selector: 'app-exam-game-review',
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
  RouterModule,
ExamGameHeaderComponent],
  templateUrl: './exam-game-review.component.html',
  styleUrl: './exam-game-review.component.scss'
})
export class ExamGameReviewComponent implements OnInit {

  @ViewChild('myDialog') questionOverview!: ElementRef;
  @ViewChild('myDialog2') examExit!: ElementRef;
  FormHideShow: boolean = false;
  title = "Approved Question"
  indexToFilter = 0;
  noOfCorrectAnswerd = 0;
  noOfInCorrectAnswerd = 0;
  noOfmissedQuestion = 0;
  noOfunAttmptQuestion = 0;
  questionDetails: Array<QuestionReponse>;
  ExamActivity: any;
  currentQuestionDetail: any = [];
  examDetails: any = [];
  FilterQuestionData: any = [];
  time: number = 0;
  timerInterval: any;
  timerRunning: boolean = false;
  cbmeId: any;
  QuestionId: any;
  IsDefaultExplanation: boolean = false;
  loadedQuestionDetails: { [key: string]: any } = {};
  ExamId: any;
  currentOpenPopup: string;
  examid: any;
  CourseId: any;
  dataLoaded: boolean = true;
  NoofCRisk = 0;
  partDetails: any = [];
  NoofMarkedQuestion = 0;
  keyPreFix: any;
  partIndex: any;
  tabindex:any;
  taskGuid: string;
  isviewtrackboard: boolean = false;
  practiceMode: boolean = false;
  @ViewChild('ReportQuestion') ReportQuestion!: ElementRef;
  isCBTExamType: any;
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1000,
    });
  }
  constructor(
    private dialog: MatDialog, 
    private errorhandling: ApiErrorHandlerService,
    private route: ActivatedRoute, 
    private sanitizer: DomSanitizer, 
    private snackBar: MatSnackBar, 
    private _datagurd: DataGuardService, 
    private cdr: ChangeDetectorRef, 
    private loaction: Location, 
    private courseExamService: ExamService,
    private _dataGuardService: DataGuardService) {
    this.route.params.subscribe(res => {
      if (res) {
        this.examid = res['examId'];
        this.taskGuid = res['taskId'];
        this.cbmeId = res['cbmeId'];
        this.keyPreFix = this.examid + "-";
        this.QuestionId = parseInt(res['Questionid'], 10);
      }

    })
    this.route.queryParams.subscribe(res => {
      if (res['isPracticeMode']) {
        this.practiceMode = res['isPracticeMode'] === 'true';
        this.isCBTExamType =  res['isPracticeMode'] === 'true'
      }
    });
  }
  openDialogWithTemplateRef(templateRef: any, panelClass: any) {
    this.dialog.open(templateRef, {
      panelClass: panelClass
    });
  }
  ngOnInit(): void {
  
    this.loadQuestion();
    this.startTimer();
  }
  
  loadQuestion() {
    var self = this;
    this.courseExamService.getpredefineExamAnswersheet(this.examid, this.taskGuid).subscribe((res: any) => {
      self.partDetails = res.parts
      self.examDetails = res.examDetails;
      self.ExamActivity = res.activity;
      // this.getquestiondetails(this.FilterQuestionData[0].questionDetailID);
    },
      (error) => {
        if (error) {
          this.loaction.back();
        }
        this.errorhandling.handleError(error);
      }
    )


  }
  getpartWiseQuestions(event) {
    var self = this;
    const partindex = event.index;

  
    // this.indexToFilter=0
    this.partIndex = event.index;
    self.questionDetails = self.partDetails[partindex].questions;

    this.noOfCorrectAnswerd = self.questionDetails.filter(q => q.isCorrect).length;
    this.noOfInCorrectAnswerd = self.questionDetails.filter(q => q.isChecked && !q.isCorrect && !q.unAttempt).length;
    this.noOfunAttmptQuestion = self.questionDetails.filter(q => q.unAttempt).length;
    this.noOfmissedQuestion = this.questionDetails.length - (this.noOfCorrectAnswerd + this.noOfInCorrectAnswerd + this.noOfunAttmptQuestion);
    this.NoofCRisk = this.questionDetails.filter(q => q.isCalculateRisk == true).length;
    this.NoofMarkedQuestion = this.questionDetails.filter(q => q.isMarkedReview == true).length;
    // debugger
    if (this.QuestionId) {
      this.indexToFilter = this.questionDetails.findIndex((question, index) => question.questionDetailID === this.QuestionId);
      // console.log(this.indexToFilter)
      if (this.indexToFilter == -1) {
        this.indexToFilter = 0;
        this.filterQuestion(this.indexToFilter);
      }
      else {
        this.filterQuestion(this.indexToFilter);
      }

    }
    else {
      let QueueId: any = self._dataGuardService.getLocalExamData(self.keyPreFix + '-singleAnswerSheetExamsindex' + self.partIndex + self.ExamActivity.activityId);
      let acitvityId = self._dataGuardService.getLocalExamData(self.keyPreFix + '-singleAnswerSheetExams' + self.partIndex + self.ExamActivity.activityId);
      // let partIndex=self._dataGuardService.getLocalExamData(self.keyPreFix + '-singleExamspartIndex'+self.partIndex);
      // debugger
      if (acitvityId != this.examid) {
        this.indexToFilter = 0;
        this.filterQuestion(this.indexToFilter);
      }
      else {
        if (QueueId) {
          this.filterQuestion(QueueId - 1)
          this.indexToFilter = QueueId - 1;
        }
        else {
          this.filterQuestion(this.indexToFilter);
        }
      }
    }


    // this.getquestiondetails(this.FilterQuestionData[0].questionDetailID)
    this.dataLoaded = false;
    this.cdr.detectChanges();
  }
  getTotalUsers(questionData: any): number {
    if (!questionData || !questionData.choices) return 0;
    return questionData.choices.reduce((total, choice) => total + (choice.pollCount || 0), 0);
  }
  getquestiondetails(questionDetailID) {
    var self = this;
    if (this.loadedQuestionDetails[questionDetailID]) {
      this.currentQuestionDetail = this.loadedQuestionDetails[questionDetailID];
    } else {
      this.courseExamService.getQuestionbyID(questionDetailID).subscribe((response: any) => {
        this.currentQuestionDetail = response;
        this.loadedQuestionDetails[questionDetailID] = response;
      });
    }
  }
  reportQuestion() {
    this.openDialogWithTemplateRef(this.ReportQuestion, 'ReportQuestion');
  }
  setExplanation() {
    this.IsDefaultExplanation = !this.IsDefaultExplanation;
  }
  // getQuestionClasses(question: any): string {
  //   if (question.isCorrect) {
  //     return 'correct-ans';
  //   } else if (question.isChecked && !question.isCorrect && !question.unAttempt) {
  //     return 'incorrect-ans';
  //   }
  //   else if (question.unAttempt) {
  //     return 'unattemp-ans';
  //   }
  //   // else if (question.isMarkedReview) {
  //   //   return 'marked-ans';
  //   // }
  //   // else if (question.isCalculateRisk) {
  //   //   return 'CRisk-ans';
  //   // }
  //   else {
  //     return 'missed-ans';
  //   }
  // }
  getQuestionClasses(question: QuestionReponse): string {
    const anyChoiceChecked = question.choices.some(choice => choice.isChecked);
    if (question.isCorrect) {
      return 'answered';
    }
    if (question.unAttempt) {
      return 'not-visited';
    }
    if (question.isChecked && !question.isCorrect && !question.unAttempt) {
      return 'not-answered';
    }
    if (!question.isChecked) {
      return 'missed';
    }
    // if (question.isChecked && anyChoiceChecked && question.isMarkedReview) {
    //   return 'marked reviewed';
    // }
    // if (question.isChecked && question.isCalculateRisk) {
    //   return 'crisk';
    // }
    // this.cdr.detectChanges();
  }
  receiveDataFromHeader(data: string, OpenPopup: boolean) {// this function for Open popup according to header click
    this.closedialog();
    if (OpenPopup) {
      if (data === this.currentOpenPopup) {
        this.closedialog();
        this.currentOpenPopup = null;
      } else {
        this.closedialog();
        if (data == 'AllQuestion') {
          this.openDialogWithTemplateRef(this.questionOverview, "popup-1");
        } else {
          this.loaction.back();
        }
        this.currentOpenPopup = data;
      }
    }

  }
  gotoQuestion(Index) {
    this.indexToFilter = Index;
    this.filterQuestion(this.indexToFilter);
    this.dialog.closeAll();
  }
  //filter perivious Question
  previousQuestion() {
    if (this.indexToFilter > 0) {
      this.indexToFilter--;
      this.filterQuestion(this.indexToFilter);
    }
  }
  trackQuestion() {
    this.isviewtrackboard = !this.isviewtrackboard;
  }

  // Filter Next Question
  NextQuestion() {
    if ((this.indexToFilter + 1) < this.questionDetails.length) {
      this.indexToFilter++;
      this.filterQuestion(this.indexToFilter);
    }

  }
  filterQuestion(IndexValue) {
    var self = this;
    var index = IndexValue + 1
    this.route.queryParams.subscribe(params => {
      // debugger
      if(params){
        // this.tabindex=params[0].part;
        this.tabindex=parseInt(params['part'], 10);
      }
     
    });
    this.FilterQuestionData = this.questionDetails.filter((question, index) => index === IndexValue);
    this.getquestiondetails(this.FilterQuestionData[0].questionDetailID)
    self._dataGuardService.setLocalExamData(self.keyPreFix + '-singleAnswerSheetExamsindex' + self.partIndex + self.ExamActivity.activityId, index.toString());
    self._dataGuardService.setLocalExamData(self.keyPreFix + '-singleAnswerSheetExams' + self.partIndex + self.ExamActivity.activityId, this.examid);
  }
  sanitizeExplanationContent(explanation) {
    // Replace backslashes if needed
    const sanitizedHtml = explanation?.replace(/\\/g, '');

    // Sanitize HTML
    return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
  }
  closedialog() {
    this.dialog.closeAll();
    this.currentOpenPopup = null;
  }
  OpenForm() {
    this.FormHideShow = true;

  }
  HideForm() {
    this.FormHideShow = false;
  }

  // ngOnDestroy() {
  //   document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  // }
  @HostListener('document:visibilitychange', ['$event'])
  onVisibilityChange(event: Event) {
    this.handleVisibilityChange();
  }

  private startTimer() {
    if (!this.timerRunning) {
      this.time = 0;
      this.timerInterval = setInterval(() => {
        this.time++;
        // console.log(this.time)
      }, 1000);

      this.timerRunning = true;
    }
  }
  // BookmarkQuestions(Qustion: QuestionReponse, IsBookMark: boolean) {
  //   this.FilterQuestionData[0].isBookMarked = IsBookMark ? false : true;
  //   var request = {
  //     testid: this.examid,  // Make sure the property names match
  //     courseId: this.CourseId,  // Make sure the property names match
  //     questionId: Qustion[0]?.questionDetailID,
  //     IsBookMark: IsBookMark ? false : true,
  //     partId: this.FilterQuestionData[0].partId
  //   };
  //   this.courseExamService.BookmarkPredefineQuestion(request).subscribe(res => {
  //   },
  //     (error) => {
  //       this.errorhandling.handleError(error);
  //     });
  // }
  private handleVisibilityChange() {
    if (document.hidden) {
      clearInterval(this.timerInterval);
      this.timerRunning = false;
      this.sendActivityData();
    } else {
      this.time = 0;
      this.startTimer();
    }
  }

  private sendActivityData() {
    clearInterval(this.timerInterval);
    this.timerRunning = false;

    var request = {
      examId: this.examid,
      taskId: this.taskGuid,
      timeDuration: this.time
    }
    // debugger;
    this.courseExamService.predefineAnswerSheetProgress(request).then(res => {
    })
  }
  SubmitReport(form) {

    let remark = "";
    // var remark=form.value.errorTypeOption==true
    if (form.value.errorTypeOption == true) {
      remark += "Option has error,"
    }
    if (form.value.errorTypeQuestion == true) {
      remark += "Question has error,"
    }
    if (form.value.errorTypeExplanation == true) {
      remark += "Explanation has error"
    }
    const request = {
      questionDetailID: this.FilterQuestionData[0].questionDetailID, // Replace with the actual value
      remarks: remark,
      issue: form.value.feedback,
      moduletype: 3
    };
    this.courseExamService.reportQuestion(request).then(res => {

      if (res) {
        this.closedialog();
        this.openSnackBar("Sucessfully Submit..", 'Close');
      }

    },
      (error) => {
        this.errorhandling.handleError(error);
      });
  }
  ngOnDestroy() {
    if (this.time != 0)
      this.sendActivityData();
  }
  Goback() {
    this.loaction.back();
  }
}