import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ChatService } from '../chat.service';
import { Chat, Profile } from '../chat.types';
import { NewChatComponent } from '../new-chat/new-chat.component';
import { ProfileComponent } from '../profile/profile.component';
import { interval, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { SignalRService } from 'app/modules/common/services/signalR.service';


@Component({
    selector: 'chat-chats',
    templateUrl: './chats.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSidenavModule,
        NewChatComponent,
        ProfileComponent,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        NgClass,
        // RouterLink,
        RouterOutlet,
    ],
})
export class ChatsComponent implements OnInit, OnDestroy, OnChanges {
    chats: Chat[];
    drawerComponent: 'profile' | 'new-chat';
    drawerOpened: boolean = false;
    filteredChats: any[];
    profile: Profile;
    selectedChat: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _hubConnection: HubConnection;
    userDetails: any;
    currentScreenAlias: string = 'lg';
    currentUrl: string = '';

    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private _router: Router,
        private _signalRService: SignalRService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        
        // this._hubConnection = this._chatService._Connection.getValue();
        this._signalRService.connection$.subscribe(res=>{
            this._hubConnection = res;
        })
        this._router.events.subscribe(() => {
            this.currentUrl = this._router.url;
          });
          
        setInterval(() => {
            if (this._hubConnection && this._hubConnection.state === HubConnectionState.Connected) {
                this._hubConnection.invoke("Ping")
                    .catch(err => console.warn("Ping failed", err));
            }
        }, 30000);
    }
    ngOnChanges(changes: SimpleChanges): void {
        this._changeDetectorRef.markForCheck();
        console.log("threads come in")
    }
    handleBackFromNewChat(): void {
        console.log('Back button clicked in NewChatComponent');
        this.drawerOpened = false;
        this.drawerComponent = null; // Optional: resets view state
        this.ngOnInit();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._fuseMediaWatcherService.onMediaChange$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(({ matchingAliases }) => {
            if (matchingAliases.length > 0) {
                this.currentScreenAlias = matchingAliases[0]; // e.g., 'lg', 'md', 'sm'
                console.log(this.currentScreenAlias,"matchingAliases")
            }
            this._changeDetectorRef.markForCheck();
        });
        // Chats
        let grid  = {
            keyword: "",
            pageNumber: 1,
            pageSize: 250,
            orderBy: "",
            sortOrder: ""
        }
        // this._chatService.getConversion(grid)
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((chats: any) => {
        //         this.selectedChat=this.chats = this.filteredChats = chats?.data;
        //         this._chatService._allThreads.next(chats?.data);
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
        interval(10000)
            .pipe(
                startWith(0),
                switchMap(() => this._chatService.getConversion(grid)),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((response: any) => {
                const updatedChats = response?.data || [];
            
                const existingMap = new Map(this.chats?.map((chat:any) => [chat.threadGuid, chat]));
            
                // Merge: update existing and include new
                const mergedChats = updatedChats.map((incoming) => {
                    const existing = existingMap.get(incoming.threadGuid);
                    if (existing) {
                        return { ...existing, isOnline: incoming.isOnline }; // only update status
                    } else {
                        return incoming; // new thread
                    }
                });
            
                this.chats = [...mergedChats];
                this.filteredChats = [...mergedChats];
            
                this._chatService._allThreads.next(this.chats);
                this._changeDetectorRef.markForCheck();
            });

        // Profile
        this._chatService.profile$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((profile: Profile) => {
                this.profile = profile;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Selected chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.selectedChat = chat;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Reset the chat
        this._chatService.resetChat();
    }
    isChatDetailView(): boolean {
        if(this.currentUrl?.includes('/chat/')){
            return true
        }else{
            return false
        }
      }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter the chats
     *
     * @param query
     */
    filterChats(query: string): void {
        // Reset the filter
        if (!query) {
            this.filteredChats = this.chats;
            return;
        }

        this.filteredChats = this.chats.filter((chat:any) =>
            chat?.userName.toLowerCase().includes(query.toLowerCase())
        );
    }

    /**
     * Open the new chat sidebar
     */
    openNewChat(): void {
        this.drawerComponent = 'new-chat';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    ConnectUser(chat) {
        this.userDetails= chat;
        this._chatService._threadDetails.next(chat);
        this._router.navigate([`/chat/${chat?.threadGuid}`]);
        // this._hubConnection = new HubConnectionBuilder()
        //     .withUrl(`${environment.externalApiURL}/chathub`)
        //     .build();

        // this._hubConnection.on('MessageReceived', (message) => {
        //     console.log(message);
        // });

        // this._hubConnection.start()
        //     .then(() => console.log('connection started'))
        //     .catch((err) => console.log('error while establishing signalr connection: ' + err));

    }

    /**
     * Open the profile sidebar
     */
    openProfile(): void {
        this.drawerComponent = 'profile';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
