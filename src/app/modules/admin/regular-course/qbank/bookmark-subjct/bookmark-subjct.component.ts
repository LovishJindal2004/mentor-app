import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ApiErrorHandlerService } from 'app/modules/common/services/api-error-handling.service';
import { QBanksService } from '../qbanks.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bookmark-subjct',
  imports: [CommonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    NgApexchartsModule,
    MatProgressBarModule,
    MatListModule,
    MatRadioModule,
    MatSlideToggleModule,
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
    MatDialogModule,
  RouterModule],
  templateUrl: './bookmark-subjct.component.html',
  styleUrls: ['./bookmark-subjct.component.scss']
})
export class BookmarkSubjctComponent implements OnInit {
  bookmarksubjectDetail: any = [];
  totalBookmarkedQuestions:number=0;
  constructor(private _qbankService: QBanksService, private _errorhandling: ApiErrorHandlerService,private location:Location) { }

  ngOnInit(): void {
    this._qbankService.getBookmarkSubjcetWise().subscribe(res => {
      this.bookmarksubjectDetail = res;
      this.totalBookmarkedQuestions = this.bookmarksubjectDetail.reduce((total, subject) => {
        return total + subject.noOfQuestionsBookMarked;
    }, 0);
    }, (error) => {
      this._errorhandling.handleError(error);
    })
  }
  Goback(){
this.location.back();
  }
}
