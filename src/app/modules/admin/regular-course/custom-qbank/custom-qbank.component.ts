
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, ThemePalette } from '@angular/material/core';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { CustomQBankService } from './custom-qbank.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomQbankMcq } from './custom-qbank.model';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
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
import { RouterModule } from '@angular/router';
export interface Task {
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

//  for accordian
interface IPanel {
  opened: boolean;
  allComplete: boolean;
  subtasks: { name: string; completed: boolean; color: string }[];
  title: string;
}
// ends
@Component({
  selector: 'app-custom-qbank',
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
  RouterModule],
  templateUrl: './custom-qbank.component.html',
  styleUrls: ['./custom-qbank.component.scss']
})
export class CustomQbankComponent implements OnInit, OnDestroy {
  @ViewChild('selectAllCheckbox') selectAllCheckbox: MatCheckbox; // for checkbox
  @ViewChild('myDialog') myElementRef!: ElementRef;


  customeMcqExamStep1FormGroup: FormGroup; //harsh
  customeMcqExamStep2FormGroup: FormGroup //harsh
  customeMcqEnterMcqNameStep3FormGroup: FormGroup // harsh

  IscustomeMcqExamStep1FormGroupError: boolean = false; //harsh
  IscustomeMcqSelectChapterStep2FormGroupError: boolean = false //harsh
  IscustomeMcqEnterMcqNameStep3FormGroupError: boolean = false //harsh
  islinear = true; //harsh
  isCustomTimerEnable = true; //harsh
  isCustomDatePickerEnable: boolean = false; //harsh

  checked: boolean = false; //harsh
  checks = false; //harsh
  check = false; //harsh

  isFormValid: boolean = false; //harsh
  isMcqCreated: boolean = false;
  isCheckboxChecked: boolean = true; //harsh
  selectedCategories: any = []; // Array to store selected categories
  selectedTags: any = []; // Array to store selected Tags
  selectedChapters: any = [];  //array to store selected
  isCustomizetimeSelected: boolean = false;
  chapterHeadings: any = ["Anotomy (03 Chapters)"]
  chapters: any = ["01 General Embryology (12 Quest)", "02 Histology Body Tubes", "03 Neuroanatomy"]
  tags: any ;
  categories: any = [{
    "Title":"Correct",
    "Id": 0
  },
  {
    "Title":"InCorrect",
    "Id": 1
  },
  {
    "Title":"Missed",
    "Id": 2
  }]
  McqDetails: CustomQbankMcq;
  selectedSubtasks: any = [];
  panels: any;
  levelofQuestions: any;
  examDetails: any;
  examid: string;
  selectedSubject: any =[];
  value:string;
  timeForm: FormGroup;
  hours: number[] = Array.from({length: 24}, (_, i) => i);          // 0-23
  minutes: number[] = Array.from({length: 60}, (_, i) => i);        // 0-59
  seconds: number[] = Array.from({length: 60}, (_, i) => i);        // 0-59
  showError: boolean = false;
  customTime:number=0;

  constructor(
    private _qbankService :CustomQBankService,
    private snackBar: MatSnackBar,
    private cdr : ChangeDetectorRef,
    private _formBuilder: FormBuilder, private dialog: MatDialog
  ) {
    this._qbankService.getCustomQbankSubject().subscribe(res=>{
      this.panels = res;
    })
    this._qbankService.getTags('Custom QBank').subscribe(res=>{
      this.tags = res;
    })
    this._qbankService.getLevelofQuestion().subscribe(res=>{
      this.levelofQuestions = res;
    })
    
  }
  openSnackBar(message){
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'bottom'
    });
  }

  // end



  ngOnInit(): void {
    this.timeForm = this._formBuilder.group({
      hours: [0],
      minutes: [0]
    });
    this.timeForm.valueChanges.subscribe(value => {
      const totalSeconds = this.convertToSeconds(value.hours, value.minutes);
      this.customTime = totalSeconds 
    });
    
    this.customeMcqExamStep1FormGroup = this._formBuilder.group({
      // customizeMcq: [''],
      competencyLevel: ['0', Validators.required],
      recommendedTimings: ['0', Validators.required],
      numberOfQuestions: [40, Validators.required],
      mcqCategory: ['0'],
      ModeofExam: ['0', Validators.required],
      customizeTimings: ['']


    })
    this.customeMcqExamStep2FormGroup = this._formBuilder.group({
      selectChapters: ['', Validators.required]

    })
    this.customeMcqEnterMcqNameStep3FormGroup = this._formBuilder.group({
      mcqName: ['', Validators.required],
      datePicker: [''],
      multiSelect: ['',],
      multiTags: ['', Validators.required]
    })
  }
  
  private convertToSeconds(hours: number, minutes: number): number {
    return (hours * 3600) + (minutes * 60);
  }



  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {   //screen 49
    this.dialog.open(templateRef, {
      height: '306px',
      width: '342px',
    });
  }
  ClosePopup() {
    this.dialog.closeAll();
  }
  DeleteCQBank(id){
    this._qbankService.DeleteCQBank(id).subscribe(res=>{
      this.ClosePopup();  
      this.CreateMcq();
    }

    )
  }

  // To enable disable timer by harsh with validtion 
  timingSettingEvent(event) {
    // console.log(event);
    if (event.value == "Customize") {
      // this.customeMcqExamStep1FormGroup.get('customizeTimings').setValidators(Validators.required);
      this.timeForm.get('hours').setValidators(Validators.required);
      this.timeForm.get('minutes').setValidators(Validators.required);
      this.timeForm.get('hours').updateValueAndValidity();
      this.timeForm.get('minutes').updateValueAndValidity();
      // this.customeMcqExamStep1FormGroup.get('customizeTimings').updateValueAndValidity();
      this.isCustomizetimeSelected = true;
      this.isCustomTimerEnable = false;

    } else {
      // this.customeMcqExamStep1FormGroup.get('customizeTimings').setValue('');
      this.timeForm.get('hours').setValue(0);
      this.timeForm.get('minutes').setValue(0);
      
      this.timeForm.get('minutes').clearValidators();
      this.timeForm.get('hours').clearValidators();
      // this.customeMcqExamStep1FormGroup.get('customizeTimings').clearValidators();
      
      this.timeForm.get('minutes').updateValueAndValidity();
      this.timeForm.get('hours').updateValueAndValidity();
      // this.customeMcqExamStep1FormGroup.get('customizeTimings').updateValueAndValidity();

      this.isCustomizetimeSelected = false;
      this.isCustomTimerEnable = true;

    }
  }

  //Ends

  // to enable disable date picker
  // datePickerChangeEvent(event) {

  //   // this.isCustomDatePickerEnable = event.checked;
  //   if (event.value = "setPlanner") {
  //     this.customeMcqEnterMcqNameStep3FormGroup.get('datePicker').setValidators(Validators.required);
  //     this.customeMcqEnterMcqNameStep3FormGroup.get('datePicker').updateValueAndValidity();
  //     this.isCustomDatePickerEnable = event.checked;
  //   }
  //   else {
  //     this.customeMcqEnterMcqNameStep3FormGroup.get('datePicker').clearValidators();
  //     this.customeMcqEnterMcqNameStep3FormGroup.get('datePicker').updateValueAndValidity();

  //   }
  // }


  // to enable disable date picker
  datePickerChangeEvent(event) {
    let datePickerControl = this.customeMcqEnterMcqNameStep3FormGroup.get('datePicker');

    if (event.checked) {
      datePickerControl.setValidators(Validators.required);
      this.isCustomDatePickerEnable = true;
    } else {
      datePickerControl.clearValidators();
      this.isCustomDatePickerEnable = false;
    }

    datePickerControl.updateValueAndValidity();
  }


  //button
  onSelectCategory(value: any) {

    // console.log(value, "event");

    let index = this.selectedCategories.indexOf(value);
    if (index !== -1) {
      // Remove the category from the array
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(value);
    }

    // console.log(this.selectedCategories, "selectedCategories");
  }

  // chapters
  getSelectedSubjectChapters(panel:any) {
    
      let count = 0;
      panel?.topics?.forEach((dto) => {
        // Check if the dto exists in this.selectedChapters
        if (this.selectedChapters?.includes(dto)) {
          count++;
        }
      });      
      return count;
  }
  
  onChaptersChecks(data: any, IsSelectAll: boolean, subject: any) {

    if (IsSelectAll) {
      if (data.checked) {
        // this.selectedChapters = [...subject.topics];
        subject.topics.forEach((topic) => {
            this.selectedChapters.push(topic);
        });
        
        
      } else {
        // this.selectedChapters = [];
        this.selectedChapters = this.selectedChapters.filter(
          (chapter) => chapter.subjectId !== subject.subjectId
        );
        this.customeMcqExamStep2FormGroup.controls['selectChapters'].patchValue(this.selectedChapters);
        this.customeMcqExamStep2FormGroup.controls['selectChapters'].updateValueAndValidity;   
        this.cdr.detectChanges();                                         
        
        
      }
    } else {
      const index = this.selectedChapters.indexOf(data);
      if (index !== -1) {
        this.selectedChapters.splice(index, 1);
      } else {
        this.selectedChapters.push(data);
      }
    }
    
  }
  // Modify the existing function to show errors if necessary
  goToCustomeMcqExamStep1FormGroup() {
    if (this.customeMcqExamStep1FormGroup.invalid) {
      this.IscustomeMcqExamStep1FormGroupError = true;
    }
    
    // console.log(this.customeMcqExamStep1FormGroup.value)
  }
  goTocustomeMcqSelectChapterStep2FormGroup() {

    if (this.customeMcqExamStep2FormGroup.invalid) {
      this.IscustomeMcqSelectChapterStep2FormGroupError = true;
    }

    // console.log(this.customeMcqExamStep2FormGroup.value)
  }

  // goTocustomeMcqEnterMcqNameStep3FormGroup() {
  //   // this.isMcqCreated = true;
  //   console.log(this.customeMcqEnterMcqNameStep3FormGroup.value)
  //   // debugger
  //   if (!this.customeMcqEnterMcqNameStep3FormGroup.invalid) {
  //     this.IscustomeMcqEnterMcqNameStep3FormGroupError = true;
  //     this.isMcqCreated = true;
  //   }
  //   console.log(this.customeMcqExamStep1FormGroup.value, this.customeMcqExamStep2FormGroup.value, this.customeMcqEnterMcqNameStep3FormGroup.value)
  // }
  CreateMcq() {
    this.isMcqCreated = false;
    // to reset forms when click on custom q banks
    this.selectedChapters = [];
    this.selectedTags = [];
    this.customeMcqExamStep1FormGroup.reset();
    this.customeMcqExamStep2FormGroup.reset();
    this.customeMcqEnterMcqNameStep3FormGroup.reset();
  }
  ontagSelection(data: any, isSelectAll: boolean) {
    if (isSelectAll) {
      if (data.checked) {
        this.selectedTags = [...this.tags];
      } else {
        this.selectedTags = [];
      }
      // console.log(this.selectedTags, "checked all")
    } else {
      const index = this.selectedTags.indexOf(data);
      if (index !== -1) {
        this.selectedTags.splice(index, 1);
      } else {
        this.selectedTags.push(data);
      }
      // console.log(this.selectedTags)
    }
  }


  //ends
  onSubmit() {
    
    // console.log(this.customeMcqEnterMcqNameStep3FormGroup.value)
    if (this.customeMcqEnterMcqNameStep3FormGroup.invalid || this.selectedTags.length <= 0) {
      this.IscustomeMcqEnterMcqNameStep3FormGroupError = true;


    }

    else {
      this.selectedChapters?.forEach(chapter => {
          if(!this.selectedSubject?.includes(chapter.subjectId)){
            this.selectedSubject?.push(chapter.subjectId);
          }
      });  

      var request: CustomQbankMcq = {
        mcqCode: "",

        noOfQuestions: this.customeMcqExamStep1FormGroup.get('numberOfQuestions').value,
        levelId: this.customeMcqExamStep1FormGroup.get('competencyLevel').value,
        mcqCategory: this.selectedCategories?.map(category => category.Id),
        
        // customizeTime: this.customeMcqExamStep1FormGroup.get('customizeTimings').value,
        examMode:  parseInt(this.customeMcqExamStep1FormGroup.get('ModeofExam').value),
        topics: this.selectedChapters?.map(chapter => chapter.topicID),
        subjects: this.selectedSubject,
        name: this.customeMcqEnterMcqNameStep3FormGroup.get('mcqName').value,
        tags: this.selectedTags?.map(tag => tag.tagID),
        // plannerDate: this.customeMcqEnterMcqNameStep3FormGroup.get('datePicker').value
      }
      if (this.customeMcqExamStep1FormGroup.get('competencyLevel').value !== 'All') {
        request.levelId = parseInt(this.customeMcqExamStep1FormGroup.get('competencyLevel').value);
      }
      if(!this.isCustomTimerEnable){
        // const timeValue = this.customeMcqExamStep1FormGroup.get('customizeTimings').value;
        // const [hours, minutes] = timeValue.split(':').map(Number);
        // const totalMinutes = hours * 60 + minutes;
        // request.examDuration = parseInt(totalMinutes);
        request.examDuration = this.customTime;
      }else{
        request.examDuration = parseInt(this.customeMcqExamStep1FormGroup.get('recommendedTimings').value);
      }
      this._qbankService.createExam(request).then(res=>{
        if(res.success){
          this.openSnackBar(res.responseMessage);
          this.isMcqCreated = true;
          this.examid = res.cmcqExamId;
          this._qbankService.getCustomQBankDetails(res.cmcqExamId).subscribe(res=>{
            this.examDetails = res;
            this.value = `https://mentorplus.mbbs.guru/CustomQbank/${res.guid}`
          })
        }
        else{
          this.openSnackBar(res.responseMessage);
        }
      },
      (error) => {
        this.openSnackBar(error.error.exception);
      })
    }
    this.McqDetails = request;
    console.log(this.McqDetails, "request")
  }

  ngOnDestroy(): void {

  }

  // accordian
  // panels: IPanel[] = [
  //   {
  //     opened: false,
  //     allComplete: false,
  //     title: 'Anotomy (03 Chapters)',

  //     subtasks: [
  //       { name: '01 General Embryology (12 Quest)', completed: false, color: 'primary' },
  //       { name: '02 Histology Body Tubes', completed: false, color: 'primary' },
  //       { name: '03 Neuroanatomy', completed: false, color: 'primary' },
  //     ],
  //   },
  // ];





  // ends

}

