
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


// import { FuseScrollbarDirective } from '@fuse/directives/scrollbar'; 
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { CourseService } from '../course.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTabChangeEvent, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { DomSanitizer } from '@angular/platform-browser';
import { MatFormField, MatSelect, MatSelectModule } from '@angular/material/select';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { User } from 'app/core/user/user.types';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { Course } from 'app/modules/common/models/Common.model';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CourseMenteeListComponent } from '../course-mentee-list/course-mentee-list.component';
import { CourseMentorListComponent } from '../course-mentor-list/course-mentor-list.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-course-form',
  imports: [NgxSpinnerModule, MatButtonModule, CourseMentorListComponent, CourseMenteeListComponent, MatChipsModule, MatFormFieldModule, MatSlideToggleModule, MatInputModule, FormsModule, ReactiveFormsModule, MatIconModule, MatTabsModule,MatSelectModule, MatDatepickerModule, CommonModule],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss'
})
export class CourseFormComponent implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  ispdfDownload: boolean = false;
  action: string;
  course: any;
  courseForm: FormGroup;
  dialogTitle: string;
  CourseID: number;
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;
  data: any[];
  matSelect: MatSelect;
  dataSourceLocal: any;
  private shouldCloseMatSelect = false;
  // data: any[] = [
  //     { ExamName: 'Exam 1' },
  //     { ExamName: 'Exam 1' },
  //     { ExamName: 'Exam 1' },

  // ];
  displayedColumns: string[] = ['Title', 'NoOfQuestion', 'Description', 'buttons'];
  dataSource: any;

  hippos: Array<any>;
  notes: Array<any>;
  videos: Array<any>;
  LiveSessions: Array<any>;
  todos: Array<any>;
  testexamtype: number = 0;
  exams: Array<any>;
  examSelectedValue: string;

  examSearch: FormControl;
  ckeConfig: any;
  ExamCollections: any;

  IsHippoFree: boolean = false;
  IsVideoFree: boolean = false;
  IsQBankFree: boolean = false;
  IsTodoFree: boolean = false;
  title: string = 'list of Courses';
  // Subscription: Subscription;
  // SubscriptionResponse: SubscriptionResponse;
  userModel: User;
  showContent = false;
  TenantData: any = [];
  TenantList: any = [];
  dragDisabled = true;
  CategoryID: number = 0;
  getTenantDetails: any;
  tabLabels: any;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  @ViewChild('table') table: MatTable<any>;
  @ViewChild('GrandMockTest') GrandMockTest: MatTable<any>;
  @ViewChild('SWT') SWT: MatTable<any>;
  @ViewChild('PyQ') PyQ: MatTable<any>;
  @ViewChild('leaderboard') leaderboard: MatTable<any>;
  @ViewChild('ClassWiseleaderboard') ClassWiseleaderboard: MatTable<any>;
  openSnackBar(message: string, action: string) {
      this._matSnockbar.open(message, action, {
          duration: 2000,
      });
  }

  questionsArray: any = [];

  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   */
  constructor(
      private cdr: ChangeDetectorRef,
      private sanitizer: DomSanitizer,
      private _formBuilder: FormBuilder,
      public _matDialog: MatDialog,
      private _courseService: CourseService,
      private _route: ActivatedRoute,
      private _dataGuardService: DataGuardService,
      private _matSnockbar: MatSnackBar,
      private _router: Router) {
      var self = this;
      self.ExamCollections = [];
      // Set the defaults
      this.ckeConfig = {
          allowedContent: false,
          extraPlugins: 'divarea',
          forcePasteAsPlainText: true
      };
      //title

      this.dataSource = this.data;
      this.examSearch = new FormControl('');

      this.action = 'new';
      self.course = new Course({});
      this._route.params.subscribe(function (parram) {
        console.log(parram.courseId,"parram")

          self.CourseID = self._dataGuardService.valueDecryption(parram.courseId);

          if (self.CourseID) {
              self.action = "edit";
              self.dialogTitle = 'Edit Course';
              self._courseService.getCourseById(self.CourseID).subscribe(function (response) {

                  self.course = response;
                  self.TenantList = [];

              });
          }
          else {
              self.dialogTitle = 'New Course';
              self.course = new Course({});
          }
      });
      self.courseForm = self.createCourseForm();
      // User Data if already logged in 
      let user = self._dataGuardService.getCookieData('lms-user');

      if (user) {
          self.userModel = JSON.parse(user);
      }

  }

  ngOnInit(): void {
      // this.testexamtype = 1;
      // if (this.CourseID) {
      //     this.getexamtest(this.testexamtype);
      // }

  }
  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {

      var category = this.tabLabels[tabChangeEvent.index];
      this.CategoryID = category.Id;
      this.testexamtype = category.ExamType;
      // if (tabChangeEvent.index === 0) {

      //     this.getexamtest(this.testexamtype);
      // }
      // if (tabChangeEvent.index === 1) {
      //     this.getexamtest(this.testexamtype);
      // }
      // if (tabChangeEvent.index === 2) {
      //     this.getexamtest(this.testexamtype);
      // }
      // if (tabChangeEvent.index === 3) {
      //     this.getexamtest(this.testexamtype);
      // }
      // if (tabChangeEvent.index === 4) {
      //     this.getexamtest(this.testexamtype);
      // }
      // if (tabChangeEvent.index === 5) {
      //     this.getexamtest(this.testexamtype);
      // }

  }

  drop(event: CdkDragDrop<any[]>): void {
      this.dragDisabled = true;
      const previousIndex = this.dataSource.findIndex((d) => d === event.item.data);
      moveItemInArray(this.dataSource, previousIndex, event.currentIndex);
      this.adjustQueueIds(event.currentIndex, previousIndex);
      this.renderTableRows();
  }

  adjustQueueIds(currentIndex: number, previousIndex: number): void {
      // Determine the starting QueueId based on the item before startIndex (if applicable)
      let startingQueueId = 0; // Default starting QueueId if dropped at the beginning
      if (currentIndex < previousIndex) {
          if (currentIndex >= 0) {
              startingQueueId = this.dataSourceLocal[currentIndex].QueueId;
          }
          // Update QueueId values starting from the startIndex
          var testArray: any = [];
          for (let i = currentIndex; i < this.dataSource.length; i++) {
              const currentItem = this.dataSource[i];
              currentItem.QueueId = startingQueueId;
              startingQueueId++;
              testArray.push(currentItem)
          }
      }
      else {

          if (currentIndex >= 0) {
              startingQueueId = this.dataSourceLocal[currentIndex].QueueId;
          }
          // Update QueueId values starting from the startIndex
          var testArray: any = [];
          for (let i = currentIndex; i >= previousIndex; i--) {

              const currentItem = this.dataSource[i];
              currentItem.QueueId = startingQueueId;
              startingQueueId--;
              testArray.push(currentItem);
          }
      }
      // console.log(testArray)
      this.updateTestQueueID(testArray);
  }

  renderTableRows(): void {
      // Render rows for relevant tables and detect changes
      this.table.renderRows();
      this.cdr.detectChanges();
  }

  updateTestQueueID(testData: any): void {
      var TestList: any = [];
      testData.forEach(res => {
          TestList.push({ TestId: res.TestId, QueueId: res.QueueId })
      })
      var request = {
          Tests: TestList,
          CourseId: Number(this.CourseID),
          Examtype: this.testexamtype,
      }

  }
  /**
   * Create course form
   *
   * @returns {FormGroup}
   */
  createCourseForm(): FormGroup {
      return this._formBuilder.group({
          CourseID: [this.course.CourseID],
          Title: [this.course.Title],
          SubTitle: [this.course.SubTitle],
          Description: [this.course.Description],
          IsActive: [this.course.IsActive],
          Users: [this.course.Users]
      });
  }

  /**
* Toggle sidebar
*
* @param name
*/
  toggleSidebar(name): void {
      // this._unisunSidebarService.getSidebar(name).toggleOpen();
  }

  // filterByAssetType(assets: Array<SubscriptionPlan>, SubscriptionTypeID: number) {
  //     return assets.filter(a => a.SubscriptionTypeID == SubscriptionTypeID);
  // }

  saveOrUpdate(courseFrom: any) {
      if (!courseFrom) {
          return;
      }
      var self = this;

      const actionType: string = courseFrom[0];
      const formData: Course = courseFrom[1];

      switch (actionType) {
          case 'new':

              self._courseService.createCourse(formData).then(function (response) {
                  self._router.navigate(['/product/course/' + self._dataGuardService.valueEncryption(response)]);
              });

              break;
          case 'update':

              this._courseService.updateCourse(formData);

              break;

          case 'delete':

              this._courseService.deleteCourse(formData);

              break;
      }
  }

  







  /**
   * Delete Asset
   */
  deleteAsset(asset): void {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'delete-choice',
      });

      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

      this.confirmDialogRef.afterClosed().subscribe(result => {
          if (result) {
          }
          this.confirmDialogRef = null;
      });

  }

  // Ends
  onMatSelectOpen(event: MatSelect): void {
      this.matSelect = event;
      this.shouldCloseMatSelect = true; // Set the flag to close the MatSelect initially
  }
  ngAfterViewInit(): void {
      // Ensure content is now available after view initialization
  }

  calculateMaxPercentage(choices: any[]): number {
      let maxPercentage = -1; // Initialize with a value lower than any possible percentage

      choices.forEach(choice => {
          if (choice.percentage > maxPercentage) {
              maxPercentage = choice.percentage;
          }
      });

      return maxPercentage;
  }

  //pdf ends

  sanitizeExplanationContent(explanation) {
      // Replace backslashes if needed
      const sanitizedHtml = explanation?.replace(/\\/g, '');

      // Sanitize HTML
      return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
  }
}