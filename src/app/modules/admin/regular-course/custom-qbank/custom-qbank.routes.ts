import { Routes } from "@angular/router";
import { QbnakListComponent } from "./qbnak-list/qbnak-list.component";
import { CustomQbankComponent } from "./custom-qbank.component";
import { JoinFromLinkComponent } from "./join-from-link/join-from-link.component";
import { CustomGameViewComponent } from "./custom-game-view/custom-game-view.component";
import { GameViewComponent } from "./game-view/game-view.component";
import { GameReviewComponent } from "./game-review/game-review.component";
import { GameAnalyticsComponent } from "./game-analytics/game-analytics.component";

export default [
    
    {
        path: 'list', component: QbnakListComponent
    },
    {
        path: 'Create', component: CustomQbankComponent
    },
    {
        path: ':examid', component: JoinFromLinkComponent
    },
    {
        path: 'custom-game-view', component: CustomGameViewComponent,
        data: {
            layout: 'empty'
        },

    },
    {
        path: 'game-view/:examid', component: GameViewComponent,
        data: {
            layout: 'empty'
        },

    },
    {
        path: 'game-review/:examid', component: GameReviewComponent,
        data: {
            layout: 'empty'
        },

    },
    {
        path: 'game-analytics/:examid', component: GameAnalyticsComponent,
    }
] as Routes