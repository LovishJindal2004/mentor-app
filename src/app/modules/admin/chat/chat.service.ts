import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat, Contact, Profile } from './chat.types';
import {
    BehaviorSubject,
    Observable,
    catchError,
    filter,
    map,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { environment } from 'environment/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
    public _threadDetails: BehaviorSubject<any> = new BehaviorSubject(null);
    public _allThreads: BehaviorSubject<any> = new BehaviorSubject(null);
    // public _Connection: BehaviorSubject<any> = new BehaviorSubject(null);
    private _chat: BehaviorSubject<Chat> = new BehaviorSubject(null);
    private _chats: BehaviorSubject<Chat[]> = new BehaviorSubject(null);
    private _contact: BehaviorSubject<Contact> = new BehaviorSubject(null);
    private _contacts: BehaviorSubject<Contact[]> = new BehaviorSubject(null);
    private _profile: BehaviorSubject<Profile> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for chat
     */
    get chat$(): Observable<Chat> {
        return this._chat.asObservable();
    }

    /**
     * Getter for chats
     */
    get chats$(): Observable<Chat[]> {
        return this._chats.asObservable();
    }

    /**
     * Getter for contact
     */
    get contact$(): Observable<Contact> {
        return this._contact.asObservable();
    }

    /**
     * Getter for contacts
     */
    get contacts$(): Observable<Contact[]> {
        return this._contacts.asObservable();
    }

    /**
     * Getter for profile
     */
    get profile$(): Observable<Profile> {
        return this._profile.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get chats
     */
    getChats(): Observable<any> {
        return this._httpClient.get<Chat[]>('api/apps/chat/chats').pipe(
            tap((response: Chat[]) => {
                this._chats.next(response);
            })
        );
    }

    /**
     * Get contact
     *
     * @param id
     */
    // getContact(id: string): Observable<any> {
    //     return this._httpClient
    //         .get<Contact>('api/apps/chat/contacts', { params: { id } })
    //         .pipe(
    //             tap((response: Contact) => {
    //                 this._contact.next(response);
    //             })
    //         );
    // }

    /**
     * Get contacts
     */
    getContacts(): Observable<any> {
        return this._httpClient.get<Contact[]>('api/apps/chat/contacts').pipe(
            tap((response: Contact[]) => {
                this._contacts.next(response);
            })
        );
    }

    /**
     * Get profile
     */
    getProfile(): Observable<any> {
        return this._httpClient.get<Profile>('api/apps/chat/profile').pipe(
            tap((response: Profile) => {
                this._profile.next(response);
            })
        );
    }

    /**
     * Get chat
     *
     * @param id
     */
    getChatById(id: string): Observable<any> {
        return this._httpClient
            .get<Chat>('api/apps/chat/chat', { params: { id } })
            .pipe(
                map((chat) => {
                    // Update the chat
                    this._chat.next(chat);

                    // Return the chat
                    return chat;
                }),
                switchMap((chat) => {
                    if (!chat) {
                        return throwError(
                            'Could not found chat with id of ' + id + '!'
                        );
                    }

                    return of(chat);
                })
            );
    }

    /**
     * Update chat
     *
     * @param id
     * @param chat
     */
    updateChat(id: string, chat: Chat): Observable<Chat> {
        return this.chats$.pipe(
            take(1),
            switchMap((chats) =>
                this._httpClient
                    .patch<Chat>('api/apps/chat/chat', {
                        id,
                        chat,
                    })
                    .pipe(
                        map((updatedChat) => {
                            // Find the index of the updated chat
                            const index = chats.findIndex(
                                (item) => item.id === id
                            );

                            // Update the chat
                            chats[index] = updatedChat;

                            // Update the chats
                            this._chats.next(chats);

                            // Return the updated contact
                            return updatedChat;
                        }),
                        switchMap((updatedChat) =>
                            this.chat$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the chat if it's selected
                                    this._chat.next(updatedChat);

                                    // Return the updated chat
                                    return updatedChat;
                                })
                            )
                        )
                    )
            )
        );
    }

    /**
     * Reset the selected chat
     */
    resetChat(): void {
        this._chat.next(null);
    }
    getConversion(grid): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiURL}/chat/chatthreadlist`,grid).pipe(
            tap((response: any) => {
               return response
            })
        );
    }
    getContact(grid): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiURL}/chat/contact`,grid).pipe(
            tap((response: any) => {
               return response
            })
        );
    }
    getConversation(threadid,grid): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiURL}/chat/getchatmessage?threadId=${threadid}`,grid).pipe(
            tap((response: any) => {
               return response
            })
        );
    }
    CreateThread(data,senderId): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiURL}/chat/create-chat-thread?senderId=${senderId}&recieverId=${data.userId}`,{}).pipe(
            tap((response: any) => {
               return response
            })
        );
    }
    getPresignedUrl(blob): Observable<any> {
        console.log(blob,"blob")
        const formData = new FormData();
        formData.append('upload', blob, blob.name);
    
        return this._httpClient.post(`${environment.tenantvalidateURl}/files/upload/audio`, formData)
          .pipe(
            map((response: any) => {
              return {
                fileName: response?.fileName || '',
                uploaded: response?.uploaded || 0,
                url: response?.url || ''
              };
            }),
            catchError(error => {
              console.error('Error uploading file:', error);
              console.error('Full Error Response:', error);
              throw error;
            })
          );
      }
    GetThreadDetail(threadId): Observable<any> {
        return this._httpClient.get<any>(`${environment.apiURL}/chat/ chat-thread-details?threadguid=${threadId}`,{}).pipe(
            tap((response: any) => {
               return response
            })
        );
    }
    ConnectUser(grid) {
        // return this._httpClient.post<any>(`${environment.apiURL}/chat/chatthreadlist`,grid).pipe(
        //     tap((response: any) => {
        //        return response
        //     })
        // );
    }
}
