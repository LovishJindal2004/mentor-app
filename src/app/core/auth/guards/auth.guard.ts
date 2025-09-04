// import { inject } from '@angular/core';
// import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
// import { AuthService } from 'app/core/auth/auth.service';
// import { of, switchMap } from 'rxjs';

// export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
//     const router: Router = inject(Router);

//     // Check the authentication status
//     return inject(AuthService)
//         .check()
//         .pipe(
//             switchMap((authenticated) => {
//                 // If the user is not authenticated...
//                 if (!authenticated) {
//                     // Redirect to the sign-in page with a redirectUrl param
//                     const redirectURL =
//                         state.url === '/sign-out'
//                             ? ''
//                             : `redirectURL=${state.url}`;
//                     const urlTree = router.parseUrl(`sign-in?${redirectURL}`);

//                     return of(urlTree);
//                 }

//                 // Allow the access
//                 return of(true);
//             })
//         );
// };
import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, CanLoadFn, Router, UrlSegment } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { helperService } from '../helper';
import { defaultNavigation } from 'app/mock-api/common/navigation/data';
import { Observable, of, switchMap } from 'rxjs';
import { User } from 'app/core/user/user.types';

// Helper class to maintain state and shared logic
class AuthGuardHelper {
    private router: Router = inject(Router);
    private authService: AuthService = inject(AuthService);
    private helperService: helperService = inject(helperService);
    private navigation = defaultNavigation;
    private isUserAuthenticated: boolean = false;
    private roleId: User;

    check(redirectURL: string, url: string): Observable<boolean> {
        const baseUrl = url.split('?')[0];
        return this.authService.check().pipe(
            switchMap((authenticated) => {
                if (!authenticated) {
                    this.router.navigate(['sign-in'], { queryParams: { redirectURL } });
                    return of(false);
                }
                // debugger
                this.roleId = this.helperService.getUserDetail();
                if (this.roleId == null) {
                    this.router.navigate(['/sign-out']);
                }
                this.isUserAuthenticated = false;
                // Check route permissions
                this.navigation.forEach(route => {
                    if (route.link === baseUrl && route.roles.includes(this.roleId.Roles)) {
                        this.isUserAuthenticated = true;
                        return true;

                    } else if (route.children) {
                        this.checkRouteChildren(route.children, baseUrl);
                    }
                });
                // const activatedRoute = this.findActivatedRoute(baseUrl, this.navigation);
                // if (activatedRoute && activatedRoute.roles.includes(this.roleId.Roles)) {
                //     return of(true);
                // }


                // Special case for sign-out
                if (baseUrl === '/sign-out') {
                    return of(true);
                }

                if (!this.isUserAuthenticated) {
                    this.router.navigate(['/sign-out']);
                }

                return of(this.isUserAuthenticated);
            })
        );
    }
    private findActivatedRoute(currentUrl: string, routes: any[]): any | null {
        for (const route of routes) {
            if (route.link === currentUrl) {
                return route;
            }

            if (route.children?.length > 0) {
                const foundChild = this.findActivatedRoute(currentUrl, route.children);
                if (foundChild) {
                    return foundChild;
                }
            }
        }
        return null;
    }


    private checkRouteChildren(children: any[], currentUrl: string): boolean {
        for (const child of children) {
            if (child.link === currentUrl && child.roles.includes(this.roleId.Roles)) {
                this.isUserAuthenticated = true;
                return true;
            }
            else {
                return true;
            }

            // if (child.children?.length > 0) {
            //     this.checkRouteChildren(child.children, currentUrl);
            // }
        }
        return this.isUserAuthenticated;
    }

    buildFullPath(route: any): string {
        let parentPath = '';
        const childPath = route.routeConfig?.path || '';

        if (route.parent?.url.length > 0) {
            parentPath = route.parent.url.map(url => url.path).join('/') + '/';
        }

        let fullPath = `/${parentPath}${childPath}`;
        return fullPath.endsWith('/') ? fullPath.slice(0, -1) : fullPath;
    }
}

export const AuthGuard: CanActivateFn = (route, state) => {
    let ChildQueryparams: any;
    const helper = new AuthGuardHelper();
    // console.log(route.parent,"route")
    // Allow access to empty path
    if (route.routeConfig?.path === '') {
        return true;
    }
    else {
        let parentPath = '';
        let childPath;
        let fullPath
        if (route.parent.url.length > 0) {
            route.parent.url.forEach(url => {
                parentPath += url.path + "/";
            })
        }
        childPath = route.routeConfig.path;
        if (route.routeConfig?.path.length > 0) {
            fullPath = `/${parentPath}${childPath}`;
            if (fullPath.endsWith('/')) {
                fullPath = fullPath.slice(0, -1);
            }
            ChildQueryparams = route.params;
            const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
            return helper.check(redirectUrl, fullPath);
        }
    }



};

export const ChildAuthGuard: CanActivateChildFn = (childRoute, state) => {
    // const helper = new AuthGuardHelper();
    // const fullPath = helper.buildFullPath(childRoute);
    // const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
    // return helper.check(redirectUrl, fullPath);
    return true;
};

export const LoadGuard: CanLoadFn = (route, segments: UrlSegment[]) => {
    const helper = new AuthGuardHelper();
    return helper.check('/', '');
};