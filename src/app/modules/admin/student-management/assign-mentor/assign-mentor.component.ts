import { Component, Inject, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { MentorService } from '../../mentor-management/mentor.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-assign-mentor',
  imports: [MatSelectModule, CommonModule, MatButtonModule, FormsModule, MatIconModule],
  templateUrl: './assign-mentor.component.html',
  styleUrl: './assign-mentor.component.scss'
})
export class AssignMentorComponent implements OnInit{
  mentors: any;
  selectedMentor: any;
  constructor(
    private _mentorService : MentorService,
    private _matDialog : MatDialog,
    @Inject(MAT_DIALOG_DATA) private _data: any,
  ){
    console.log(this._data,"_data")
  }

  ngOnInit(): void {
    const req = {
      keyword: '',
      pageNumber: 1,
      pageSize: 1000,
      orderBy: '',
      sortOrder: ''
    };
    this._mentorService.getMentorList(req).then((res: any) => {
      this.mentors = res?.data
    });
  }
  saveAssignment(){
    console.log(this.selectedMentor,"selectedMentor")
    this._mentorService.assignedMentortoStudent(this.selectedMentor,this._data).then(res=>{
      if(res){
        this.closeDialog();
      }
    })
  }
  closeDialog(){
    this._matDialog.closeAll();
  }
}
