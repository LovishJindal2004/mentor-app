import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { QuestionReponse } from '../custom-qbank.model';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomQBankService } from '../custom-qbank.service';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { ApiErrorHandlerService } from 'app/modules/common/services/api-error-handling.service';
import { CustomGameHeaderComponent } from '../custom-game-header/custom-game-header.component';

@Component({
  selector: 'app-game-review',
  imports:[CommonModule,
    MatIconModule,
    MatStepperModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    MatSelectModule,
    MatNativeDateModule,
    MatMenuModule,
    MatProgressBarModule,
    MatListModule,
    ClipboardModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    CustomGameHeaderComponent],
  templateUrl: './game-review.component.html',
  styleUrls: ['./game-review.component.scss']
})
export class GameReviewComponent  implements OnInit {
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
  courseId: string = '';
  dataLoaded:boolean=false;
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1000,
    });
  }
  @ViewChild('ReportQuestion') ReportQuestion!: ElementRef;
  constructor(private dialog: MatDialog, private _qbnakservice: CustomQBankService, private errorhandling: ApiErrorHandlerService,
    private route: ActivatedRoute, private snackBar: MatSnackBar, private router: Router, private loaction: Location, private _dataGuardService: DataGuardService, private sanitizer: DomSanitizer) {
    this.route.params.subscribe(res => {
      this.ExamId = res['examid'];

    })
    this.route.queryParams.subscribe(res => {
      this.QuestionId = parseInt(res['id'], 10);
    })
  }
  openDialogWithTemplateRef(templateRef: any, panelClass: any) {
    this.dialog.open(templateRef, {
      panelClass: panelClass
    });
  }
  ngOnInit(): void {
    this.courseId = this._dataGuardService.getCourseId();
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
      this._qbnakservice.getAnsweersheetQbnkquestionDetailById(questionDetailID).subscribe((response: any) => {
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
      this.filterQuestion(this.indexToFilter);
    }
  }
  // Filter Next Question
  NextQuestion() {
    if ((this.indexToFilter + 1) < this.questionDetails.length) {
      this.indexToFilter++;
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
      courseId: this.courseId,  // Make sure the property names match
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

