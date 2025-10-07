import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule, Location, PlatformLocation } from '@angular/common';
import { Subject, interval, takeUntil } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { ApiErrorHandlerService } from 'app/modules/common/services/api-error-handling.service';
import { ExamService } from '../exams.service';
import { QuestionReponse, parts, QuestionActivaty } from '../exams.model';
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
  selector: 'app-exam-game-view',
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
  ExamGameHeaderComponent],
  templateUrl: './exam-game-view.component.html',
  styleUrl: './exam-game-view.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ExamGameViewComponent implements OnInit {
  @ViewChild('Questionpaper') Questionpaper!: ElementRef;
  @ViewChild('examExit') examExit!: ElementRef;
  @ViewChild('QuestionNotAnswred ') QuestionNotAnswred!: ElementRef;
  @ViewChild('QuestionAnswred ') QuestionAnswred!: ElementRef;
  @ViewChild('viewResult ') viewResult!: ElementRef;
  @ViewChild('examinstructions ') examinstructions!: ElementRef;
  @ViewChild('finsihalert ') finsihalert!: ElementRef;
  isviewtrackboard: boolean = false;
  questionDetails: Array<QuestionReponse>;
  exampartdetails: Array<parts>
  examDetails: any = [];
  FilterQuestionData: any = [];
  CurrentQuestionData: Array<QuestionReponse> = [];
  ExamId: any;
  keyPreFix: any;
  CbmeId: any;
  indexToFilter = 0;
  QuestionActivaty: QuestionActivaty;
  noOfAnswerdQuestion = 0;
  noOfNotAnswerdQuestion = 0;
  noOfQuestionnotvisite = 0;
  answerdandMarkedforReview = 0;
  partIndex: any = 0;
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
  formattedTime: any;
  questionSubmissionType: number = 0;
  noOfCrisk = 0;
  noOfMarked = 0;
  isreviewHidden = false;
  taskGuid: any;
  selectedTabIndex: any = 0;
  hoveredIndex: number | null = null;
  finishExamCalled = false;
  alertTimer: boolean = false;
  isQuestionhaserrorindex: number;
  ischoiceSelected: boolean = false;
  isQuestionSubmithaserror: boolean = false;
  isQuestionsubmitinProcess: boolean = false;
  noOfQuestionPending: number = 0;
  partnoOfQuestionanswerd: number = 0;
  practiceMode: boolean = false
  showAnswer: boolean =false;
  openSnackBar(message: string, action: string) {
    this._snakbar.open(message, action, {
      duration: 1000,
    });
  }
  private destroy$ = new Subject<void>();
  constructor(private dialog: MatDialog, private _examService: ExamService, private _ngZone: NgZone, private router: Router,
    private _snakbar: MatSnackBar, private activeroute: ActivatedRoute, private _dataGuardService: DataGuardService, private errorhandling: ApiErrorHandlerService, private _datgurd: DataGuardService, private cdr: ChangeDetectorRef, private _location: PlatformLocation, private sanitizer: DomSanitizer) {
    _location.onPopState(() => {
      // debugger
      if (!this.finishExamCalled) {
        this.finsishExam(2, false);
        this.finishExamCalled = true;
      }
    });
  }

  ngOnInit(): void {
    this.activeroute.params.subscribe(res => {
      if (res) {
        this.ExamId = res['examId'];
        this.taskGuid = res['taskId'];
        this.keyPreFix = this.ExamId + "-";
      }
    });
    this.activeroute.queryParams.subscribe(res => {
      if (res) {
        // this.practiceMode = res['isPracticeMode'] === 'true';
      }
    });
    // interval(60000)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(() => {
    //     // console.log("function call")
    //     this.SaveandContiniue(false, true);
    //   });
    this.loadQuestion();
    this.cdr.detectChanges();
  }

  //get Question
  loadQuestion() {
    var self = this;
    this._examService.getsigleExam(this.taskGuid, this.ExamId).subscribe((res: any) => {
      self.QuestionActivaty = res.activity;
      self.exampartdetails = res.parts;
      self.examDetails = res.examDetails;
      self.dataLoaded = true;
      this.startTimer();
    },
      (error) => {
        if (error) {

          this._snakbar.open(error.exception, 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
          this._location.back();
          this.errorhandling.handleError(error);
        }
      }
    )
  }
  //get partWise Questions mat-tab click 
  getpartWiseQuestions(event) {
    var self = this;
    self.partIndex = event.index;
    this.selectedTabIndex = self.partIndex;
    self.questionDetails = self.exampartdetails[self.partIndex].questions;
    this.noOfAnswerdQuestion = self.questionDetails.filter(
      q => q.isChecked && q.choices.some(choice => choice.isChecked)
    ).length;
    this.noOfQuestionnotvisite = self.questionDetails.filter(
      q => !q.isChecked
    ).length;
    this.answerdandMarkedforReview = self.questionDetails.filter(q => q.isMarkedReview == true && q.choices.some(choice => choice.isChecked)).length;
    this.noOfMarked = self.questionDetails.filter(q => q.isMarkedReview == true && !q.choices.some(choice => choice.isChecked)).length;
    this.noOfNotAnswerdQuestion = self.questionDetails.filter(
      q => q.isChecked && !q.choices.some(choice => choice.isChecked)
    ).length;
    this.noOfCrisk = self.questionDetails.filter(q => q.isCalculateRisk == true).length;
    // this.FilterQuestionData = this.questionDetails.filter((question, index) => index === this.indexToFilter)
    let QueueId: any = self._dataGuardService.getLocalExamData(self.keyPreFix + '-singleExamsindex' + self.partIndex + self.QuestionActivaty.activityId);
    let acitvityId = self._dataGuardService.getLocalExamData(self.keyPreFix + '-singleExams' + self.partIndex + self.QuestionActivaty.activityId);
    // let partIndex=self._dataGuardService.getLocalExamData(self.keyPreFix + '-singleExamspartIndex'+self.partIndex);
    //  debugger
    if (acitvityId != this.ExamId) {
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
    this.cdr.detectChanges();
  }
  sanitizeExplanationContent(explanation) {
    // Replace backslashes if needed
    const sanitizedHtml = explanation?.replace(/\\/g, '');

    // Sanitize HTML
    return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
  }
  //Select radio button 
  selectRadio(index: number) {
    if(this.practiceMode){
      this.showAnswer = true;
      this.cdr.detectChanges();
    }
    const selectedChoice = this.CurrentQuestionData[0].choices[index];
    selectedChoice.isChecked = !selectedChoice.isChecked;
    this.ischoiceSelected = selectedChoice.isChecked;
    if (selectedChoice.isChecked) {
      for (let i = 0; i < this.CurrentQuestionData[0].choices.length; i++) {
        if (i !== index) {
          this.CurrentQuestionData[0].choices[i].isChecked = false;
        }
      }
    }
    

  }
  // set multiple answer
  onSelection(event: any) {
    var _isSelectedChoice = false;
    var self = this;
    const selectedIndex = self.CurrentQuestionData[0]?.choices.findIndex(choice => choice.choiceId === event.option.value);
    this.ischoiceSelected = event.option._selected;
    if (event.option._selected != self.CurrentQuestionData[0].choices[selectedIndex].isChecked) {
      self.CurrentQuestionData[0].choices[selectedIndex].isChecked = event.option._selected;
    }
    if (self.CurrentQuestionData[0].choices) {
      for (let index = 0; index < self.CurrentQuestionData[0].choices.length; index++) {
        if (self.CurrentQuestionData[0].choices[index].isChecked)
          _isSelectedChoice = true;
      }
    }
    // this.cdr.detectChanges();
  }
  //for show tab track info
  setHoveredIndex(index: number): void {
    this.hoveredIndex = index;
  }

  clearHoveredIndex(): void {
    this.hoveredIndex = null;
  }
   gotoQuestion(index) {
    this.showAnswer = false;
    this.isQuestionhaserrorindex = this.indexToFilter;

    // Check if the index has changed
    if (index !== this.indexToFilter) {
     this.SaveandContiniue(false).then(()=>{
      if (!this.isQuestionSubmithaserror) {
        this.indexToFilter = index;
        this.filterQuestion(this.indexToFilter);
        this.calcluteCount();
      } else {
        this.openSnackBar("Exam question not submitted, please talk with support", "Close");
      }
     });
    }

   

    this.dialog.closeAll();
  }

  //filter perivious Question
  previousQuestion() {
    
    this.showAnswer = false;
    if (this.indexToFilter >= 0) {
      this.isQuestionhaserrorindex = this.indexToFilter;
      this.SaveandContiniue(false).then(() => {
       
        if (!this.isQuestionSubmithaserror) {
          this.calcluteCount();
          if(this.indexToFilter ==0){
            if(this.partIndex>0){
              this.selectedTabIndex = this.partIndex - 1;
            }
          }
          else{
          this.indexToFilter--;
          this.filterQuestion(this.indexToFilter);
          
          }
        } else {
          this.openSnackBar("Exam question not submitted, please talk with support", "Close");
        }
      })
    }
  }


  checkQuestionDisable(choices:any[]){
    if(this.practiceMode){
      return choices?.some(c=> c?.isChecked == true)
    }else {
      return false
    }
  }
  // Filter Next Question
  NextQuestion() {
    var self = this;
    
    self.showAnswer = false;
    var index = this.indexToFilter + 1;
    this.isQuestionhaserrorindex = this.indexToFilter;
    // if (self.questionDetails.length > index) {
      // Call SaveandContiniue and proceed only after the API call is complete
      this.SaveandContiniue(false).then(() => {
        if (!this.isQuestionSubmithaserror) {
          if(self.questionDetails.length==index){
            if (this.exampartdetails.length == this.partIndex + 1) {
              this.receiveDataFromHeader('', false);
            } else {
              this.selectedTabIndex = this.partIndex + 1;
            }
          }
          else{
          this.indexToFilter++;
          this.filterQuestion(this.indexToFilter);
          this.calcluteCount();
          }
        } else {
          this.openSnackBar(" Exam question not submitted, please talk with support", "Close");
        }
      });

    
    
  }

  filterQuestion(IndexValue) {
    var self = this;
    var index = IndexValue + 1
    self.FilterQuestionData = self.questionDetails.filter((question, index) => index === IndexValue);
    // debugger
    self._dataGuardService.setLocalExamData(self.keyPreFix + '-singleExamsindex' + self.partIndex + self.QuestionActivaty.activityId, index.toString());
    self._dataGuardService.setLocalExamData(self.keyPreFix + '-singleExams' + self.partIndex + self.QuestionActivaty.activityId, this.ExamId);
    self._dataGuardService.setLocalExamData(self.keyPreFix + '-singleExamspartIndex', self.partIndex.toString());
    var choice = self.FilterQuestionData[0].choices.some(choice => choice.isChecked)
    this.ischoiceSelected = choice;
    self.CurrentQuestionData = JSON.parse(JSON.stringify(self.FilterQuestionData));
    this.cdr.detectChanges();
  }
  //Clear Question response 
  ClearQuestionResponse(CurrentQuestionData: QuestionReponse, index) {
    var self = this;    
    self.showAnswer = false;
    this.isQuestionhaserrorindex = index;
    CurrentQuestionData.choices.forEach(question => {
      question.isChecked = false;
    })
    CurrentQuestionData.isCalculateRisk = false;
    CurrentQuestionData.isMarkedReview = false;
    this.FilterQuestionData[0].isCalculateRisk = false;
    this.FilterQuestionData[0].isMarkedReview = false;
    self.questionSubmissionType = 4;
    this.SaveandContiniue(false).then(() => {
      this.calcluteCount();
    });

  }

  SaveandContiniue(iscalcluteRiskorMarked: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      var self = this;
      self.durations = (self.QuestionActivaty?.testDuration || 0) * 60 - (self.time);
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
        isapiHit = checkedChoiceIDs?.length == self.choicesId?.length && self.choicesId.every((choiceId) => checkedChoiceIDs.includes(choiceId));
      }
      var ischoiesIchekd = self.CurrentQuestionData.some(question => question.isChecked);
      let request = {
        testId: self.ExamId,
        entityType: 2,
        entityId: self.taskGuid,
        questionId: self.CurrentQuestionData[0]?.questionDetailID,
        // courseId: self.courseId,
        choices: self.choicesId,
        duration: self.durations,
        isMarkedReview: self.FilterQuestionData[0]?.isMarkedReview,
        isCalculateRisk: self.FilterQuestionData[0]?.isCalculateRisk,
        questionSubmissionType: self.questionSubmissionType,
        partId: self.CurrentQuestionData[0]?.partId,
        // isPracticeMode: this.practiceMode,        
        activityId: this.QuestionActivaty?.activityId,
      };

      if (iscalcluteRiskorMarked) {
        this.submitQuestion(request, resolve, reject);
      } else {
        if (!ischoiesIchekd || !isapiHit) {
          self.questionSubmissionType = 0;
          // If iscalcluteRiskorMarked is false and the conditions are met, call submitQuestion and resolve the promise only after the API call is complete
          this.submitQuestion(request, resolve, reject);
        } else {
          // If conditions are not met, resolve the promise immediately
          resolve();
        }
      }
    });
  }

  submitQuestion(request, resolve, reject) {
    var self = this;
    const updatecurrentQuestion = self.CurrentQuestionData[0];
    this.isQuestionsubmitinProcess = true;
    self._examService.submitQuestion(request).then(response => {
      if (response) {
        self.FilterQuestionData[0].isChecked = true;
        self.CurrentQuestionData[0].isChecked = true;
        const questionToUpdate = self.questionDetails.find((question) => question.questionDetailID === self.CurrentQuestionData[0].questionDetailID);
        if (questionToUpdate) {
          questionToUpdate.choices = updatecurrentQuestion.choices.map((choice) => ({ ...choice }));
        }
        this.isQuestionsubmitinProcess = false;
        this.isQuestionSubmithaserror = false;
        resolve();
      }// Resolve the promise to signal that the API call is complete
    },
      (error) => {
        // this.stopTimer();
        this.isQuestionSubmithaserror = true;
        // this.indexToFilter = this.isQuestionhaserrorindex;
        // this.filterQuestion(this.indexToFilter);
        this.calcluteCount();
        this.isQuestionsubmitinProcess = false;
        this.openSnackBar(" Exam question not submitted, please talk with support", "Close");
        reject();  // Reject the promise to signal that there was an error during the API call
      });
  }
  //finish Exam
  finsishExam(examStatus, isQuestionComplete) {
    this.dialog.closeAll();
    this.examStatus = examStatus;
    var self = this;
    this.durations = (self.QuestionActivaty?.testDuration || 0) * 60 - (this.time);
    let request = {
      testId: this.ExamId,
      entityId: this.taskGuid,
      entityType: 2,
      // courseId: this.courseId,
      duration: this.durations,
      status: examStatus,      
      // isPracticeMode: this.practiceMode,      
      activityId: this.QuestionActivaty?.activityId,
    }
    // debugger
    self._examService.finishExam(request).then(response => {
      if (examStatus != 2) {
        self._dataGuardService.removeLocalData(self.keyPreFix + '-singleExamsindex' + self.partIndex + self.QuestionActivaty.activityId);
        self._dataGuardService.removeLocalData(self.keyPreFix + '-singleExams' + self.partIndex + self.QuestionActivaty.activityId);
        self._dataGuardService.setLocalExamData(self.keyPreFix + '-singleExamspartIndex' + self.partIndex + self.QuestionActivaty.activityId, self.partIndex.toString());
      }
      // else {
      //   self._dataGuardService.setLocalExamData(self.keyPreFix + '-singleExamspartIndex', self.partIndex.toString());
      // }
      if (response) {
        if (this.isuserleftDirect) {
          this.dialog.closeAll();
          this.router.navigate(['']);
        }
        else {
          if (!isQuestionComplete) {
            this.router.navigate(['/task/list']);
            // if(this.examDetails?.examType == 3){
            //   this.router.navigate([`exam-management/list/${self.examDetails.testCategory}/${self.examDetails.examType}/examtype`])
            // }else{
            //   this.router.navigate([`exam-management/list/${self.examDetails.testCategory}/${self.examDetails.examType}`])
            // }
          }
          else {
            this.openDialogWithTemplateRef(this.viewResult, "popup-5");
          }
        }
      }
    },
      (error) => {
        this.openSnackBar("Exam not submitted, please talk with support", "Close")
      })
  }
  //View result Popup
  viewresult() {
    this.dialog.closeAll();
    this._ngZone.run(() => {
      this.router.navigate([`/exams/game-analytics`, this.ExamId, this.taskGuid]);
    });
  }
  //Start timer
  startTimer() {
    var self = this;
    if (!this.timerRunning) {
      const examDurationInSeconds = (self.QuestionActivaty?.testDuration || 0) * 60;
      const durationInSeconds = self.QuestionActivaty?.duration || 0;
      this.time = examDurationInSeconds - durationInSeconds;
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
    this.displayTime();
  }
  //Display timer
  displayTime() {
    // Calculate minutes and seconds
    const hours = Math.floor(this.time / 3600);  // 1 hour = 60 minutes * 60 seconds
    const remainingSeconds = this.time % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    // Format hours, minutes, and seconds with leading zeros
    this.formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    // console.log(this.formattedTime )
    // console.log(this.time)
    if (this.time <= 600 && this.time > 0 && !this.alertTimer) {
      // Set up a timer to trigger the alert after a delay
      if (this.examStatus != 3) {
        this.openDialogWithTemplateRef(this.finsihalert, "popup-6");
      }
      this.alertTimer = true;
      // Adjust the delay as needed
    }
    if (this.time == 0) {
      this.handleVisibilityChange(3, true);
    }
    // Update the UI to display the formatted time
    // document.getElementById('timer-display').innerText = formattedTime;
  }
  //Calclute Counting 
  calcluteCount() {
    var self = this;
    this.noOfAnswerdQuestion = self.questionDetails.filter(
      q => q.isChecked && q.choices.some(choice => choice.isChecked)
    ).length;
    this.noOfNotAnswerdQuestion = self.questionDetails.filter(
      q => q.isChecked && !q.choices.some(choice => choice.isChecked)
    ).length;
    this.noOfQuestionnotvisite = self.questionDetails.filter(
      q => !q.isChecked
    ).length;
    // this.noOfCrisk = 0;
    // this.noOfMarked = 0;
    this.answerdandMarkedforReview = self.questionDetails.filter(q => q.isMarkedReview == true && q.choices.some(choice => choice.isChecked)).length;
    this.noOfCrisk = self.questionDetails.filter(q => q.isCalculateRisk == true).length;
    this.noOfMarked = self.questionDetails.filter(q => q.isMarkedReview == true && !q.choices.some(choice => choice.isChecked)).length;
  }
  //Popup handling 
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
        // Reset the currentOpenPopup variable since the popup is now closed
        this.currentOpenPopup = null;
      } else {
        if (data == 'examinstructions') {
          this.openDialogWithTemplateRef(this.examinstructions, "examinstructions");
          this.currentOpenPopup = data;
        }
        else {
          this.openDialogWithTemplateRef(this.examExit, "popup-2");
          this.currentOpenPopup = data;
        }
      }
    }
    else {
      if (data == "leave") {
        this.currentOpenPopup = null;
      }
      else {
        this.SaveandContiniue(false).then(()=>{
          this.calcluteCount();
          this.getpartwiseTotelcount();
          if (this.noOfNotAnswerdQuestion != 0) {
            this.openDialogWithTemplateRef(this.QuestionNotAnswred, "popup-3");
          } else {
            this.openDialogWithTemplateRef(this.QuestionAnswred, "popup-4");
          }
        });
      }
    }
  }
  getpartwiseTotelcount(){
    let noofnotanswerd = 0;
        let noofnotvisite = 0;
        let noofAnserd = 0;
        for (let index = 0; index < this.exampartdetails.length; index++) {
          var partquestiondetails = this.exampartdetails[index].questions;

          noofnotanswerd += partquestiondetails.filter(
            q => q.isChecked && !q.choices.some(choice => choice.isChecked)
          ).length;

          noofnotvisite += partquestiondetails.filter(
            q => !q.isChecked
          ).length;
          noofAnserd += partquestiondetails.filter(
            q => q.isChecked && q.choices.some(choice => choice.isChecked)
          ).length;
        }
        this.partnoOfQuestionanswerd = noofAnserd;
        this.noOfQuestionPending = noofnotanswerd + noofnotvisite;
  }
  //Crisk and Marked
  setMarkandReview(selectType: any, Question: QuestionReponse) {
    var self = this;
    self.showAnswer = false;
    var index = this.indexToFilter + 1
    if (self.questionDetails.length > index) {
      if (selectType === 'marked') {
        this.FilterQuestionData[0].isMarkedReview = Question[0].isMarkedReview !== true ? true : false;
        this.questionSubmissionType = 2;
        this.isQuestionhaserrorindex = this.indexToFilter;
        this.SaveandContiniue(true).then(() => {
          this.indexToFilter++;
          this.filterQuestion(this.indexToFilter);
          this.calcluteCount();
        });

      }
      else {
        this.FilterQuestionData[0].isCalculateRisk = Question[0].isCalculateRisk !== true ? true : false;
        this.questionSubmissionType = 1;
        this.isQuestionhaserrorindex = this.indexToFilter;
        this.SaveandContiniue(true).then(() => {
          this.indexToFilter++;
          this.filterQuestion(this.indexToFilter);
          this.calcluteCount();
        });
      }
    } else {
      if (selectType === 'marked') {
        this.FilterQuestionData[0].isMarkedReview = Question[0].isMarkedReview !== true ? true : false;
        this.questionSubmissionType = 2;
        this.isQuestionhaserrorindex = this.indexToFilter;
        this.SaveandContiniue(true).then(() => {
          if (this.exampartdetails.length == this.partIndex + 1) {
            this.receiveDataFromHeader('', false);
          }
          else {
            this.selectedTabIndex = this.partIndex + 1;
          }
        });

      }
      else {
        this.FilterQuestionData[0].isCalculateRisk = Question[0].isCalculateRisk !== true ? true : false;
        this.questionSubmissionType = 1;
        this.isQuestionhaserrorindex = this.indexToFilter;
        this.SaveandContiniue(true).then(() => {
          if (this.exampartdetails.length == this.partIndex + 1) {
            this.receiveDataFromHeader('', false);
          }
          else {
            this.selectedTabIndex = this.partIndex + 1;
          }
        });

      }

    }

  }
  openQuestionpaper() {
    this.openDialogWithTemplateRef(this.Questionpaper, "Questionpaper");
  }
  openDialogWithTemplateRef(templateRef: any, panelClass: any) { //Open popup and close perivious popup 
    if (this.examStatus === 3) {
      this.dialog.open(templateRef, {
        panelClass: panelClass,
        disableClose: true
      });
    }
    else {
      this.getpartwiseTotelcount();
      this.dialog.open(templateRef, {
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
  }

  trackQuestion() {
    this.isviewtrackboard = !this.isviewtrackboard;
  }

  @HostListener('document:visibilitychange', ['$event'])
  onVisibilityChange(event: Event) {
    this.handleVisibilityChange(2, false);
  }
  handleVisibilityChange(examstatus, istimeup: boolean) {
    if (document.hidden || istimeup) {
      var self = this;

      this.durations = (self.QuestionActivaty?.testDuration || 0) * 60 - (this.time);
      let request = {
        testId: this.ExamId,
        entityId: this.taskGuid,
        entityType: 2,
        // courseId: this.courseId,
        duration: this.durations,
        status: examstatus,        
        // isPracticeMode: this.practiceMode,
        activityId: this.QuestionActivaty?.activityId,
      }
      // debugger
      self._examService.finishExam(request).then(response => {
        if (response) {
          if (istimeup) {
            this._ngZone.run(() => {
              this.router.navigate(['/exams/game-analytics/', this.ExamId, this.taskGuid]);
            });
          }

        }
      },
        (error) => {
          this.errorhandling.handleError(error);
        })
    }
  }
  //Get Css Class According to this 
  getQuestionClasses(question: QuestionReponse): string {
    const anyChoiceChecked = question.choices.some(choice => choice.isChecked);
    if (anyChoiceChecked && !question.isCalculateRisk && !question.isMarkedReview) {
      return 'answered';
    }
    if (!question.isChecked) {
      return 'not-visited';
    }
    if (question.isChecked && !anyChoiceChecked && !question.isMarkedReview && !question.isCalculateRisk) {
      return 'not-answered';
    }
    if (question.isChecked && question.isMarkedReview && !anyChoiceChecked) {
      return 'marked';
    }
    if (question.isChecked && anyChoiceChecked && question.isMarkedReview) {
      return 'marked reviewed';
    }
    if (question.isChecked && question.isCalculateRisk) {
      return 'crisk';
    }
    this.cdr.detectChanges();
  }

  closedialog() {
    this.dialog.closeAll();
    this.currentPopup = null;
    this.currentOpenPopup = null;
  }
  stopTimer(): void {
    clearInterval(this.timerInterval);
    this.timerRunning = false;
  }
  ngOnDestroy() {

    this.destroy$.next();
    this.destroy$.complete();
    if (this.isuserleftDirect) {
      this.finsishExam(2, false);
    }
    this.finishExamCalled = true;
    this.stopTimer();
  }
}