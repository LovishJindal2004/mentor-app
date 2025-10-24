import { Routes } from "@angular/router";
import { SubjectListComponent } from "./subject-list/subject-list.component";
import { ExamListComponent } from "./exam-list/exam-list.component";
import { QbankDetailsComponent } from "./qbank-details/qbank-details.component";
import { QbankGameAnalyticsComponent } from "./qbank-game-analytics/qbank-game-analytics.component";
import { QbankGameReviewComponent } from "./qbank-game-review/qbank-game-review.component";
import { QbankGameViewComponent } from "./qbank-game-view/qbank-game-view.component";
import { BookmarkSubjctComponent } from "./bookmark-subjct/bookmark-subjct.component";
import { BookmarkQuestionListComponent } from "./bookmark-question-list/bookmark-question-list.component";
import { BookmarkQuestionDetailsComponent } from "./bookmark-question-details/bookmark-question-details.component";

export default [
    {
        path: 'subjects',
        component: SubjectListComponent
    },
    {
        path: 'exam-list/:subjectId',
        component: ExamListComponent
    },
    {
        path     : 'exam-details/:examId',
        component: QbankDetailsComponent,
    },
    {
        path     : 'game-view/:examId',
        component: QbankGameViewComponent,
        data: {
          layout: 'empty'
        },
    },
    {
        path     : 'game-review/:examId',
        component: QbankGameReviewComponent,
        data: {
          layout: 'empty'
        },
    },
    {
        path     : 'game-analytics/:examId',
        component: QbankGameAnalyticsComponent,
    },
    {
      path: 'bookmarks',
      component: BookmarkSubjctComponent,
  
    },
    {
      path: 'bookmarks/questions/:subjectId',
      component: BookmarkQuestionListComponent,
  
    },
    {
      path: 'bookmarks/questionsDetails/:subjectId/:Questionid',
      component: BookmarkQuestionDetailsComponent,
      data: {
        layout: 'empty'
      },
  
    },
] as Routes