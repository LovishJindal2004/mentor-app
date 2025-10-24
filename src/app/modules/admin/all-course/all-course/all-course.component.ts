import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { helperService } from 'app/core/auth/helper';
import { CommanService } from 'app/modules/common/services/common.service';
import { CousreService } from 'app/modules/common/services/course.service';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { ApiErrorHandlerService } from 'app/modules/common/services/api-error-handling.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-course',
  imports: [CommonModule],
  templateUrl: './all-course.component.html',
  styleUrl: './all-course.component.scss'
})
export class AllCourseComponent implements OnInit {
  selectedTabIndex: any = 0;
  CourseDetails: any = [];
  dataLoaded: boolean = true;
  selectedCourse: any=[];
  courses: any;
  // PageSize = 15;
  // PageNumber = 1;
  // HasNexPage: boolean = true;
  // Subjects: any = [];
  courseId: any;
  userRole: any;
  userId:any
  constructor(
    private router: Router, 
    private activateRoute: ActivatedRoute, 
    private _CommanService: CommanService, 
    private courseService: CousreService, 
    private errorhandling: ApiErrorHandlerService,  
    private _datagurd: DataGuardService,
    private _helperService: helperService,) {

    if (this.router.url.includes("hippo")) {
      this.selectedTabIndex = 1;
    }
    if (this.router.url.includes("NExT-PG")) {
      this.selectedTabIndex = 2;
    }
    if (this.router.url.includes("toppers")) {
      this.selectedTabIndex = 3;
    }
  }
  ngOnInit(): void {
    this.userRole = this._helperService.getUserDetail().Roles;
    this.userId = this._helperService.getUserDetail().Id;
    this.activateRoute.params.subscribe(res => {
      if (res) {
        this.courseId = res['CourseId'];
        this.LoadMore(this.courseId);
        this.courseService.setUserCourseId(this.courseId);
        this._datagurd.setCourseId('Courseid', this.courseId);
      }

    })
  }
  sanitizeDescription(course: any): string {
    if (course && course.description) {
      return this.removeHtmlTags(course.description);
    }
    return '';
  }
  removeHtmlTags(input: string): string {
    const div = document.createElement('div');
    div.innerHTML = input;
    return div.textContent || div.innerText || '';
  }
  LoadMore(CourseId) {
    this._CommanService.getActiveCoursesByUserId(this.userId).subscribe((res: any) => {
      if (res) {
        this.CourseDetails = res;
        // console.log(this.CourseDetails)
      }       
      this.dataLoaded = false;
    }, (error) => {
      this.dataLoaded = false;
      this.errorhandling.handleError(error);
    }
    );
  }
  formatTime(hours: number): string {
    const wholeHours = Math.floor(hours);
    const remainingMinutes = Math.round((hours % 1) * 60);
    return `${wholeHours} : ${remainingMinutes} hrs`;
  }

  storecourselocal(id){
    this._datagurd.setCourseId('Courseid', id);
    this.router.navigate(['/dashboard'])
  }

}
