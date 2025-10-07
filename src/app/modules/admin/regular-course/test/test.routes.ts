import { Routes } from "@angular/router";
import { TestListComponent } from "./test-list/test-list.component";
import { ExamGameViewComponent } from "./exam-game-view/exam-game-view.component";
import { ExamGameReviewComponent } from "./exam-game-review/exam-game-review.component";
import { ExamGameAnalyticsComponent } from "./exam-game-analytics/exam-game-analytics.component";

export default [
    {
        path:'list/:categoryname/:examtype',
        component: TestListComponent
    },
    {
        path     : 'game-view/:examId',
        component: ExamGameViewComponent,
        data: {
          layout: 'empty'
        },
    },
    {
        path     : 'game-review/:examId',
        component: ExamGameReviewComponent,
        data: {
          layout: 'empty'
        },
    },
    {
        path     : 'game-analytics/:examId',
        component: ExamGameAnalyticsComponent,
    },
] as Routes 