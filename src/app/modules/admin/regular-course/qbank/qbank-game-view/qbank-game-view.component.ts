import { ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

// import { StudentService } from '../../student.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule, Location } from '@angular/common';
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
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { QbankGameHeaderComponent } from '../qbank-game-header/qbank-game-header.component';
import { QuestionActivaty, QuestionReponse } from '../qbanks.model';
import { QBanksService } from '../qbanks.service';

@Component({
  selector: 'app-qbank-game-view',
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
  QbankGameHeaderComponent],
  templateUrl: './qbank-game-view.component.html',
  styleUrl: './qbank-game-view.component.scss'
})
export class QbankGameViewComponent implements OnInit {
  @ViewChild('questionOverview') questionOverview!: ElementRef;
  @ViewChild('examExit') examExit!: ElementRef;
  @ViewChild('QuestionNotAnswred ') QuestionNotAnswred!: ElementRef;
  @ViewChild('QuestionAnswred ') QuestionAnswred!: ElementRef;
  @ViewChild('viewResult ') viewResult!: ElementRef;
  questionDetails: Array<QuestionReponse>;
  examDetails: any = [];
  FilterQuestionData: any = [];
  CurrentQuestionData: Array<QuestionReponse> = [];
  ExamId: any;
  keyPreFix: any;
  indexToFilter = 0;
  QuestionActivaty: QuestionActivaty;
  noOfAnswerdQuestion = 0;
  noOfNotAnswerdQuestion = 0;
  currentPopup: string | null = null;
  time: number = 0;
  timerInterval: any;
  timerRunning: boolean = false;
  selectedChoiseId: any;
  durations: any;
  choicesId: any = [];
  examStatus: any;
  currentOpenPopup: string;
  dataLoaded: boolean = false;
  isuserleftDirect: boolean = false;
  isviewtrackboard: boolean = false;
  taskGuid: string = '';
  SingleQuestionDetail: any = [];
  isQuestionhaserrorindex: number;
  isQuestionsubmitinProcess: boolean = false;
  isQuestionSubmithaserror: boolean = false;
  IsExplanationView: boolean = false;
  IsChoiceSelected: boolean = false;
  ChoicesLoaded: boolean = false;
  IsDefaultExplanation: boolean = false;
  isQuestionSkipped:boolean=false;
  isQuestionTimeExist:boolean=false;
  practiceMode:boolean=false;
  courseId:string='';
  openSnackBar(message: string, action: string) {
    this._snakbar.open(message, action, {
      duration: 1000,
    });
  }
  @ViewChild('ReportQuestion') ReportQuestion!: ElementRef;
   reportQuestionDialogRef!: any;
  formattedTime: any;
  //validation from user can't take copy,paste,screenshort,etc.
  @HostListener('window:keyup', ['$event']) keyEvent(e: KeyboardEvent) {
    if (e.key == 'PrintScreen' || e.key == '44') {
      navigator.clipboard.writeText('');
      alert('Screenshots disabled!');
    }
  };
  @HostListener('window:keydown', ['$event']) keyDownEvent(e: KeyboardEvent) {
    if (e.ctrlKey && e.key == 'p') {
      alert('This section is not allowed to print or export to PDF');
      e.cancelBubble = true;
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    else if (e.ctrlKey && e.key == 'c') {
      alert('This section is not allowed to print or export to PDF');
      e.cancelBubble = true;
      e.preventDefault();
      e.stopImmediatePropagation();
    }

  };
  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
  //End Validation
  constructor(
    private dialog: MatDialog,
    private _qbankservice: QBanksService,
    private route: ActivatedRoute,
    private router: Router,
    private errorhandling: ApiErrorHandlerService,
    private _dataGuardService: DataGuardService,
    private _ngZone: NgZone,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private _location:Location,
    private _snakbar: MatSnackBar) {
    var self = this;
    this.route.params.subscribe(res => {
      this.ExamId = res['examId'];
      this.taskGuid = res['taskId'];
      self.keyPreFix = this.ExamId + "-";
    })
    this.courseId = this._dataGuardService.getCourseId();

  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(res=>{
      console.log(res['time'])
      if(res['time']){
        this.isQuestionTimeExist=res['time'];
      }else{
        this.isQuestionTimeExist=false;
      }
    })
    this.loadQuestion();
 
  }
  //get Question
  loadQuestion() {
    var self = this;
    this._qbankservice.getQbankExamQuestion(this.courseId, this.ExamId,this.isQuestionTimeExist).subscribe((res: any) => {
      if(res){
      self.QuestionActivaty = res.activity;
      self.questionDetails = res.questions;
      self.examDetails = res.examDetails;
      if(self.examDetails.isTimerEnabled){
        // self.examDetails.questionDuration=30;
        self.questionDetails.forEach(res=>{
          res.duration=self.examDetails.questionDuration>0?self.examDetails.questionDuration:0;
        });
      }
  
      self.dataLoaded = true;
      this.noOfAnswerdQuestion = self.questionDetails.filter(
        q => q.isChecked && q.choices.some(choice => choice.isChecked)
      ).length;
      this.noOfNotAnswerdQuestion = self.questionDetails.length - this.noOfAnswerdQuestion;
      this.FilterQuestionData = this.questionDetails.filter((question, index) => index === this.indexToFilter)
      const unattempQuestionIndex = this.questionDetails.findIndex(question => !question.isChecked);
      const indexToFilter = (unattempQuestionIndex !== -1) ? unattempQuestionIndex : this.questionDetails.length - 1;
  
      // Filter the question based on the index
      this.filterQuestion(indexToFilter);
      this.indexToFilter = indexToFilter;
      }
    
    },
      (error) => {
        if (error.error.statusCode == 404) {
          this._snakbar.open(error.error.exception, 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
          this.router.navigate(['']);
        }
        else {
          this.errorhandling.handleError(error);
          this._location.back();
        }

      }
    )

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
  openDialogWithTemplateRef(templateRef: any, panelClass: any): MatDialogRef<any> { 
    this.closedialog(); // Close any previous dialogs
    let dialogRef: MatDialogRef<any>;
    
    if (this.examStatus === 3) {
        dialogRef = this.dialog.open(templateRef, {
            panelClass: panelClass,
            disableClose: true
        });
    } else {
        dialogRef = this.dialog.open(templateRef, {
            panelClass: panelClass,
        });
    }
    
    if (panelClass === 'popup-1') {
        this.currentPopup = "popup-1";
    } else if (panelClass === 'popup-2') {
        this.currentPopup = "popup-2";
    } else if (panelClass === 'popup-3') {
        this.currentPopup = "popup-3";
    } else if (panelClass === 'popup-4') {
        this.currentPopup = "popup-4";
    }

    return dialogRef; 
}
  receiveDataFromHeader(data: string, OpenPopup: boolean) {// this function for Open popup according to header click
    if (data == "leave") {
      OpenPopup = false;
      this.isuserleftDirect = true;
    }
    this.closedialog();

    if (data == "submitExam") {
      OpenPopup = false;
    }
    if (OpenPopup) {
      if (data === this.currentOpenPopup) {
        this.closedialog();
        // Reset the currentOpenPopup variable since the popup is now closed
        this.currentOpenPopup = null;
      } else {
        this.closedialog();
        if (data == 'AllQuestion') {
          this.openDialogWithTemplateRef(this.questionOverview, "popup-1");
        } else {
          this.openDialogWithTemplateRef(this.examExit, "popup-2");
        }
        this.currentOpenPopup = data;
      }
    }
    else {
      if (!this.isuserleftDirect) {
          if (this.noOfNotAnswerdQuestion != 0) {
            this.openDialogWithTemplateRef(this.QuestionNotAnswred, "popup-3");
          } else {
            this.openDialogWithTemplateRef(this.QuestionAnswred, "popup-4");
          }
      }



    }
  }
  closedialog() {// close all popup 
    this.dialog.closeAll();
    this.currentPopup = null;
    this.currentOpenPopup = null;
  }
  selectRadio(index: number) {
    if (!this.IsChoiceSelected && !this.isQuestionSkipped) {
      const selectedChoice = this.CurrentQuestionData[0].choices[index];
      selectedChoice.isChecked = !selectedChoice.isChecked;
      this.IsChoiceSelected = true;
      if (selectedChoice.isChecked) {
        for (let i = 0; i < this.CurrentQuestionData[0].choices.length; i++) {
          if (i !== index) {
            this.CurrentQuestionData[0].choices[i].isChecked = false;
          }
        }
      }
      console.log(this.CurrentQuestionData[0].choices,"this.CurrentQuestionData[0].choices")
      if(this.time>=1 && this.examDetails.isTimerEnabled){
        this.SaveandContiniue().then(() => {
          this.stopTimer();
        })
      }else{
        this.SaveandContiniue().then(() => {
         
        })
      }
     
    }

  }
  // set multiple answer
  onSelection(event: any) {
    var _isSelectedChoice = false;
    var self = this;
    if (event.option._selected != self.CurrentQuestionData[0].choices[event.option.value].isChecked) {
      self.CurrentQuestionData[0].choices[event.option.value].isChecked = event.option._selected;
    }
    if (self.CurrentQuestionData[0].choices) {
      for (let index = 0; index < self.CurrentQuestionData[0].choices.length; index++) {
        if (self.CurrentQuestionData[0].choices[index].isChecked)
          _isSelectedChoice = true;
      }
    }
  }
  //filter perivious Question
  // Filter Next Question
  NextQuestion() {
    this.isQuestionhaserrorindex = this.indexToFilter;
    this.indexToFilter++;
    this.isQuestionSkipped=false;

    this.filterQuestion(this.indexToFilter);
    // this.calcluteCount();
    this.IsExplanationView = false;
    this.SingleQuestionDetail = [];


  }
  //Filter Question by index 
  filterQuestion(IndexValue) {
    var index = IndexValue + 1
    this.FilterQuestionData = this.questionDetails.filter((question, index) => index === IndexValue);
    if(this.examDetails.isTimerEnabled && this.examDetails.questionDuration>0 && this.FilterQuestionData){
      this.startTimer();
    }
    this.CurrentQuestionData = JSON.parse(JSON.stringify(this.FilterQuestionData));
    this.CurrentQuestionData[0]?.choices.forEach((choice) => {
      if (choice.isChecked) {
        this.IsChoiceSelected = true;
        this.getQuestionDetail(this.CurrentQuestionData[0].questionDetailID);
        this.IsExplanationView = false;
      }
      else {
        this.ChoicesLoaded = false;
        this.IsChoiceSelected = false;
      }
    });
   

  }
  SaveandContiniue(): Promise<void> {
    return new Promise((resolve, reject) => {
      var self = this;

      self.durations = self.time;
      self.choicesId = [];
      var isapiHit: boolean = false;

      self.CurrentQuestionData[0]?.choices.forEach((choice) => {
        if (choice.isChecked) {
          self.choicesId.push(choice.choiceId);
        }
      });

      if (self.CurrentQuestionData?.length > 0) {
        var checkedChoiceIDs = self.FilterQuestionData[0]?.choices
          .filter((choice) => choice.isChecked)
          .map((choice) => choice.choiceId);
        isapiHit = checkedChoiceIDs?.length === self.choicesId?.length && self.choicesId.every((id) => checkedChoiceIDs.includes(id));
      }
      var ischoiesIchekd = self.CurrentQuestionData.some(question => question.isChecked);
      let request = {
        examId: self.ExamId,
        questionId: self.FilterQuestionData[0]?.questionDetailID,
        entityType: 1,
        entityId: self.courseId,
        choices: self.choicesId,
        duration: self.durations,
        activityId: this.QuestionActivaty?.activityId,
        // isPracticeMode: this.practiceMode
      };

      if (!ischoiesIchekd || !isapiHit) {
        self.FilterQuestionData[0].isChecked = true;
        const questionToUpdate = self.questionDetails.find((question) => question.questionDetailID === self.CurrentQuestionData[0].questionDetailID);
        if (questionToUpdate) {
          questionToUpdate.choices = self.CurrentQuestionData[0].choices.map((choice) => ({ ...choice }));
        }
        console.log(this.CurrentQuestionData[0].choices,"submit choice")
        self.submitQuestion(request, resolve, reject);
      } else {
        resolve();
      }
    });
  }

  submitQuestion(request: any, resolve: Function, reject: Function) {
    var self = this;
    const updatecurrentQuestion = self.CurrentQuestionData[0];

    self._qbankservice.submitQuestion(request).then(response => {
      if (response) {
        self.FilterQuestionData[0].isChecked = true;
        self.CurrentQuestionData[0].isChecked = true;
        const questionToUpdate = self.questionDetails.find((question) => question.questionDetailID === self.CurrentQuestionData[0].questionDetailID);
        if (questionToUpdate) {
          questionToUpdate.choices = updatecurrentQuestion.choices.map((choice) => ({ ...choice }));
        }
        this.isQuestionsubmitinProcess = false;
        this.isQuestionSubmithaserror = false;
        // this.CurrentQuestionData[0].choices=response;
          this.getQuestionDetail(this.CurrentQuestionData[0].questionDetailID);

        resolve();
      }
    }, (error) => {
      this.isQuestionSubmithaserror = true;
      this.calcluteCount();
      this.openSnackBar("Exam question not submitted, please talk with support", "Close");
      reject();
    });
  }
  getTotalUsers(questionData: any): number {
    if (!questionData || !questionData.choices) return 0;
    return questionData.choices.reduce((total, choice) => total + (choice.pollCount || 0), 0);
  }
  finsishExam(examStatus, isQuestionComplete) {

    this.dialog.closeAll();
    this.examStatus = examStatus;
    var self = this;
    let request = {
      examId: this.ExamId,      
      entityType: 1,
      entityId: this.courseId,
      // courseId: this.courseId,
      examStatus: examStatus,
      activityId: this.QuestionActivaty?.activityId
    }
    self._qbankservice.finishExam(request).then(response => {
      if (response) {
        if (this.isuserleftDirect) {
          this.dialog.closeAll();
          this.router.navigate(['']);
        }
        else {
          if (!isQuestionComplete) {
            this._ngZone.run(() => {
              this.router.navigate(['/qbanks/subjects' ]);
            });
          }
          else {
            this.openDialogWithTemplateRef(this.viewResult, "popup-5");
          }
        }
      }
    },
      (error) => {
        this.errorhandling.handleError(error);
      })
  }

  viewresult() {
    this.dialog.closeAll();
    this._ngZone.run(() => {
      this.router.navigate(['/qbanks/game-analytics', this.ExamId]);
    });
  }
  calcluteCount() {
    var self = this;
    this.noOfAnswerdQuestion = self.questionDetails.filter(
      q => q.isChecked && q.choices.some(choice => choice.isChecked)
    ).length;
    this.noOfNotAnswerdQuestion = self.questionDetails.length - this.noOfAnswerdQuestion;
  }
  getQuestionDetail(QuestionDetailId) {
    this.SingleQuestionDetail = [];
    this.IsExplanationView = false;
    this.ChoicesLoaded = false;
    this._qbankservice.getQbnkquestionDetailById(QuestionDetailId, this.ExamId, this.courseId).subscribe(res => {
      if (res) {
        const questionIndex = this.questionDetails.findIndex(q => q.questionDetailID === QuestionDetailId);
        if (questionIndex !== -1) {
          this.questionDetails[questionIndex].choices = res.choices;
        }
        this.CurrentQuestionData[0] = res;
        this.ChoicesLoaded = true;
          this.SingleQuestionDetail = res;
          this.IsExplanationView = true;
        this.CurrentQuestionData[0]?.choices.forEach((choice) => {
          if (choice.isChecked) {
            this.IsChoiceSelected = true;
          }

        });
        this.cdr.detectChanges();
      }

    }, (error) => {
      this.IsExplanationView = false;
      this.errorhandling.handleError(error);
    })

  }
  setExplanation() {
    this.IsDefaultExplanation = !this.IsDefaultExplanation;
  }
  sanitizeExplanationContent(explanation) {
    // Replace backslashes if needed
    const sanitizedHtml = explanation?.replace(/\\/g, '');

    // Sanitize HTML
    return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
  }
  trackQuestion() {
    this.isviewtrackboard = !this.isviewtrackboard;
  }


  ngOnDestroy() {
    if (this.isuserleftDirect) {
      this.finsishExam(2, false);
    }
    this.stopTimer();
  
  }
  reportQuestion() {
  
    this.reportQuestionDialogRef = this.openDialogWithTemplateRef(this.ReportQuestion, 'ReportQuestion');
  
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
    this._qbankservice.reportQuestion(request).then(res => {

      if (res) {
        this.closedialog();
        this.openSnackBar("Sucessfully Submit..", 'Close');
      }

    },
      (error) => {
        this.errorhandling.handleError(error);
      });
  }
  BookmarkQuestions(Qustion: QuestionReponse, IsBookMark: boolean) {
    this.FilterQuestionData[0].isBoomarked = IsBookMark ? false : true;
    var request = {
      examid: this.ExamId,  // Make sure the property names match
      questionId: Qustion[0].questionDetailID,
      // courseId:this.courseId,  // Make sure the property names match
      IsBookMark: IsBookMark ? false : true,
    };

    this._qbankservice.BookmarkQbnkQuestion(request).subscribe((res) => {

    },(error)=>{
      this.openSnackBar("Something Wrong...","Close");
    })
  }
  getUniqueIntegrationTypes(integrations: any[]): string[] {
    if (!integrations) return [];
    
    // Create a Set of unique integration types
    const types = integrations.map(integration => integration.integrationType);
    return [...new Set(types)]; // Return unique types as an array
  }


     //Start timer
  startTimer() {
    //Assigning Duration or each part 
    if (this.FilterQuestionData[0]) {
      this.time = this.FilterQuestionData[0].duration || 0; 
    } else {
      return;
    }  
    this.displayTime();
    if (!this.timerRunning) {
      if (this.time < 0) {
        // Handle the case where the timer would be negative (examDuration - duration is less than 0).
        this.time = 0;
      }
      this.timerInterval = setInterval(() => {
        if (this.time <= 0) {
          clearInterval(this.timerInterval);
          this.timerRunning = false;
          // Handle timer completion here, e.g., show a message or perform an action.
        } else {
          this.time--;
          this.displayTime();
        }
      }, 1000);
      this.timerRunning = true;
    }

  }
  
  displayTime() {
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(this.time / 3600);  // 1 hour = 60 minutes * 60 seconds
    const remainingSeconds = this.time % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    this.formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (this.time === 0 && !this.IsExplanationView) {
     this.SaveandContiniue().then(()=>{
      this.isQuestionSkipped=true;
this.stopTimer();
     })
  }
}

  stopTimer(): void {
    clearInterval(this.timerInterval);
    this.timerRunning = false;
  }
}