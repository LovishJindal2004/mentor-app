import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from "@angular/router";
import { ChatComponent } from "./chat.component";
import { ChatsComponent } from "./chats/chats.component";
import { EmptyConversationComponent } from "./empty-conversation/empty-conversation.component";
import { ConversationComponent } from "./conversation/conversation.component";
import { inject } from "@angular/core";
import { ChatService } from "./chat.service";

// export default [
//     {
//         path: 'mentee-list',
//         component: ChatComponent
//     }

// ] as Routes
// import { inject } from '@angular/core';
// import {
//     ActivatedRouteSnapshot,
//     Router,
//     RouterStateSnapshot,
//     Routes,
// } from '@angular/router';
// import { ChatService } from './chat.service';
// import { ChatsComponent } from './chats/chats.component';
// import { ConversationComponent } from './conversation/conversation.component';
// import { EmptyConversationComponent } from './empty-conversation/empty-conversation.component';
// import { catchError, throwError } from 'rxjs';
// import { ChatComponent } from './chat.component';
// import { DataGuardService } from 'app/core/auth/data.guard';
// import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
// import { environment } from 'environments/environment';

// /**
//  * Conversation resolver
//  *
//  * @param route
//  * @param state
//  */
// const conversationResolver = (
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
// ) => {
//     const chatService = inject(ChatService);
//     const router = inject(Router);

//     return chatService.getChatById(route.paramMap.get('id')).pipe(
//         // Error here means the requested chat is not available
//         catchError((error) => {
//             // Log the error
//             console.error(error);

//             // Get the parent url
//             const parentUrl = state.url.split('/').slice(0, -1).join('/');

//             // Navigate to there
//             router.navigateByUrl(parentUrl);

//             // Throw an error
//             return throwError(error);
//         })
//     );
// };
const checkThread = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const chatService = inject(ChatService);
    const router = inject(Router);

    const threadId = route.paramMap.get('id');

    return new Promise<boolean>((resolve, reject) => {
        let grid  = {
            keyword: "",
            pageNumber: 1,
            pageSize: 250,
            orderBy: "",
            sortOrder: ""
        }
        chatService.getConversion(grid).subscribe({
            next: (res) => {
                const threads = res?.data;

                const found = threads?.some((t: any) => t?.threadGuid === threadId);
                const threadDetail = threads?.filter((t: any) => t?.threadGuid === threadId);
                if (found) {
                    resolve(true); 
                    chatService._threadDetails.next(threadDetail[0]);
                } else {
                    router.navigateByUrl('/chat');
                    reject(false);
                }
            },
            error: (err) => {
                console.error('Failed to fetch threads:', err);
                reject(false);
            }
        });
        
    });
};

export default [
    {
        path: '',
        component: ChatComponent,
        children: [
            {
                path: '',
                component: ChatsComponent,
                children: [
                    {
                        path: 'new-chat/:id',
                        component: EmptyConversationComponent,
                    },
                    {
                        path: ':id',
                        component: ConversationComponent,
                        resolve: {
                            checkThread
                        },
                    },
                ],
            },
        ],
    },
] as Routes;
