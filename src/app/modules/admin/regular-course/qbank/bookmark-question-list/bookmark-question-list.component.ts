import { Component, OnInit } from '@angular/core';
import { QBanksService } from '../qbanks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule, Location } from '@angular/common';
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

@Component({
  selector: 'app-bookmark-question-list',
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
    MatDialogModule],
  templateUrl: './bookmark-question-list.component.html',
  styleUrls: ['./bookmark-question-list.component.scss']
})
export class BookmarkQuestionListComponent implements OnInit {
  subjectId: number = 0;
  pageNumber: number = 1;
  pageSize: number = 12;
  totalQuestions: number = 0;
  QuestionList: any[] = [];

  constructor(private _qbankService: QBanksService,private router: Router, private activeroute: ActivatedRoute, private sanitizer: DomSanitizer, private errorhandling: ApiErrorHandlerService,private location:Location) { }

  ngOnInit(): void {
    this.activeroute.params.subscribe(res => {
      if (res) {
        this.subjectId = res['subjectId'];
      }
    });
    this.getBookmarkQuestionList(this.pageNumber, this.pageSize);
  }

  getBookmarkQuestionList(page: number, size: number): void {
    this._qbankService.getBookmarkQbnkQuestionList(this.subjectId, page, size).subscribe(res => {
      this.QuestionList = res.data;
      this.totalQuestions = res.totalCount; // Update total questions from the response
    }, (error) => {
      this.errorhandling.handleError(error);
    });
  }

  getNext(event: any): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getBookmarkQuestionList(this.pageNumber, this.pageSize);
  }
  sanitizeExplanationContent(explanation) {
    let sanitizedHtml = explanation?.replace(/\\/g, '');
    sanitizedHtml = sanitizedHtml.replace(/<img[^>]*>/g, '');
    return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);

  }
  navigateToDetails(subjectId: number, questionDetailID: number, pageNumber: number, pageSize: number) {
    this.router.navigate(['/qbanks/bookmarks/questionsDetails', subjectId, questionDetailID], {
      queryParams: { pageNumber: pageNumber, pageSize: pageSize }
    });
  }
  
  BookmarkQuestions(Qustion: any, IsBookMark: boolean) {
    Qustion.isBoomarked = IsBookMark ? false : true;
    var request = {
      examid: Qustion.examId,  // Make sure the property names match
      questionId: Qustion.questionDetailID,
      courseId:Qustion.courseId,  // Make sure the property names match
      IsBookMark: IsBookMark ? false : true,
    };

    this._qbankService.BookmarkQbnkQuestion(request).subscribe((res) => {
if(res){
  this.getBookmarkQuestionList(this.pageNumber,this.pageSize);
}
    },(error)=>{
      this.errorhandling.handleError(error);
    })
  }
  Goback(){
this.location.back();
  }
}
