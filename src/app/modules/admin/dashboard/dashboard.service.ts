import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "environment/environment";
import { BehaviorSubject, catchError, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DashBoardService {
    
    onStudentManagementChanged: BehaviorSubject<any>;
    openSnackBar(message: string, action: string) {
        this._matSnockbar.open(message, action, {
            duration: 2000,
        });
    }
    constructor(
        private _https: HttpClient,
        private _matSnockbar: MatSnackBar
    ) {
        this.onStudentManagementChanged = new BehaviorSubject([]);
     }
      getStudentReport(userId) {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.externalApiURL}/api/v1/analytic/mentee-today-activity?menteeId=${userId}`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
}