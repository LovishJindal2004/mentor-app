import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { QBankService } from '../qbank.service';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { ApiErrorHandlerService } from 'app/modules/common/services/api-error-handling.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-qbank-details',
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    // NgApexchartsModule,
    MatProgressBarModule,
    // MatListModule,
    // MatRadioModule,
    MatSlideToggleModule,
    // PdfViewerModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatDatepickerModule,
    FormsModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule],
  templateUrl: './qbank-details.component.html',
  styleUrl: './qbank-details.component.scss'
})
export class QbankDetailsComponent implements OnInit {
  CmbeId: string = "";
  ExamId: any;
  QbnkExamDetails: any;
  taskId: string='';
  dataLoaded: boolean = false;
  isUserSelectTimer:boolean=false;
  constructor(
    private _location:Location, 
    private _route: ActivatedRoute, 
    private _qbnakservice: QBankService, 
    private errorHandling: ApiErrorHandlerService,
    private _datagurd: DataGuardService,
    private route:Router
    
  ) {
    this._route.params.subscribe(res => {
        this.ExamId = res['examId'];
        this.taskId = res['taskId'];
    });
    this._qbnakservice.getQbankExamDetail(this.ExamId,this.taskId).subscribe(res => {
      if(res){
        this.dataLoaded=true;
        this.QbnkExamDetails = res;
        this.isUserSelectTimer=this.QbnkExamDetails.isTimerEnabled;
        
      }

    }, (error) => {
      if (error) {
        this.dataLoaded=false;
        this.route.navigate(['']);
      }
      this.errorHandling.handleError(error)
    })
  }

  ngOnInit(): void {
  }
  Settimer(isChecked: boolean): void {
    this.isUserSelectTimer = isChecked;
    console.log(this.isUserSelectTimer);
}
naviGateToExam(){
  if(this.QbnkExamDetails && this.QbnkExamDetails.questionDuration>0){
    this.route.navigate(['/qbank/game-view/',this.ExamId,this.taskId],
      {
      queryParams:{
        time: this.isUserSelectTimer
      }
    })
  }else{
    this.route.navigate(['/qbank/game-view/',this.ExamId,this.taskId]);
  }

}
  goToQanks() {
     this._location.back();
  }
}
