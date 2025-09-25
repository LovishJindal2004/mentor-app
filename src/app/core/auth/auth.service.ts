// import { HttpClient, HttpParams } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { AuthUtils } from 'app/core/auth/auth.utils';
// import { UserService } from 'app/core/user/user.service';
// import { environment } from 'environment/environment';
// import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
// import { DataGuardService } from './guards/dataGuard';
// import { helperService } from './helper';
// import { User } from '../user/user.types';

// @Injectable({ providedIn: 'root' })
// export class AuthService{
//     private _authenticated: boolean = false;
//     private _verfiedOTP: boolean = false;
//     /**
//      * Constructor
//      */
//     constructor(
//         private _httpClient: HttpClient,
//         private _userService: UserService,
//         private _dataGuardService: DataGuardService,
//         private _helperService: helperService
//     ) {

//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Accessors
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Setter & getter for access token
//      */
//     set accessToken(token: string) {
//         localStorage.setItem('accessToken', token);
//     }

//     get accessToken(): string {
//         return localStorage.getItem('accessToken') ?? '';
//     }
//     getRefreshToken(): string {
//         return localStorage.getItem('refreshToken') ?? '';
//     }
//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------
//     /**
//      * Forgot password
//      *
//      * @param email
//      */
//     forgotPassword(email: string): Observable<any> {
//         return this._httpClient.post('api/auth/forgot-password', email);
//     }

//     /**
//      * Reset password
//      *
//      * @param password
//      */
//     resetPassword(request: any): Observable<any> {
//         return this._httpClient.post(`${environment.externalApiURL}/saas/api/users/reset-password`, { ...request }, { responseType: 'text' })
//     }
//     signIn(user): Observable<any> {
//         return this._httpClient.post(`${environment.externalApiURL}/api/tokens/`, user).pipe(
//             switchMap((response: any) => {
//                 this.accessToken = response.token
//                 // Set the authenticated flag to true
//                 this._authenticated = true;
//                 return of(response);
//             })
//         );
//     }
//     signInByUserid(user): Observable<any> {
//         return this._httpClient.post(`${environment.externalApiURL}/api/users/signin by userid?userid=${user}`,'').pipe(
//             switchMap((response: any) => {
//                 this.accessToken = response.token
//                 // Set the authenticated flag to true
//                 this._authenticated = true;
//                 return of(response);
//             })
//         );
//     }
//     // student Signup
//     StudentLogin(user): Observable<any> {
//         return this._httpClient.post(`${environment.externalApiURL}/api/users/signin/`, user).pipe(
//             switchMap((response: any) => {
//                 return of(response);
//             })
//         );
//     }
//     StundeSignUp(user): Observable<any> {
//         return this._httpClient.post(`${environment.externalApiURL}/api/users/signup/`, user).pipe(
//             switchMap((response: any) => {

//                 return of(response);
//             })
//         );
//     }
//     verifyOtp(user): Observable<any> {
//         return this._httpClient.post(`${environment.externalApiURL}/api/users/verifyotp/`, user).pipe(
//             switchMap((response: any) => {
//                 this.accessToken = response.token
//                 this._authenticated = true;
//                 return of(response);
//             })
//         );
//     }
//     // Login using AdrAPi  vansh
//     createUser(user: any): Promise<any> {
//         return new Promise((resolve, reject) => {
//             this._httpClient.post(`${environment.apiURL}/user/create-user/`, { ...user })
//                 .subscribe(response => {
//                     resolve(response);
//                 }, reject);
//         });
//     }

//     forgetPassword(request: any): Promise<any> {
//         return new Promise((resolve, reject) => {
//             this._httpClient.post(`${environment.externalApiURL}/saas/api/users/forgot-password/`, { ...request }, { responseType: 'text' })
//                 .subscribe((response: any) => {
//                     resolve(response);
//                 }, reject);
//         }
//         );
//     }

//     sendOTP(mobile: any): Promise<User> {
//         return new Promise((resolve, reject) => {
//             this._httpClient.get(`${environment.apiURL}/api/user/get-otp/` + mobile)
//                 .subscribe((response: any) => {
//                     resolve(response);
//                 }, reject);
//         }
//         );

//     }
//     verifyOTP(mobile: any, passcode: string): Promise<any> {
//         return new Promise((resolve, reject) => {
//             this._httpClient.get(`${environment.apiURL}/api/user/verify-otp/` + mobile + '/' + passcode)
//                 .subscribe((response: any) => {
//                     resolve(response);
//                 }, reject);
//         }
//         );
//     }
//     refreshToken(): Observable<any> {
//         var request = {
//             token: this.accessToken,
//             refreshToken: this.getRefreshToken()
//         };
//         return this._httpClient.post(`${environment.externalApiURL}/api/tokens/refresh`, { ...request }).pipe(
//             tap((response) => {
//                 // console.log('Token Refresh Response:', response);
//             }),
//             catchError((error) => {
//                 console.error('Error occurred during refreshToken():', error);
//                 return throwError(error);
//             })
//         );
//     }
//     validateUser(request): Observable<any> {
//         // return this._httpClient.post('api/auth/validateUser', { type:type });
//         return this._httpClient.post(`${environment.apiURL}/course/authorize/`, { ...request });
//     }
//     //End by vansh

//     /**
//      * Sign in using the access token
//      */
//     signInUsingToken(): Observable<any> {
//         // Renew token

//         return this._httpClient.post('api/auth/refresh-access-token', {
//             accessToken: this.accessToken
//         }).pipe(
//             catchError(() =>

//                 // Return false
//                 of(false)
//             ),
//             switchMap((response: any) => {
//                 // Store the access token in the local storage
//                 // this.accessToken = response.accessToken;

//                 // // Set the authenticated flag to true
//                 this._authenticated = true;

//                 // // Store the user on the user service
//                 // this._userService.user = response.user;

//                 // Return true
//                 return of(true);
//             })
//         );
//     }

//     /**
//      * Sign out
//      */
//     signOut(): Observable<any> {
//         // Remove the access token from the local storage
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('studentName')
//         localStorage.removeItem('popupShown');
//         // this._dataGuardService.removeCookieData('Adr-user')
//         // localStorage.removeItem('id');
//         // Set the authenticated flag to false
//         this._authenticated = false;

//         // Return the observable
//         return of(true);
//     }

//     /**
//      * Sign up
//      *
//      * @param user
//      */
//     signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
//         return this._httpClient.post('api/auth/sign-up', user);
//     }

//     // GetTinatDetail(): Observable<tenantApiResponse> {
//     //     return this._httpClient.get<tenantApiResponse>('api/auth/tinatVerification', {})
//     // }
//     GetTinatDetail(DomainName: any): Observable<any> {
//         return this._httpClient.get(`${environment.tenantvalidateURl}/api/saas/Tenant/validate-tenant/` + DomainName, {});
//     }
//     /**
//      * Unlock session
//      *
//      * @param credentials
//      */



//     unlockSession(credentials: { email: string; password: string }): Observable<any> {
//         return this._httpClient.post('api/auth/unlock-session', credentials);
//     }

//     /**
//      * Check the authentication status
//      */
//     check(): Observable<boolean> {
//         var self = this;
//         // Check if the user is logged in
//         let _u = this._helperService.getUserDetail();
//         if (_u) {
//             this._authenticated = true;
//             this._userService.user = _u;

//         }
//         if (this._authenticated) {
//             return of(true);
//         }

//         // Check the access token availability
//         if (!this.accessToken) {
//             return of(false);
//         }

//         // If the access token exists and it didn't expire, sign in using it
//         return of(this._userService.user ? true : false);
//     }
//     getUserInfo(user: any): Observable<any> {

//         return this._httpClient.post(`${environment.apiURL}/api/user/get-user-info/`, user).pipe(
//             switchMap((response: any) => {


//                 // Set the authenticated flag to true
//                 this._authenticated = true;

//                 // Store the user on the user service
//                 this._userService.user = response.data;

//                 // Return a new observable with the response
//                 return of(response);
//             })
//         );

//     }

//     // signup by harsh
//     sighUpWithEmailAndPhone(user): Observable<any> {

//         return this._httpClient.post(`${environment.externalApiURL}/api/users/v2-signup/`, user).pipe(

//             switchMap((response: any) => {

//                 return of(response);
//             })
//         );
//     }

//     verifyOtpForPhoneAndEmail(otpRequest): Observable<any> {
//         return this._httpClient.post(`${environment.externalApiURL}/api/users/v2-verifyotp/`, otpRequest).pipe(
//             switchMap((response: any) => {
//                 this.accessToken = response.token
//                 this._authenticated = true;
//                 return of(response);
//             })
//         );
//     }

//     resendOtp(request) {
//         return this._httpClient.post(`${environment.externalApiURL}/api/users/sendotp/`, request).pipe(
//             switchMap((response: any) => {
//                 // this.accessToken = response.token
//                 // this._authenticated = true;
//                 return of(response);
//             })
//         );
//     }
//     confirmUserMobileOtp(verifyOtp: any): Observable<any> {

//         const params = new HttpParams()
//             .set('phoneNumber', verifyOtp.phoneNumber)
//             .set('phoneCountryCode', verifyOtp.phoneCountryCode)
//             .set('otp', verifyOtp.otp);

//         return this._httpClient.post<any>(
//             `${environment.externalApiURL}/api/users/confirm-phone-number/`,
//             null,  // body is null as we're using query params
//             { params: params, responseType: 'text' as 'json' }  // pass params as an option
//         ).pipe(
//             switchMap((response: any) => {
//                 // this.accessToken = response.token
//                 // this._authenticated = true;
//                 return of(response);
//             })
//         );
//     }

//     confirmUserEmailOtp(verifyOtp: any): Observable<any> {

//         const params = new HttpParams()
//             .set('email', verifyOtp.email)

//             .set('otp', verifyOtp.otp);

//         return this._httpClient.post<any>(
//             `${environment.externalApiURL}/api/users/confirm-email/`,
//             null,  // body is null as we're using query params
//             { params: params, responseType: 'text' as 'json' }  // pass params as an option
//         ).pipe(
//             switchMap((response: any) => {
//                 // this.accessToken = response.token
//                 // this._authenticated = true;
//                 return of(response);
//             })
//         );
//     }




//     // signup by ends



// }
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { helperService } from './helper';
import { DataGuardService } from './guards/dataGuard';
import { environment } from 'environment/environment';
import { SignalRService } from 'app/modules/common/services/signalR.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _dataGuard = inject(DataGuardService);
    private _userService = inject(UserService);
    private _helperService = inject(helperService);
    private _signalRService = inject(SignalRService );

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    constructor() {
    }
    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
        // return this._dataGuard.getLocalData('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(user): Observable<any> {
        return this._httpClient.post(`${environment.externalApiURL}/api/tokens/`, user).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }
    // signIn(credentials: { email: string; password: string }): Observable<any> {
    //     // Throw error, if the user is already logged in
    //     if (this._authenticated) {
    //         return throwError('User is already logged in.');
    //     }

    //     return this._httpClient.post('api/auth/sign-in', credentials).pipe(
    //         switchMap((response: any) => {
    //             // Store the access token in the local storage
    //             this.accessToken = response.accessToken;

    //             // Set the authenticated flag to true
    //             this._authenticated = true;

    //             // Store the user on the user service
    //             this._userService.user = response.user;

    //             // Return a new observable with the response
    //             return of(response);
    //         })
    //     );
    // }
    signInWithPassword(user): Observable<any> {
        return this._httpClient.post(`${environment.externalApiURL}/api/tokens`, user).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    // Replace the access token with the new one if it's available on
                    // the response object.
                    //
                    // This is an added optional step for better security. Once you sign
                    // in using the token, you should generate a new one on the server
                    // side and attach it to the response object. Then the following
                    // piece of code can replace the token with the refreshed one.
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                    }

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Disconnect SignalR
        this._signalRService.disconnect();

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }
    GetTinatDetail(DomainName: any): Observable<any> {
        return this._httpClient.get(`${environment.tenantvalidateURl}/api/saas/Tenant/validate-tenant/` + DomainName, {});
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    // check(): Observable<boolean> {
    //     debugger
    //     console.log(this.accessToken,"this.accessToken")
    //     // this.accessToken = this._dataGuard.getLocalData('accessToken')
    //     // this.accessToken = localStorage.getItem('accessToken') ?? '';
    //     let _u = this._helperService.getUserDetail();
    //     // Check if the user is logged in
    //     if (this._authenticated) {
    //         return of(true);
    //     }

    //     // Check the access token availability
    //     if (!this.accessToken) {
    //         return of(false);
    //     }

    //     // Check the access token expire date
    //     if (AuthUtils.isTokenExpired(this.accessToken)) {
    //         return of(false);
    //     }

    //     // If the access token exists, and it didn't expire, sign in using it
    //     return this.signInUsingToken();
    // }
    check(): Observable<boolean> {
        // this.accessToken = this._dataGuard.getLocalData('accessToken')
        // this.accessToken = localStorage.getItem('accessToken') ?? '';
        let _u = this._helperService.getUserDetail();
        if (_u) {
            this._authenticated = true;

        }
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return of(_u ? true : false);
    }
   
    refreshToken(): Observable<any> {
        var request = {
            token: this.accessToken,
            refreshToken: this.getRefreshToken()
        };
        return this._httpClient.post(`${environment.externalApiURL}/api/tokens/refresh`, { ...request }).pipe(
            tap((response) => {
                // console.log('Token Refresh Response:', response);
            }),
            catchError((error) => {
                console.error('Error occurred during refreshToken():', error);
                return throwError(error);
            })
        );
    }
    getRefreshToken(): string {
        return localStorage.getItem('refreshToken') ?? '';
    }
    StudentLogin(user): Observable<any> {
        return this._httpClient.post(`${environment.externalApiURL}/api/users/signin/`, user).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
    }
    sighUpWithEmailAndPhone(user): Observable<any> {

        return this._httpClient.post(`${environment.externalApiURL}/api/users/v2-signup/`, user).pipe(

            switchMap((response: any) => {

                return of(response);
            })
        );
    }
        verifyOtpForPhoneAndEmail(otpRequest): Observable<any> {
        return this._httpClient.post(`${environment.externalApiURL}/api/users/v2-verifyotp/`, otpRequest).pipe(
            switchMap((response: any) => {
                this.accessToken = response.token
                this._authenticated = true;
                return of(response);
            })
        );
    }
    verifyOtp(user): Observable<any> {
                return this._httpClient.post(`${environment.externalApiURL}/api/users/verifyotp/`, user).pipe(
                    switchMap((response: any) => {
                        this.accessToken = response.token
                        this._authenticated = true;
                        return of(response);
                    })
                );
            }
}
