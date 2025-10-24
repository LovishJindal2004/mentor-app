import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { DataGuardService } from './dataGuard';
import { helperService } from '../helper';

@Injectable({
    providedIn: 'root'
})
export class CourseGuard implements CanActivate {
    userDetails: any;
    openSnackBar(message: string, action: string) {
        this._matSnockbar.open(message, action, {
            duration: 2000,
        });
    }
    Message: string;
    constructor(
        private _datgurd: DataGuardService,
        private route: Router,
        private _matSnockbar: MatSnackBar,
        private _navigationMockApi: NavigationMockApi,
        private http: HttpClient,
        private authService: AuthService,
        private _helperService: helperService,
        private activateroute: ActivatedRoute) {

    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const courseId = this._datgurd.getCourseId();
        // console.log(courseId)
        return this.checkUserValidity(courseId, state.url);
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const courseId = this._datgurd.getCourseId();
        // console.log(courseId)
        return this.checkUserValidity(courseId, state.url);

    }
    checkUserValidity(courseId: any, url): Observable<boolean | UrlTree> {
        // console.log(courseId)
        if (courseId == 'ece83790-e799-11ef-b810-02419699f700') {
            this._navigationMockApi.registerHandlers();
        }
        if (courseId) {
            return of(true);
        } else {
            // console.log("not found ")
            // Redirect to '/course/list/course-list' if courseId is null
            // or emit false if you don't want to redirect
            if (this._helperService.getUserDetail()?.Roles == 'Mentee') {
                this.route.navigate(['/all-course'])
                return of(false);
            }
            // Alternatively, you can return of(false) if you just want to emit false without redirecting
        }
    }


}
