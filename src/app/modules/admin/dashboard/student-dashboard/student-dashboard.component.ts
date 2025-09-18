import { Component, OnInit } from '@angular/core';
import { helperService } from 'app/core/auth/helper';
import { DashBoardService } from '../dashboard.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, MatIconModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit {
  userDetails: any;
  currentReport: any;
  mcqReport : any;
  subjectWiseAnalytics:any;

  constructor(
    private _dashboardService: DashBoardService,
    private _helperService: helperService,
  ){
    this.userDetails = this._helperService.getUserDetail();
  }
  ngOnInit(): void {
    this._dashboardService.getStudentReport(this.userDetails?.Id).then(res=>{
      this.currentReport = res
    });
    this._dashboardService.getStudentMCQAnalytics(this.userDetails?.Id).then(res=>{
      this.mcqReport = res
    })    
    this._dashboardService.getSubjectReport(this.userDetails?.Id).then((res:any)=>{
      this.subjectWiseAnalytics = res;
    })
  }
  getPercentageWidth(percentage: number): number {
    const value = (percentage ?? 0) * 100;
    return Math.max(0, value);
  }
}
