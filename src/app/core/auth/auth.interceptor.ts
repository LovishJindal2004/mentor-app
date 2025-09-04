import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { CommanService } from 'app/modules/common/services/common.service';
import { Observable, catchError, throwError } from 'rxjs';
import { DataGuardService } from './guards/dataGuard';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const _CommanService = inject(CommanService);
    const dataService = inject(DataGuardService);
    let tenantid = '';

    _CommanService.getTenantDetails.subscribe((TenantInfo: any) => {
        tenantid = TenantInfo.Id;
    });
    // Clone the request object
    let token = dataService.getLocalData('accessToken')
    let cleanedtoken = token?.replace(/^"|"$/g, '');
    let newReq = req.clone();

    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    newReq = req.clone({
        headers: req.headers.set('DeviceId',"WEB")
                            .set('tenant', tenantid)
                            .set('DeviceName', "WEB")
                            .set('Authorization', 'Bearer ' + cleanedtoken)
    });
    // if (
    //     authService.accessToken &&
    //     !AuthUtils.isTokenExpired(authService.accessToken)
    // ) {
    //     newReq = req.clone({
    //         headers: req.headers.set(
    //             'Authorization',
    //             'Bearer ' + authService.accessToken
    //         ),
    //     });
    // }

    // Response
    return next(newReq).pipe(
        catchError((error) => {
            // Catch "401 Unauthorized" responses
            if (error instanceof HttpErrorResponse && error.status === 401 && !newReq.url.includes('users/signin')
                &&
                (
                    (!newReq.url.includes('api/tokens'))
                    ||
                    (newReq.url.includes('api/tokens/refresh'))

                )
            ) {
                if (newReq.url.includes('api/tokens')) {
                    authService.signOut();
                    location.reload();
                }
            }

            return throwError(error);
        })
    );
};
