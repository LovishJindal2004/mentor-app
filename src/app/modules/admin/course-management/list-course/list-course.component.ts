import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { takeUntil, tap, catchError, finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';


import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';

import { ActivatedRoute, Router } from '@angular/router';
import { SitePreference } from 'app/core/auth/app.config';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { CourseGridFilter, GridFilter } from 'app/modules/common/models/Common.model';
import { CourseService } from '../course.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-list-course',
  imports: [MatPaginatorModule, MatButtonModule, MatTableModule, MatSortModule,  MatCheckboxModule, MatIconModule, MatMenuModule, CommonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './list-course.component.html',
  styleUrl: './list-course.component.scss'
})
export class ListCourseComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent', { static: true })
  dialogContent: TemplateRef<any>;
  _sitePreference: any = SitePreference;
  confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;

  course: any;

  paginationData: any;

  dataSource: CourseDataSource;
  displayedColumns = ['Title', 'SubTitle', 'IsActive', 'buttons'];
  searchControl = new FormControl('');



  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // Private
  private _unsubscribeAll: Subject<any>;
    pageIndex: number;

  /**
   * Constructor
   *
   * @param {CourseService} _courseService
   * @param {MatDialog} _matDialog
   */
  constructor(
      private _courseService: CourseService,
      public _matDialog: MatDialog,

      private _router: Router,
      private _dataGuardService: DataGuardService
  ) {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
  }

  ngAfterViewInit() {

  }

  loadPage() {
      this._courseService.onCourseChanged.next(this.course);
  }


  getNext(event: PageEvent) {
      this._courseService.onCourseChanged.next(this.course);

  }


  onSortData(sort: Sort) {

      this._courseService.onCourseChanged.next(this.course);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

      this.dataSource = new CourseDataSource(this._courseService);

      this._courseService.onCourseChanged
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(search => {
              this.course = search;
              let gridFilter: any = {
                  PageNumber: this.paginator.pageIndex + 1,
                  PageSize: this.paginator.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.paginator.pageSize,
                  keyword: typeof search === "string" ? search : "",
                  orderBy: this.sort.active == undefined ? "Course" : this.sort.active,
                  sortOrder: this.sort.direction == 'asc' ? this.sort.direction : 'desc',
                  TenantId: typeof search?.tenantId === "string" ? search?.tenantId : "",
              };

              this.dataSource.loadData(gridFilter);

          });
          this.searchControl.valueChanges
          .pipe(
            debounceTime(400),          
            distinctUntilChanged(),     
            takeUntil(this._unsubscribeAll)
          )
          .subscribe(value => {
            this._courseService.onCourseChanged.next(value || '')
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
   * Edit course
   *
   * @param course
   */
  editCourse(course): void {
      this._router.navigate(['/course/edit/' + this._dataGuardService.valueEncryption(course.guid)]);
  }
  newCourse(){
    this._router.navigate(['/course/create/']);
  }

  /**
   * Delete Course
   */
  deleteCourse(course): void {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'delete-choice',
      });

      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

      this.confirmDialogRef.afterClosed().subscribe(result => {
          if (result) {
              this._courseService.deleteCourse(course);
          }
          this.confirmDialogRef = null;
      });

  }
  inactiveUser(course){
    course.isActive = false;
    this._courseService.updateCourse(course).then(res=>{
        this._courseService.onCourseChanged.next('');
    })
  }
  activeUser(course){
    course.isActive = true;
    this._courseService.updateCourse(course).then(res=>{
        this._courseService.onCourseChanged.next('');
    })
  }
}

export class CourseDataSource extends DataSource<any> {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingSubject.asObservable();
  public data: MatTableDataSource<any>;
  /**
   * Constructor
   *
   * @param {CourseService} _courseService
   */
  constructor(
      private _courseService: CourseService
  ) {
      super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
      return this._courseService.onCourseChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {
  }

  loadData(gridFilter: GridFilter) {
      var self = this;

      this._courseService.getCourseForGrid(gridFilter)
          .pipe(
              catchError(() => of([])),
              finalize(() => {
                  this.loadingSubject.next(false)
              })
          )
          .subscribe(response => {
              this.data = new MatTableDataSource(response.data);

              self.paginationData = {
                  count: response?.totalCount,
                  pageNumber: response?.currentPage
              };


          });
  }
}