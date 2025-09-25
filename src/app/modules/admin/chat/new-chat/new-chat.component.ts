import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ChatService } from '../chat.service';
import { Contact } from '../chat.types';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { helperService } from 'app/core/auth/helper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ProfileComponent } from '../profile/profile.component';

@Component({
    selector: 'chat-new-chat',
    templateUrl: './new-chat.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule, ],
})
export class NewChatComponent implements OnInit, OnDestroy {
    @Input() drawer: MatDrawer;
    @Output() backClicked = new EventEmitter<void>();
    contacts: Contact[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    userDetails: any;
    userAccount: any;
    filteredContacts: any[];

    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private _changeDetection: ChangeDetectorRef,
        private _helperService: helperService,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Contacts
        let grid = {
            keyword: "",
            pageNumber: 1,
            pageSize: 250,
            orderBy: "",
            sortOrder: ""
        }
        this._chatService.getContact(grid)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contacts: any) => {
                this._changeDetection.markForCheck();
                this.filteredContacts = this.contacts = contacts?.data;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    goBack() {
        this.backClicked.emit();
        this.drawer.close();
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
    GotoUserChat(chat) {
        this.userAccount = this._helperService.getUserDetail();
        this._chatService.CreateThread(chat,this.userAccount?.Id).subscribe(res=>{
            if(res){
                this.userDetails= chat;
                this._chatService._threadDetails.next(chat);
                this._router.navigate([`/chat/${res?.threadGuid}`]);
            }
        })
        
    }
    filterChats(query: string): void {
        // Reset the filter
        if (!query) {
            this.filteredContacts = this.contacts;
            return;
        }
        console.log(query);

        this.filteredContacts = this.contacts.filter((chat:any) =>
            chat?.userName.toLowerCase().includes(query.toLowerCase())
        );
    }
}
