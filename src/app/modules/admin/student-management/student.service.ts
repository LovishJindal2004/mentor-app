import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "environment/environment";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class StudentService {
    
    onStudentManagementChanged: BehaviorSubject<any>;
    onAssignBulkStudent: BehaviorSubject<any>;
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
        this.onAssignBulkStudent = new BehaviorSubject([]);
     }

    getStudentList(data) {
        return new Promise((resolve, reject) => {
            this._https.post(`${environment.externalApiURL}/api/users/list-by-role?rolename=Mentee`, {...data}).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    getUserDetailsbyId(id) {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.externalApiURL}/api/users/${id}`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    createUser(user: any): Promise<any> {
        var self = this;
        // const headers = new HttpHeaders({
        //     'ApiKey': environment.apiKey,
        //     'tenant': user.tenantId
        // });
        return new Promise((resolve, reject) => {

            this._https.post(`${environment.externalApiURL}/api/users/mentee-register`, { ...user },{ responseType: 'text' })
                .subscribe((response: any) => {
                    this.openSnackBar(response + '..', "Close");
                    resolve(response);
                }, reject);
        });
    }
    updateUser(user: any): Promise<any> {
        return new Promise((resolve, reject) => {

            this._https.post(`${environment.externalApiURL}/api/users/update`, { ...user })
                .subscribe(response => {
                    resolve(response);
                    if (response) {
                        this.onStudentManagementChanged.next('');
                        this.openSnackBar("Successfully updated.", "Close");
                    }
                    else {
                        this.openSnackBar("Failed", "Close");
                    }

                }, reject);
        });
    }
    deleteUser(user: any): Promise<any> {
        return new Promise(() => {
            const params = new HttpParams().set('UserID', user.id);
            this._https.delete(`${environment.externalApiURL}/api/users/delete`, { ...params }, )
                .subscribe(response => {
                    if (response) {
                        this.onStudentManagementChanged.next('');
                        this.openSnackBar("Successfully removed.", "Close");
                    }
                    else {
                        this.openSnackBar("Failed", "Close");
                    }
                });
        });
    }
    getAssignedStudentList(data,mentorId) {
        return new Promise((resolve, reject) => {
            this._https.post(`${environment.externalApiURL}/api/v1/mentor/mentee?MentorGuid=${mentorId}`, {...data}).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    assignedMentortoStudent(data) {
        return new Promise((resolve, reject) => {
          this._https.post(`${environment.externalApiURL}/api/v1/mentor/bulk-assign`, data).subscribe(
            (response: any) => {
              resolve(response);
            },
            reject
          );
        });
      }
      unassignedStudent(mentorId, menteeId) {
        return new Promise((resolve, reject) => {
          this._https.delete(`${environment.externalApiURL}/api/v1/mentor/${mentorId}/mentee/${menteeId}`).subscribe(
            (response: any) => {
              resolve(response);
            },
            reject
          );
        });
      }
      assignedCourse(data) {
        return new Promise((resolve, reject) => {
          this._https.post(`${environment.apiURL}/mentee/assign-mentee-courses`,{...data}).subscribe(
            (response: any) => {
              resolve(response);
            },
            reject
          );
        });
      }
}