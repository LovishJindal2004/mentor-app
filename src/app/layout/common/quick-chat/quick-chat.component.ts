import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, DOCUMENT, DatePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Inject,
    NgZone,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseScrollbarDirective } from '@fuse/directives/scrollbar';
import { HubConnection } from '@microsoft/signalr';
import { helperService } from 'app/core/auth/helper';
import { QuickChatService } from 'app/layout/common/quick-chat/quick-chat.service';
import { Chat } from 'app/layout/common/quick-chat/quick-chat.types';
import { ChatService } from 'app/modules/admin/chat/chat.service';
import { SignalRService } from 'app/modules/common/services/signalR.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'quick-chat',
    templateUrl: './quick-chat.component.html',
    styleUrls: ['./quick-chat.component.scss'],
    encapsulation: ViewEncapsulation.None,
    exportAs: 'quickChat',
    imports: [
        NgClass,
        MatIconModule,
        MatButtonModule,
        // FuseScrollbarDirective,
        NgTemplateOutlet,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        DatePipe,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
})
export class QuickChatComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('messageInput') messageInput: ElementRef;
    @ViewChild('chatBox') chatBoxRef!: ElementRef;
    chat: any;
    currentPage = 1;
    totalPages = 1;
    totalCount = 0;
    hasNextPage = false;
    hasPreviousPage = false;
    Message: FormControl;
    chats: Chat[];
    opened: boolean = false;
    threadId: any;
    showInput: boolean = true;
    isLoading = false;
    
    selectedChat: Chat;
    private _mutationObserver: MutationObserver;
    private _scrollStrategy: ScrollStrategy =
        this._scrollStrategyOptions.block();
    private _overlay: HTMLElement;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    userAccount: any;
    showSendButton: boolean = false;
    private _hubConnection: HubConnection;
    threadData: any;
    private scrollThreshold = 10;

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _elementRef: ElementRef,
        private _renderer2: Renderer2,
        private _ngZone: NgZone,
        private _quickChatService: QuickChatService,
        private _chatService: ChatService,
        private _helperService: helperService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _signalRService: SignalRService,
        private _scrollStrategyOptions: ScrollStrategyOptions
    ) {
        this.Message = new FormControl('');        
        this.userAccount = this._helperService.getUserDetail();
        this._signalRService.connection$.subscribe(res=>{
            this._hubConnection = res;
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Decorated methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Host binding for component classes
     */
    @HostBinding('class') get classList(): any {
        return {
            'quick-chat-opened': this.opened,
        };
    }
    
    /**
     * Resize on 'input' and 'ngModelChange' events
     *
     * @private
     */
    @HostListener('input')
    @HostListener('ngModelChange')
    private _resizeMessageInput(): void {
        // This doesn't need to trigger Angular's change detection by itself
        this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                // Set the height to 'auto' so we can correctly read the scrollHeight
                this.messageInput.nativeElement.style.height = 'auto';

                // Get the scrollHeight and subtract the vertical padding
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Chat
        this._quickChatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.chat = chat;
            });

        // Chats
        this._quickChatService.chats$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chats: Chat[]) => {
                this.chats = chats;
            });

        // Selected chat
        this._quickChatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.selectedChat = chat;
            });
        this.currentPage = 1;
        this.totalPages = 1;
        this.totalCount = 0;
        this.hasNextPage = false;
        this.hasPreviousPage = false;
        this.isLoading = false;
        let data = {
            "keyword": "",
            "pageNumber": 1,
            "pageSize": 10,
            "orderBy": "",
            "sortOrder": ""
          }
        this._chatService.getConversion(data).subscribe(res=>{
            if(res?.data?.length > 0){
                this.threadId = res?.data[0].threadGuid;
                this.getConversation();
                this.threadData = res?.data
                this._chatService._threadDetails.next(res?.data);

            }else{
                this._chatService.getContact(data).subscribe(response=>{
                    if(response?.data?.length > 0){
                        this._chatService.CreateThread(response?.data[0], this.userAccount?.Id).subscribe(val=>{
                            // debugger
                            this.threadId = val.threadGuid;
                            this.getConversation();
                            this.threadData = val;
                            this._chatService._threadDetails.next(val);
                        })
                    }
                })
            }
        });
        this.Message.valueChanges.subscribe(res=>{
            if(res.length > 0){
                this.showSendButton = true
            } else {
                this.showSendButton = false
            }
        });
         // SignalR message handler
         this._hubConnection.on("ReceiveMessage", data => {
            const { senderId, message, sentOn, messageGuid, isOwn, sender, profilePic,messageType } = data;
            // Ensure chat is initialized as array
            if (!Array.isArray(this.chat)) {
                this.chat = [];
            }

            // Push to chat list
            this.chat.push({
                senderId,
                message,
                sentOn,
                messageGuid,
                messageType,
                isMine: isOwn,
                id: messageGuid
            });
        
            this._changeDetectorRef.markForCheck();
        
            // Scroll to bottom after Angular renders it
            setTimeout(() => {
                this.scrollToBottom();
            }, 50);
        
            if (!isOwn) {
                // Optionally mark as seen
                // setTimeout(() => markAsSeen(messageGuid), 1000);
            }
        });
        
    }
    getConversation(){
        const grid = {
            keyword: "",
            pageNumber: 1,
            pageSize: 10,
            orderBy: "sentOn", // Order by date
            sortOrder: "desc"  // Newest first
        };
        this._chatService.getConversation(this.threadId, grid)
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((response: any) => {
                            
                            // API returns newest first, but we want oldest at top for chat
                            // So reverse the initial data
                            // const initialMessages = response?.data || [];
                            // this.chat = [...initialMessages].reverse();
                            
                            // // Set pagination info from API response
                            // this.currentPage = response?.currentPage || 1;
                            // this.totalPages = response?.totalPages || 1;
                            // this.totalCount = response?.totalCount || 0;
                            // this.hasNextPage = response?.hasNextPage || false;
                            // this.hasPreviousPage = response?.hasPreviousPage || false;
                            
                            // this._changeDetectorRef.markForCheck();
                            
                            // // Scroll to bottom after initial load (to show newest messages)
                            // setTimeout(() => {
                            //     this.scrollToBottom();
                            // }, 100);
                            const msgs = response.data.reverse(); // now oldest first
                            this.chat = msgs;
                            this.currentPage = response.currentPage;
                            this.totalPages = response.totalPages;
                            this.hasNextPage = response.hasNextPage;
                            this.scrollToBottom();
                        });
    }
    private scrollToBottom(): void {
        if (this.chatBoxRef?.nativeElement) {
            const chatBox = this.chatBoxRef.nativeElement;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // Fix for Firefox.
        //
        // Because 'position: sticky' doesn't work correctly inside a 'position: fixed' parent,
        // adding the '.cdk-global-scrollblock' to the html element breaks the navigation's position.
        // This fixes the problem by reading the 'top' value from the html element and adding it as a
        // 'marginTop' to the navigation itself.
        this._mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const mutationTarget = mutation.target as HTMLElement;
                if (mutation.attributeName === 'class') {
                    if (
                        mutationTarget.classList.contains(
                            'cdk-global-scrollblock'
                        )
                    ) {
                        const top = parseInt(mutationTarget.style.top, 10);
                        this._renderer2.setStyle(
                            this._elementRef.nativeElement,
                            'margin-top',
                            `${Math.abs(top)}px`
                        );
                    } else {
                        this._renderer2.setStyle(
                            this._elementRef.nativeElement,
                            'margin-top',
                            null
                        );
                    }
                }
            });
        });
        this._mutationObserver.observe(this._document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });
        setTimeout(() => {
            if (this.chatBoxRef?.nativeElement) {
                this.chatBoxRef.nativeElement.addEventListener(
                    'scroll',
                    this.onScroll.bind(this),
                    { passive: true } // Add passive option for better performance
                );
            } else {
                console.warn('chatBoxRef not available in ngAfterViewInit');
            }
        }, 100); // Increased timeout to ensure DOM is ready
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Disconnect the mutation observer
        this._mutationObserver.disconnect();

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        // Remove scroll event listener
        if (this.chatBoxRef?.nativeElement) {
            this.chatBoxRef.nativeElement.removeEventListener('scroll', this.onScroll);
        }
    }

    async SendMessage() {
        if (!this._hubConnection || !this.Message.value?.trim()) {
            console.error('Cannot send message: SignalR connection is not ready or message is empty.');
            return;
        }
        try {
            console.log(this.threadData,"threadData")
            let data = {
                receiverId: this.threadData[0]?.userId,
                senderId: this.userAccount?.Id,
                messageText: this.Message.value,
                messageType: 0,
            }
            console.log(data,this._hubConnection,"hubconnection")

            const result = await this._hubConnection.invoke("SendMessage",
                data.receiverId,
                data.senderId,
                data.messageText,
                data.messageType
            );

            if (result && result.messageId && result.sentOn) {
                // Add message to chat array instead of DOM manipulation
                if (!Array.isArray(this.chat)) {
                    this.chat = [];
                }
                
                this.chat.push({
                    senderId: this.userAccount?.Id,
                    message: this.Message.value,
                    sentOn: result.sentOn,
                    messageGuid: result.messageId,
                    isMine: true,
                    id: result.messageId
                });

                this._changeDetectorRef.markForCheck();
                
                setTimeout(() => {
                    this.scrollToBottom();
                }, 50);
            }

            this.Message.setValue('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the panel
     */
    open(): void {
        // Return if the panel has already opened
        if (this.opened) {
            return;
        }

        // Open the panel
        this._toggleOpened(true);
    }

    /**
     * Close the panel
     */
    close(): void {
        // Return if the panel has already closed
        if (!this.opened) {
            return;
        }

        // Close the panel
        this._toggleOpened(false);
    }

    /**
     * Toggle the panel
     */
    toggle(): void {
        this.opened = !this.opened;
      }

    /**
     * Select the chat
     *
     * @param id
     */
    selectChat(id: string): void {
        // Open the panel
        this._toggleOpened(true);

        // Get the chat data
        this._quickChatService.getChatById(id).subscribe();
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

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Show the backdrop
     *
     * @private
     */
    private _showOverlay(): void {
        // Try hiding the overlay in case there is one already opened
        this._hideOverlay();

        // Create the backdrop element
        this._overlay = this._renderer2.createElement('div');

        // Return if overlay couldn't be create for some reason
        if (!this._overlay) {
            return;
        }

        // Add a class to the backdrop element
        this._overlay.classList.add('quick-chat-overlay');

        // Append the backdrop to the parent of the panel
        this._renderer2.appendChild(
            this._elementRef.nativeElement.parentElement,
            this._overlay
        );

        // Enable block scroll strategy
        this._scrollStrategy.enable();

        // Add an event listener to the overlay
        this._overlay.addEventListener('click', () => {
            this.close();
        });
    }

    /**
     * Hide the backdrop
     *
     * @private
     */
    private _hideOverlay(): void {
        if (!this._overlay) {
            return;
        }

        // If the backdrop still exists...
        if (this._overlay) {
            // Remove the backdrop
            this._overlay.parentNode.removeChild(this._overlay);
            this._overlay = null;
        }

        // Disable block scroll strategy
        this._scrollStrategy.disable();
    }

    /**
     * Open/close the panel
     *
     * @param open
     * @private
     */
    private _toggleOpened(open: boolean): void {
        // Set the opened
        this.opened = open;

        // If the panel opens, show the overlay
        if (open) {
            this._showOverlay();
        }
        // Otherwise, hide the overlay
        else {
            this._hideOverlay();
        }
    }
    onScroll(): void {
        const el = this.chatBoxRef?.nativeElement;
        if (!el) return;
      
        // If user scrolled near the top, load more
        if (el.scrollTop <= this.scrollThreshold && !this.isLoading && this.hasNextPage) {
          this.loadOlderMessages();
        }
      }
      loadOlderMessages(): void {
        if (this.isLoading || !this.threadId || !this.hasNextPage) return;
      
        this.isLoading = true;
        const nextPage = this.currentPage + 1;
      
        const grid = {
          keyword: "",
          pageNumber: nextPage,
          pageSize: 10,
          orderBy: "sentOn",
          sortOrder: "desc" // backend sends newest first
        };
      
        const el = this.chatBoxRef.nativeElement;
        const prevHeight = el.scrollHeight;
        const prevTop = el.scrollTop;
      
        this._chatService.getConversation(this.threadId, grid)
          .subscribe({
            next: (response: any) => {
              const olderMsgs = response.data.reverse(); // fix order
              this.chat = [...olderMsgs, ...this.chat]; // prepend
      
              this.currentPage = response.currentPage;
              this.hasNextPage = response.hasNextPage;
      
              this._changeDetectorRef.detectChanges();
              setTimeout(() => {
                // restore scroll position
                el.scrollTop = el.scrollHeight - (prevHeight - prevTop);
              }, 0);
      
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
            }
          });
      }
      

}
