import { Component } from '@angular/core';
import { StudentDashboardComponent } from '../student-dashboard/student-dashboard.component';
import { helperService } from 'app/core/auth/helper';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [StudentDashboardComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userDetails: any;
  constructor(
    private _helperService: helperService,
  ){
    this.userDetails = this._helperService.getUserDetail();
  }
}
