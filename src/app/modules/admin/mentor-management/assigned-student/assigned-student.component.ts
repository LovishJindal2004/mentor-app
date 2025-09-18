import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { helperService } from 'app/core/auth/helper';
import { StudentService } from '../../student-management/student.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AssignStudentComponent } from '../assign-student/assign-student.component';

@Component({
  selector: 'app-assigned-student',
  imports: [MatTableModule, MatIconModule, MatPaginatorModule, MatButtonModule, RouterModule],
  templateUrl: './assigned-student.component.html',
  styleUrl: './assigned-student.component.scss'
})
export class AssignedStudentComponent implements OnInit, OnDestroy {
  studentList: any[] = [];
  displayedColumns: string[] = ['UserName', 'Email', 'PhoneNumber', 'Action'];
  dataSource = new MatTableDataSource<any>([]);
  private _unsubscribeAll = new Subject<void>();
  confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dialogRef: any;
  userID: any;
  mentorDetails: any;
  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20];

  constructor(
    private _studentsService: StudentService,
    private _helperService: helperService,
    private _matDialog: MatDialog,
    private _route: ActivatedRoute,
  ) {
    this._route.params.subscribe(res=>{
      this.userID = res?.userId;
      this._studentsService.getUserDetailsbyId(this.userID).then(res=>{
        this.mentorDetails = res;
      })
    })
  }
  ngAfterViewInit(): void {
    // Set up paginator event listener
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex + 1; // MatPaginator is 0-based, API is 1-based
        this.loadStudents();
      });
    }
  }
  
  ngOnInit(): void {
    this._studentsService.onStudentManagementChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
          this.loadStudents()
      });
  }
  loadStudents(){
    const req = {
      keyword: '',
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      orderBy: '',
      sortOrder: ''
    };
    this._studentsService.getAssignedStudentList(req,this.userID).then((res: any) => {
      this.studentList = res?.data || [];
      
      this.totalCount = res?.totalCount || 0;
      this.currentPage = res?.currentPage || 1;
      this.dataSource = new MatTableDataSource(this.studentList);
      // this.dataSource.paginator = this.paginator; // ✅ attach paginator
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  assignStudent(){
    this.dialogRef = this._matDialog.open(AssignStudentComponent, {
      panelClass: 'assign-student-dialog',
      data: {list:this.studentList,mentorId:this.userID}
  });
  }
  unassignStudent(menteeId){
    this._studentsService.unassignedStudent(this.userID, menteeId).then(res=>{
      this._studentsService.onStudentManagementChanged.next('');
    })
  }
}