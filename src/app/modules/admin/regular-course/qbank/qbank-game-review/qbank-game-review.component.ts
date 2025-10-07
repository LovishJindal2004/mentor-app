import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location, NgClass } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiErrorHandlerService } from 'app/modules/common/services/api-error-handling.service';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QbankGameHeaderComponent } from '../qbank-game-header/qbank-game-header.component';
import { QuestionReponse } from '../qbanks.model';
import { QBanksService } from '../qbanks.service';

@Component({
  selector: 'app-qbank-game-review', 
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    // NgApexchartsModule,
    MatProgressBarModule,
    // MatListModule,
    // MatRadioModule,
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
  QbankGameHeaderComponent],
  templateUrl: './qbank-game-review.component.html',
  styleUrl: './qbank-game-review.component.scss'
})
export class QbankGameReviewComponent implements OnInit {
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
  currentQuestionDetail: any = [];
  examDetails: any = [];
  FilterQuestionData: any = [];
  time: number = 0;
  timerInterval: any;
  timerRunning: boolean = false;
  QuestionId: any;
  IsDefaultExplanation: boolean = false;
  loadedQuestionDetails: { [key: string]: any } = {};
  ExamId: any;
  currentOpenPopup: string;
  taskGuid: string = '';
  courseId: string = '';
  dataLoaded:boolean=false;
  practiceMode : boolean = false;

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1000,
    });
  }
  @ViewChild('ReportQuestion') ReportQuestion!: ElementRef;  
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  constructor(private dialog: MatDialog, private _qbnakservice: QBanksService, private errorhandling: ApiErrorHandlerService,
    private route: ActivatedRoute, private snackBar: MatSnackBar, private router: Router, private loaction: Location, private _dataGuardService: DataGuardService, private sanitizer: DomSanitizer) {
    this.route.params.subscribe(res => {
      this.ExamId = res['examId'];      
      this.taskGuid = res['taskId'];      

    })
    this.route.queryParams.subscribe(res => {
      this.QuestionId = parseInt(res['id'], 10);
      this.practiceMode = res['isPracticeMode'] === 'true';
    });
    this.courseId = this._dataGuardService.getCourseId();
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
    this._qbnakservice.getQbnkAnswersheet(this.courseId, this.ExamId).subscribe((res: any) => {
      if(res){
      this.dataLoaded=true;
      self.questionDetails = res.questions;
      self.examDetails = res.examDetails;
      this.noOfCorrectAnswerd = self.questionDetails.filter(q => q.isCorrect).length;
      this.noOfInCorrectAnswerd = self.questionDetails.filter(q => q.isChecked && !q.isCorrect && !q.unAttempt).length;
      this.noOfunAttmptQuestion = self.questionDetails.filter(q => q.unAttempt).length;
      this.noOfmissedQuestion = this.questionDetails.length - (this.noOfCorrectAnswerd + this.noOfInCorrectAnswerd + this.noOfunAttmptQuestion);
      if (this.QuestionId)
        this.indexToFilter = this.questionDetails.findIndex((question, index) => question.questionDetailID === this.QuestionId);
      this.FilterQuestionData = this.questionDetails.filter((question, index) => index === this.indexToFilter)

      this.getquestiondetails(this.FilterQuestionData[0].questionDetailID);
}
    },
      (error) => {
        if (error) {
          this.router.navigate(['']);
        }
        this.errorhandling.handleError(error);
      }
    )


  }
  sanitizeExplanationContent(explanation) {
    // Replace backslashes if needed
    const sanitizedHtml = explanation?.replace(/\\/g, '');

    // Sanitize HTML
    return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
  }
  getquestiondetails(questionDetailID) {
    var self = this;
    if (this.loadedQuestionDetails[questionDetailID]) {
      this.currentQuestionDetail = this.loadedQuestionDetails[questionDetailID];
    } else {
      this._qbnakservice.getQbnkquestionDetailById(questionDetailID,this.ExamId, this.courseId).subscribe((response: any) => {
        this.currentQuestionDetail = response;
        this.loadedQuestionDetails[questionDetailID] = response;
      });
    }
  }
  setExplanation() {
    this.IsDefaultExplanation = !this.IsDefaultExplanation;
  }
  getQuestionClasses(choices: any): string {
    if (choices.some(choice => choice.isCorrect && choice.isChecked)) {
      return 'question-correct';
    }

    if (choices.every(choice => !choice.isChecked)) {
      return 'question-notVisited';
    }
    if (choices.some(choice => choice.isCorrect && !choice.isChecked)) {
      return 'question-wrong';
    }

    // Default case if none of the conditions above are met
    return 'question-notVisited';
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
      const audio = this.audioPlayer?.nativeElement;
      audio?.pause();
      this.filterQuestion(this.indexToFilter);
    }
  }
  // Filter Next Question
  NextQuestion() {
    if ((this.indexToFilter + 1) < this.questionDetails.length) {
      this.indexToFilter++;
      const audio = this.audioPlayer?.nativeElement;
      audio?.pause();
      this.filterQuestion(this.indexToFilter);
    }

  }
  getTotalUsers(questionData: any): number {
    if (!questionData || !questionData.choices) return 0;
    return questionData.choices.reduce((total, choice) => total + (choice.pollCount || 0), 0);
  }
  filterQuestion(IndexValue) {
    var self = this;
    var index = IndexValue + 1
    this.FilterQuestionData = this.questionDetails.filter((question, index) => index === IndexValue);
    this.getquestiondetails(this.FilterQuestionData[0].questionDetailID);
    setTimeout(() => {
      if (this.audioPlayer && this.audioPlayer.nativeElement) {
        const audio = this.audioPlayer.nativeElement;
        audio.pause();
        // Reset the audio player when the src changes
        if (this.currentQuestionDetail && this.currentQuestionDetail.audio) {
          audio.src = this.currentQuestionDetail.audio;
          audio.load();
        }
      }
    }, 100);
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
  reportQuestion() {
    const audio = this.audioPlayer.nativeElement;
    audio.pause();
    this.openDialogWithTemplateRef(this.ReportQuestion, 'ReportQuestion');
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

  private handleVisibilityChange() {
    if (document.hidden) {
      clearInterval(this.timerInterval);
      this.timerRunning = false;
      // this.sendActivityData();
    } else {
      this.time = 0;
      this.startTimer();
    }
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
      moduletype: 5
    };
    this._qbnakservice.reportQuestion(request).then(res => {

      if (res) {
        this.closedialog();
        this.openSnackBar("Sucessfully Submit..", 'Close');
      }

    },
      (error) => {
        this.errorhandling.handleError(error);
      });
  }

  // private sendActivityData() {
  //   clearInterval(this.timerInterval);
  //   this.timerRunning = false;

  //   var request = {
  //     cmbeCode: this.examDetails.code,
  //     timeDuration: this.time
  //   }
  //   // debugger;
  //   this._studentService.answerSheetProgress(request).then(res => {
  //   })
  // }

  BookmarkQuestions(Qustion: QuestionReponse, IsBookMark: boolean) {
    this.FilterQuestionData[0].isBoomarked = IsBookMark ? false : true;
    console.log(Qustion)
    var request = {
      examid: this.ExamId,  // Make sure the property names match
      questionId: Qustion[0].questionDetailID,
      // courseId: this.courseId,  // Make sure the property names match
      IsBookMark: IsBookMark ? false : true,
    };

    this._qbnakservice.BookmarkQbnkQuestion(request).subscribe((res) => {

    }, (error) => {
      this.openSnackBar("Something Wrong...", "Close");
    })
  }
  // ngOnDestroy() {
  //   if (this.time != 0)
  //     this.sendActivityData();
  // }
  Goback() {
    this.loaction.back();
  }
  getUniqueIntegrationTypes(integrations: any[]): string[] {
    if (!integrations) return [];
    
    // Create a Set of unique integration types
    const types = integrations.map(integration => integration.integrationType);
    return [...new Set(types)]; // Return unique types as an array
  }

}
