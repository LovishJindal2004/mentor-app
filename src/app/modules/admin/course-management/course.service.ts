import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Resolve } from "@angular/router";
import { User } from "app/core/user/user.types";
import { Course, GridFilter } from "app/modules/common/models/Common.model";
import { environment } from "environment/environment";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    
    onCourseChanged: BehaviorSubject<any>;
    onCourseUserPermissionChanged: BehaviorSubject<any>;
    openSnackBar(message: string, action: string) {
        this._matSnockbar.open(message, action, {
            duration: 2000,
        });
    }

    constructor(
        private _httpClient: HttpClient,
        private _matSnockbar: MatSnackBar
    ) {
        // Set the defaults
        this.onCourseChanged = new BehaviorSubject([]);
        this.onCourseUserPermissionChanged = new BehaviorSubject([]);
    }
    getCourseForGrid(_gridFilter: GridFilter): Observable<any> {

        return this._httpClient.post(`${environment.apiURL}/course/courses`, { ..._gridFilter });
    }
    deleteCourse(course): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.delete(`${environment.apiURL}/course/delete-course/` + course.CourseID, {})
                .subscribe(response => {
                    if (response) {
                        this.onCourseChanged.next('');
                        this.openSnackBar("Successfully removed.", "Close");
                    }
                    else {
                        this.openSnackBar("Failed", "Close");
                    }
                });
        });
    }
    createCourse(course: any): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.post(`${environment.apiURL}/course/create-courses/`, { ...course })
                .subscribe(response => {
                    if (response) {
                        resolve(response);
                        this.onCourseChanged.next('');
                        this.openSnackBar("Successfully added.", "Close");
                    }
                    else {
                        this.openSnackBar("Failed", "Close");
                    }
                });
        });
    }
    updateCourse(course: any): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.post(`${environment.apiURL}/course/update-courses/`, { ...course })
                .subscribe(response => {
                    resolve(response);
                    if (response) {
                        this.onCourseChanged.next('');
                        this.openSnackBar("Successfully updated.", "Close");
                    }
                    else {
                        this.openSnackBar("Failed", "Close");
                    }
                });
        });
    }
    getCourseById(id: number): Observable<Course> {
        return this._httpClient.get<Course>(`${environment.apiURL}/course/course/` + id);
    }
    getCourseUserPermissionForGrid(_gridFilter: any, courseId: any): Observable<any> {
        return this._httpClient.post(`${environment.apiURL}/course/get-users-by-course-role?rolename=${_gridFilter.rolename}&pagenumber=${_gridFilter.pageNumber}&pagesize=${_gridFilter.pageSize}&courseId=${_gridFilter.courseId}` , {  });
    }
    createCourseUserPermission(user: any): Promise<any> {
        const headers = new HttpHeaders({
           'ApiKey': environment.apiKey
        });
        return new Promise((resolve, reject) => {

            this._httpClient.post(`${environment.apiKey}/api/v1/admin/users/map-user-course`, { ...user },{headers})
                .subscribe(response => {
                    if (response) {
                        this.onCourseUserPermissionChanged.next('');
                        this.openSnackBar("Successfully added.", "Close");
                    }
                    else {
                        this.openSnackBar("Failed", "Close");
                    }
                });
        });
    }
    getUserBySearch(search: string): Promise<User[]> {
        const headers = new HttpHeaders({
            'ApiKey': environment.apiKey
        });
        return new Promise((resolve, reject) => {

            this._httpClient.post(`${environment.apiKey}/api/v1/admin/users/search?search=${encodeURIComponent(search)}`,{}, {headers})
                .subscribe((response: any) => {

                    // this.user = response;

                    resolve(response);
                }, reject);
        }
        );
    }
    deleteCourseUserPermission(user): Promise<any> {
        const headers = new HttpHeaders({
           'ApiKey': environment.apiKey
        });
        return new Promise((resolve, reject) => {

            this._httpClient.post(`${environment.apiKey}/api/v1/admin/users/map-user-course`, { ...user },{headers})
                .subscribe(response => {
                    if (response) {
                        this.onCourseUserPermissionChanged.next('');
                        this.openSnackBar("Successfully removed.", "Close");
                    }
                    else {
                        this.openSnackBar("Failed", "Close");
                    }
                });
        });
    }

}