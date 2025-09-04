
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { takeUntil, catchError, finalize } from 'rxjs/operators';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { SitePreference } from 'app/core/auth/app.config';
import { CourseService } from '../course.service';
import { User } from 'app/core/user/user.types';
import { CourseUserPermission } from '../course.model';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-course-mentee-list',
  imports: [NgxSpinnerModule,MatSortModule,MatButtonModule, MatChipsModule, MatAutocompleteModule, MatPaginatorModule, MatTableModule, MatFormFieldModule, MatSlideToggleModule, MatInputModule, FormsModule, ReactiveFormsModule, MatIconModule, MatTabsModule,MatSelectModule, MatDatepickerModule, CommonModule],
  templateUrl: './course-mentee-list.component.html',
  styleUrl: './course-mentee-list.component.scss'
})
export class CourseMenteeListComponent implements OnInit, OnDestroy {
  // @ViewChild('addUsersPopup') addUsersPopup: TemplateRef<any>;
  @ViewChild('dialogContent', { static: true })
  dialogContent: TemplateRef<any>;
  _sitePreference: any = SitePreference;
  confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;

  user: any;
  dialogRef: any;
  courseId:any;
//   @Input() courseId: string = '';
  @Input() course: any;

  paginationData: any;

  dataSource: CourseUserPermissionDataSource;
  displayedColumns = ['UserName', 'Email', 'Mobile'];
  // toggledIds: any[] = [];
  // selectedUser: any = [];
  // onSaveDisabled: boolean = true;
  // toggle: any = [];


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {UserService} _userService
   * @param {MatDialog} _matDialog
   */
  constructor(
      private _userService: AuthService,
      private _courseUserPermissionService: CourseService,
      public _matDialog: MatDialog,
      private route: ActivatedRoute,
      private _router: Router,
      // private _exportExcelService: ExcelExportService
  ) {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      this.userSearch = new FormControl('');
      this.route.params.subscribe(res=>{
        this.courseId = res?.courseId;
      })
  }

  ngAfterViewInit() {

  }

  loadPage() {
      this._courseUserPermissionService.onCourseUserPermissionChanged.next(this.user);
  }


  getNext(event: PageEvent) {
      this._courseUserPermissionService.onCourseUserPermissionChanged.next(this.user);

  }


  onSortData(sort: Sort) {

      this._courseUserPermissionService.onCourseUserPermissionChanged.next(this.user);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
      // this.toggle = [
      //     {
      //         id: 1, Name: 'Video Qbank',
      //     },
      //     {
      //         id: 2, Name: 'Qbank',
      //     },
      //     {
      //         id: 3, Name: 'Test',
      //     },
      //     {
      //         id: 4, Name: 'Videos',
      //     },
      //     {
      //         id: 5, Name: 'Flash Card',
      //     },
      //     {
      //         id: 6, Name: 'Live Quiz',
      //     },
      // ];
      this.dataSource = new CourseUserPermissionDataSource(this._courseUserPermissionService, this.courseId);

      this._courseUserPermissionService.onCourseUserPermissionChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(search => {
              this.user = search;
              let gridFilter: any = {
                  pageNumber: this.paginator.pageIndex + 1,
                  pageSize: this.paginator.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.paginator.pageSize,
                  rolename: 'Mentee',
                  courseId: this.courseId,
                  //   keyword: typeof search === "string" ? search : "",
                //   orderBy: this.sort.active == undefined ? "CourseUserPermission" : this.sort.active,
                //   sortOrder: this.sort.direction == 'asc' ? this.sort.direction : 'desc'
              };
              this.dataSource.loadData(gridFilter);
          });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(true);
      this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Delete CourseUserPermission
   */
  deleteCourseUserPermission(user): void {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'delete-choice',
      });

      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

      this.confirmDialogRef.afterClosed().subscribe(result => {
          if (result) {

              let userPermissionHistory = {
                  // ModeID: 2,
                  // ProductAccessType: 1,
                  // ProductID: this.courseId,
                  // UserInfo: user
                  userId: user.id,
                  courseId: Number(this.courseId),
                  modeID: 0,
                  onStart: 0,
                  businessTypeID: 0,
                  paymentHistoryID: 0,
                  createdBy: ""
              };

              this._courseUserPermissionService.deleteCourseUserPermission(userPermissionHistory);
          }
          this.confirmDialogRef = null;
      });

  }

  users: Array<User>;
  userSelectedValue: any;
  userSearch: FormControl;
  // onSelectedUser(user: any) {
  //     this.userSelectedValue = user;
  // }
  selectedUser(user: any) {
      this.userSelectedValue = user;
  }
  userDisplayFn(user: any): string {
      return user ? `${user.email}` : '';
  }

  getUserBySearch() {
      var self = this;
      if (this.userSearch.value != null && this.userSearch.value.length > 1)
          this._courseUserPermissionService.getUserBySearch(this.userSearch.value).then(function (response: any) {
              self.users = response;
          });
  }

  addUser() {
      // this.dialogRef = this._matDialog.open(UserPlanAssignComponent, {
      //     panelClass: 'asset-form-dialog',
      //     data: {
      //         action: 'new',
      //         courseId:this.courseId
      //     }
      // });
      let user = this.userSelectedValue;
      let userPermissionHistory = {
          // ModeID: 1,
          // ProductAccessType: 1,
          // ProductID: this.courseId,
          // UserInfo: user
          userId: user.id,
          courseId: Number(this.courseId),
          modeID: 1,
          onStart: 0,
          businessTypeID: 0,
          paymentHistoryID: 0,
          createdBy: ""
      };

      this._courseUserPermissionService.createCourseUserPermission(userPermissionHistory)
          .then(function () {
              this.userSelectedValue = '';
              this.userSearch.reset();

          })
  }
  removeUser(user) {

      let userPermissionHistory = {
          Mode: 2,
          ProductAccessType: 1,
          ProductID: this.courseId,
          UserInfo: user
      };

      this._courseUserPermissionService.createCourseUserPermission(userPermissionHistory)
          .then(function () {
              this.userSelectedValue = '';
              this.userSearch.reset();

          })
  }

  // GetDownloadReport() {
  //     var self = this;

  //     let gridFilter: any = {
  //         pageNumber: 1,
  //         pageSize: 7000000,
  //         keyword: "",
  //         orderBy: "UserName",
  //         sortOrder: 'asc'
  //     };

  //     this._courseUserPermissionService.getCourseUserPermissionForGrid(gridFilter, this.courseId).subscribe(response => {

  //         let data = [];

  //         response.data.forEach(element => {
  //             let user = {
  //                 CourseName: self.course.Title,
  //                 UserName: element.UserName,
  //                 Email: element.Email,
  //                 Mobile: element.Mobile,
  //                 College: element.College,
  //                 State: element.state,
  //                 CategoryOfStudy: element.CategoryOfStudy,
  //                 RegisteredOn: new Date(element.CreatedOn * 1000),
  //             };
  //             data.push(user);
  //         });

  //         self._exportExcelService.exportAsExcelFile(data, self.course.Title + "-user-list-");

  //     });

  // }
}

export class CourseUserPermissionDataSource extends DataSource<CourseUserPermission> {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  public data: MatTableDataSource<CourseUserPermission>;
  /**
   * Constructor
   *
   * @param {CourseUserPermissionService} _userService
   */
  constructor(
      private _userService: CourseService,
      private courseId: string
  ) {
      super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
      return this._userService.onCourseUserPermissionChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {
  }

  loadData(gridFilter: any) {
      var self = this;

      this._userService.getCourseUserPermissionForGrid(gridFilter, this.courseId)
          .pipe(
              catchError(() => of([])),
              finalize(() => {
                  this.loadingSubject.next(false)
              })
          )
          .subscribe(response => {
              this.data = new MatTableDataSource(response.data);

              self.paginationData = {
                  // count: response.Count,
                  // pageNumber: response.CurrentFilter.PageNumber
                  count: response.totalCount || 0, // Total number of items
                  pageNumber: response.currentPage || 1, // Current page
                  pageSize: response.pageSize || 10  // Items per page
              };


          });
  }
}