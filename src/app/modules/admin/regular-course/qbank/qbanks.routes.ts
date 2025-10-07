import { Routes } from "@angular/router";
import { SubjectListComponent } from "./subject-list/subject-list.component";
import { ExamListComponent } from "./exam-list/exam-list.component";
import { QbankDetailsComponent } from "./qbank-details/qbank-details.component";
import { QbankGameAnalyticsComponent } from "./qbank-game-analytics/qbank-game-analytics.component";
import { QbankGameReviewComponent } from "./qbank-game-review/qbank-game-review.component";
import { QbankGameViewComponent } from "./qbank-game-view/qbank-game-view.component";

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
] as Routes