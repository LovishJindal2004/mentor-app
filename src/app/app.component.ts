import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeartbeatService } from './modules/common/services/heartbeat.service';
import { helperService } from './core/auth/helper';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [RouterOutlet],
})
export class AppComponent {
    private isMentee = false;

    /**
     * Constructor
     */
    constructor(
        private heartbeatService: HeartbeatService,
        private _helperService: helperService
    ) { }

    ngOnInit(): void {
        // get user role (example: from JWT or API)
        const userDetails:any = this._helperService.getUserDetail();
        this.isMentee = userDetails?.Roles === 'Mentee';
        console.log(this.isMentee,"isMentee")

        if (this.isMentee) {
            this.handleVisibilityChange();

            if (!document.hidden) {
                this.heartbeatService.startHeartbeat();
            }

            document.addEventListener('visibilitychange', this.handleVisibilityChange);
        }
    }

    handleVisibilityChange = () => {
        if (!this.isMentee) return;

        if (document.hidden) {
            this.heartbeatService.stopHeartbeat();
        } else {
            this.heartbeatService.startHeartbeat();
        }
    };

    ngOnDestroy(): void {
        if (this.isMentee) {
            this.heartbeatService.stopHeartbeat();
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        }
    }
}
