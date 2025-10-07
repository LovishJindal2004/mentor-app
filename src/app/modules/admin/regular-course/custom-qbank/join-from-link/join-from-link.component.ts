import { Component, OnInit } from '@angular/core';
import { CustomQBankService } from '../custom-qbank.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
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

@Component({
  selector: 'app-join-from-link',
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
  RouterLink],
  templateUrl: './join-from-link.component.html',
  styleUrls: ['./join-from-link.component.scss']
})
export class JoinFromLinkComponent implements OnInit {
  examDetails:any;
  examid:string;
  value:string
  constructor(
    private _qbankService: CustomQBankService,
    private _route: ActivatedRoute,
  ) { 
    this._route.params.subscribe(res=>{
      this.examid = res.examid;
    })
  }

  ngOnInit(): void {
    this._qbankService.getCustomQBankDetails(this.examid).subscribe(res=>{
      this.examDetails = res;
      this.value = `http://localhost:4200/CustomQbank/${res.guid}`
      this._qbankService.assignCustomQBankDetails(this.examDetails?.mcqCode).subscribe(response=>{
      })
    })
    
  }

}
