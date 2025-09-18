import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { TaskService } from '../task.service';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-student-report',
  imports: [CommonModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './task-student-report.component.html',
  styleUrl: './task-student-report.component.scss'
})
export class TaskStudentReportComponent implements OnInit{
  data: any[] = [];
  taskGuid: any;
  menteeGuid: any;
  reportDetails:any;
  uniqueModules: any;
  constructor(
    private _taskService : TaskService,
    private _route: ActivatedRoute
  ){
    this._route.params.subscribe(res=>{
      this.taskGuid = res?.taskId;
      this.menteeGuid = res?.menteeId;
    })
  }
  ngOnInit(): void {
    this._taskService.getReport(this.taskGuid, this.menteeGuid).then((res:any)=>{
      this.data = res?.taskResourceDetails;
      this.reportDetails = res;
      const moduleMap = {
        0: 'Video',
        1: 'Test',
        2: 'Qbank'
      };
      this.uniqueModules = Array.from(
        new Set(res.taskResourceDetails.map(item => moduleMap[item.type]))
      );
    })
  }
  get qbankItems() {
    return this.data.filter(item => item.type === 2);
  }
  get testItems() {
    return this.data.filter(item => item.type === 1);
  }
  get videoItems() {
    return this.data.filter(item => item.type === 0);
  }
  getTotalSeconds(duration: string): number {
    const parts = duration.split(':').map(part => parseInt(part, 10));
    if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return minutes * 60 + seconds;
    }
    return 0; // fallback
  }

  getVideoProgress(attempted: number, total: string): number {
    const totalSeconds = this.getTotalSeconds(total);
    if (totalSeconds === 0) return 0;
    return Math.min((attempted / totalSeconds) * 100, 100);  // Cap at 100%
  }

  
}
