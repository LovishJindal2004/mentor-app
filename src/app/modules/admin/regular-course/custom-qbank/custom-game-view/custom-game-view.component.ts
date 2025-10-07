import { Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { customExam, QuestionActivaty } from '../custom-qbank.model';
import { StudentService } from 'app/modules/admin/student-management/student.service';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { ApiErrorHandlerService } from 'app/modules/common/services/api-error-handling.service';
import { CustomGameHeaderComponent } from '../custom-game-header/custom-game-header.component';

@Component({
  selector: 'app-custom-game-view',
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
  templateUrl: './custom-game-view.component.html',
  styleUrls: ['./custom-game-view.component.scss']
})
export class CustomGameViewComponent implements OnInit {

  @ViewChild('questionOverview') questionOverview!: ElementRef;
  @ViewChild('examExit') examExit!: ElementRef;
  @ViewChild('QuestionNotAnswred ') QuestionNotAnswred!: ElementRef;
  @ViewChild('QuestionAnswred ') QuestionAnswred!: ElementRef;
  @ViewChild('viewResult ') viewResult!: ElementRef;
  questionDetails: Array<any> = [];
  examDetails: any = [];
  FilterQuestionData: any = [];
  CurrentQuestionData: Array<any> = [];
  customExam: customExam;
  ExamId: any;
  keyPreFix: any;
  CbmeId: any;
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
  digitalClockDisplay: string = '';
  startExamButton: boolean = false;
  timerDisabled: boolean = true; // Initialize button as disabled
  isExamStart: Boolean = false; //to hide exam
  startExamTime: boolean = true;  //to hide div untill button is clicked
  timeDifferenceInMilliseconds: any;
  isUserLate: boolean = false;
  isexammanullyStart: boolean = false;
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
  constructor(private dialog: MatDialog, private _studentService: StudentService, private route: ActivatedRoute, private router: Router, private errorhandling: ApiErrorHandlerService,
    private _dataGuardService: DataGuardService, private _ngZone: NgZone,) {
    var self = this;
    this.route.params.subscribe(res => {
      this.CbmeId = res['CbmeId']
      this.ExamId = res['code']
      self.keyPreFix = this.ExamId + "-";
    })
    console.log(customExam, "customExam")
  }
  ngOnInit(): void {
    this.loadQuestion();

    // let now = new Date();
    // let tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    // console.log(tenMinutesAgo, "tenMinutesAgo")
    // Create an instance of the customExam class using the constructor
    var examData: customExam = {
      examId: "123",
      startTime: Date.now() + (1 * 60 * 1000),
      // startTime: tenMinutesAgo.getTime(),
      endTime: Date.now() + (2 * 60 * 60 * 1000),

      isExamManully: false
    };

    this.customExam = new customExam(examData);
    console.log(this.customExam.endTime, "end time")
    console.log(this.customExam.startTime, "startTime")
    this.startTimer(examData);
  }
  //get Question
  loadQuestion() {
    var self = this;
    self.questionDetails.push({
      questionTitle: 'Your question title here first'
    },
      {
        questionTitle: 'Your question title here second'
      },


    )
    console.log(self.questionDetails)
    this.filterQuestion(this.indexToFilter)

  }

  openDialogWithTemplateRef(templateRef: any, panelClass: any) { //Open popup and close perivious popup 
    this.closedialog();
    this.dialog.open(templateRef, {
      panelClass: panelClass
    });
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
  receiveDataFromHeader(data: string, OpenPopup: boolean) {// this function for Open popup according to header click
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
      // this.calcluteCount();
      if (this.noOfNotAnswerdQuestion != 0) {
        this.openDialogWithTemplateRef(this.QuestionNotAnswred, "popup-3");
      } else {
        this.openDialogWithTemplateRef(this.QuestionAnswred, "popup-4");
      }

    }
  }
  closedialog() {// close all popup 
    this.dialog.closeAll();
    this.currentPopup = null;
  }
  selectRadio(index: any, data: any) {// set sigle choise question
    var self = this;
    if (data == false) {
      if (self.CurrentQuestionData[0].choices) {
        if (!self.CurrentQuestionData[0].choices[index].isChecked) {
          for (let i = 0; i < self.CurrentQuestionData[0].choices.length; i++) {
            self.CurrentQuestionData[0].choices[i].isChecked = i == index ? true : false;
          }
        }
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
  //Change Question on click popup
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
      // this.calcluteCount();
    }
  }
  // Filter Next Question
  NextQuestion() {

    this.indexToFilter++;
    this.filterQuestion(this.indexToFilter);
    // this.calcluteCount();
  }
  //Filter Question by index 
  filterQuestion(IndexValue) {

    this.CurrentQuestionData = this.questionDetails.filter((question, index) => index === IndexValue);
    console.log(this.CurrentQuestionData)
  }



  viewresult() {
    this.dialog.closeAll();
    this._ngZone.run(() => {
      this.router.navigate(['/student/game-analytics', this.ExamId]);
    });
  }
  // TO START EXAM
  btnToStartExm() {
    this.startExamTime = false;
    this.isExamStart = true;
  }
  //calclute  outer time duration 
  startTimer(examData: any) {
    // var self = this;
    if (!this.timerRunning) {
      var now = new Date(); // Get the current time
      // var now = null; // Get the current time
      // var minutesToAdd = 17; // Add 10 minutes   
      // now.setMinutes(now.getMinutes() + minutesToAdd)
      // now.setMinutes(now.getMinutes() + 10, now.getSeconds() + 17);
      var startTime = new Date(examData.startTime);
      // var startTime = null;
      var endTime = new Date(examData.endTime);

      // IF USER COMES ON TIME CURRENT TIME == START TIME

      if (now.getTime() === startTime.getTime() && !examData.isExamManually) {
        console.log(now, "now", startTime, "startTime")

        this.timeDifferenceInMilliseconds = startTime.getTime() - now.getTime();
        console.log(this.timeDifferenceInMilliseconds, "startTime.getTime() - now.getTime()")

        // Display the countdown for exam start time
        this.time = Math.floor(this.timeDifferenceInMilliseconds / 1000);
        console.log(this.time, "this.time")

        this.timerInterval = setInterval(() => {
          if (this.time > 0) {
            this.time--;
            this.updateDigitalClock();
          }
          else {
            clearInterval(this.timerInterval);
            this.timerRunning = false;
            this.startExamTime = false;
            this.isExamStart = true;
            this.startExamTimer(examData);  // Start the exam timer
          }
        }, 1000);

      }



      // this funbction will be call when exam has to be start

      if (now < startTime && !examData.isExamManully) {
        // Calculate the time difference in milliseconds
        this.timeDifferenceInMilliseconds = startTime.getTime() - now.getTime();
        console.log(this.timeDifferenceInMilliseconds, "startTime.getTime() - now.getTime()")

        // Display the countdown for exam start time
        this.time = Math.floor(this.timeDifferenceInMilliseconds / 1000);
        console.log(this.time, "this.time")
        // this.updateDigitalClock();  Update the digital clock display with the initial time

        this.timerInterval = setInterval(() => {
          if (this.time > 0) {
            this.time--;
            this.updateDigitalClock();
          }
          else {
            clearInterval(this.timerInterval);
            this.timerRunning = false;
            // this.timerDisabled = false;  Enable the button when the timer reaches zero
            // Display a message
            alert("Exam has started!");
            // this.startExamButton = true;
            this.startExamTime = false;
            this.isExamStart = true;
            this.startExamTimer(examData);  // Start the exam timer
          }
        }, 1000);
      }

      // this code will come when starttime is less then current time

      if (now > startTime && !examData.isExamManully) {
        this.timeDifferenceInMilliseconds = endTime.getTime() - now.getTime();
        console.log(this.timeDifferenceInMilliseconds, "startTime.getTime() - now.getTime()")

        // Display the countdown for exam start time
        this.time = Math.floor(this.timeDifferenceInMilliseconds / 1000);
        // this.time = this.timeDifferenceInMilliseconds;
        console.log(this.time, "this.time")
        // this.updateDigitalClock();  Update the digital clock display with the initial time

        this.timerInterval = setInterval(() => {
          if (this.time > 0) {
            this.time--;
            this.startExamButton = true;
            this.updateDigitalClock();
          }
          else {
            clearInterval(this.timerInterval);
            this.timerRunning = false;
            this.startExamButton = true;
            this.startExamTime = true;

            this.startExamTimer(examData);  // Start the exam timer
            console.log(this.startExamTimer, "less tehn ")
          }
        }, 1000);

      }

      // Default case: Exam has no start time specified, set default exam duration to 2 hours (120 minutes)

      else if (startTime === null || examData.isExamManully) {

        this.time = 2 * 60; // 2 hours in minutes
        this.startExamButton = true;
        this.isexammanullyStart = true;
        this.startExamTime = true;
        this.isExamStart = false;
        this.startExamTimer(examData); // Start the exam timer
      }


      this.timerRunning = false;
    }
  }

  //calclute  outer time duration ends


  // calculate inner time
  startExamTimer(examData) {

    // var now = new Date(); // Get the current time
    var startTime = new Date(examData.startTime);
    var endTime = new Date(examData.endTime);
    var innerExamTime = endTime.getTime() - startTime.getTime();

    console.log(innerExamTime, "innerTime")

    this.time = Math.floor(innerExamTime / 1000);
    this.updateDigitalClock();

    this.timerInterval = setInterval(() => {


      if (this.time > 0) {
        this.time--;
        this.updateDigitalClock();
      } else {
        clearInterval(this.timerInterval);
        this.timerRunning = false;
        this.timerDisabled = false;
        alert("Exam time is up!");
        this.router.navigate(['']); // Perform navigation action
      }
    }, 1000);

    this.timerRunning = true;
  }
  // calculate inner time ends

  updateDigitalClock() {
    const hours = Math.floor(this.time / 3600); // Calculate hours
    const minutes = Math.floor((this.time % 3600) / 60); // Calculate minutes
    const seconds = this.time % 60; // Calculate seconds

    // Format the time components to have leading zeros if necessary
    var formattedHours = String(hours).padStart(2, '0');
    var formattedMinutes = String(minutes).padStart(2, '0');
    var formattedSeconds = String(seconds).padStart(2, '0');

    // Update the digital clock display
    this.digitalClockDisplay = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}



