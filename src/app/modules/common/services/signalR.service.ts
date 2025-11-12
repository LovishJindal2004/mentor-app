import { Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { DataGuardService } from "app/core/auth/guards/dataGuard";
import { environment } from "environment/environment";
import { BehaviorSubject } from "rxjs";

// signalr.service.ts
@Injectable({ providedIn: 'root' })
export class SignalRService {
  private _hubConnection!: any;
  private _connection = new BehaviorSubject<HubConnection | null>(null);
  public connection$ = this._connection.asObservable();

  constructor(private _dataService: DataGuardService) {}

  public connect(): Promise<boolean> {
    this.requestNotificationPermission();
    const existingConnection = this._connection.getValue();
    if (existingConnection && existingConnection.state === 'Connected' && this._hubConnection?.connection?.transport._accessToken) {
      console.log('SignalR already connected');
      // console.log(this._hubConnection?.connection?.transport._accessToken,'SignalR already connected');
      return Promise.resolve(true);
    }

    const token = this._dataService.getLocalData('accessToken');
    const cleanedToken = token?.replace(/^"|"$/g, '');
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.externalApiURL}/chathub`, {
        accessTokenFactory: () => cleanedToken || '',
      })
      .withAutomaticReconnect()
      .build();

    this._hubConnection.on('ReceiveMessage', (data) => {
      console.log(data,"data")
      if (!data.isOwn) {
        if(data?.messageType == 1){
          this.showDesktopNotification(`${data.sender}`, "🎤 Voice message", data.profilePic, data.threadGuid || data.threadId);
        } else {
          this.showDesktopNotification(`New Message from ${data.sender}`, data.message, data.profilePic, data.threadGuid || data.threadId);
        }
      }
      // You can emit it to other components here via a Subject
    });

    return this._hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this._connection.next(this._hubConnection);
        return true;
      })
      .catch((err) => {
        console.error('SignalR connection error:', err);
        this._connection.next(null);
        return false;
      });
  }
  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }

  public disconnect(): void {
    this._hubConnection?.stop();
    this._connection.next(null);
  }
  showDesktopNotification(title: string, message: string, pic: string, threadId?: string) {
    // if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: message,
        icon: pic || 'my-images/default-img.png'
      });
      
      // On click, focus window and optionally navigate
      notification.onclick = (event) => {
        event.preventDefault(); // Prevent default browser behavior
  
        // Focus existing tab (or open if closed)
        if (window.focus) {
          window.focus();
        }
  
        // Navigate to specific chat thread
        if (threadId) {
          window.location.href = `/chat/${threadId}`;
        }
      };
    
    // }
  }
}
