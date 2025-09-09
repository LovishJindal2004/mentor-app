import { Routes } from '@angular/router';
import { ExamGameAnalyticsComponent } from './exam-game-analytics/exam-game-analytics.component';
import { ExamGameReviewComponent } from './exam-game-review/exam-game-review.component';
import { ExamGameViewComponent } from './exam-game-view/exam-game-view.component';

export default [
    {
        path     : 'game-view/:examId/:taskId',
        component: ExamGameViewComponent,
        data: {
          layout: 'empty'
        },
    },
    {
        path     : 'game-review/:examId/:taskId',
        component: ExamGameReviewComponent,
        data: {
          layout: 'empty'
        },
    },
    {
        path     : 'game-analytics/:examId/:taskId',
        component: ExamGameAnalyticsComponent,
    },
] as Routes;
