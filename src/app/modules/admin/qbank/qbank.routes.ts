import { Routes } from '@angular/router';
import { QbankDetailsComponent } from './qbank-details/qbank-details.component';
import { QbankGameViewComponent } from './qbank-game-view/qbank-game-view.component';
import { QbankGameReviewComponent } from './qbank-game-review/qbank-game-review.component';
import { QbankGameAnalyticsComponent } from './qbank-game-analytics/qbank-game-analytics.component';

export default [
    {
        path     : 'details/:examId/:taskId',
        component: QbankDetailsComponent,
    },
    {
        path     : 'game-view/:examId/:taskId',
        component: QbankGameViewComponent,
        data: {
          layout: 'empty'
        },
    },
    {
        path     : 'game-review/:examId/:taskId',
        component: QbankGameReviewComponent,
        data: {
          layout: 'empty'
        },
    },
    {
        path     : 'game-analytics/:examId/:taskId',
        component: QbankGameAnalyticsComponent,
    },
] as Routes;
