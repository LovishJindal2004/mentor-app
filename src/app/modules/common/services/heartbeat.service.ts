import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { environment } from 'environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HeartbeatService {
  private heartbeatInterval = 30000; 
  private intervalSub?: Subscription;

  constructor(private http: HttpClient) {}

  startHeartbeat() {
    if (!this.intervalSub) {
      this.intervalSub = interval(this.heartbeatInterval).subscribe(() => {
        this.http.get(`${environment.apiURL}/analytic/heartbeat`).subscribe();
      });
    }
  }

  stopHeartbeat() {
    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
      this.intervalSub = undefined;
    }
  }
}
