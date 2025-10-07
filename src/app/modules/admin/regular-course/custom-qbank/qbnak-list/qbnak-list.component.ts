import { Component, OnInit } from '@angular/core';
import { CustomQBankService } from '../custom-qbank.service';
import { Subject, takeUntil } from 'rxjs';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-qbnak-list',
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
  templateUrl: './qbnak-list.component.html',
  styleUrls: ['./qbnak-list.component.scss']
})
export class QbnakListComponent implements OnInit {
  exams:any;
  courseid:string;
  private _unsubscribeAll: any;
  constructor(
    private _customQBankService: CustomQBankService,
    private _dataGuard: DataGuardService,
  ) { 
    this.courseid = this._dataGuard.getCourseId('Courseid');
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.GetList();
  }
  GetList(){
    this._customQBankService.CQBankList.pipe(
          takeUntil(this._unsubscribeAll),
        )
        .subscribe(search => {
          this.listcall();
        });
  }
  listcall(){
    this._customQBankService.getCustomQbankList(this.courseid).subscribe(res=>{
      this.exams = res;
    })
  }
  DeleteCQBank(guid){
    this._customQBankService.DeleteCQBank(guid).subscribe(res=>{
      this._customQBankService.CQBankList.next(true);
    })
  }

}
