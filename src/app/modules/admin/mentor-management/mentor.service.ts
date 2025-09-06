import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "environment/environment";
import { BehaviorSubject, catchError, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class MentorService {
    
    onMentorManagementChanged: BehaviorSubject<any>;
    openSnackBar(message: string, action: string) {
        this._matSnockbar.open(message, action, {
            duration: 2000,
        });
    }
    constructor(
        private _https: HttpClient,
        private _matSnockbar: MatSnackBar
    ) {
        this.onMentorManagementChanged = new BehaviorSubject([]);
     }

    getMentorList(data) {
        return new Promise((resolve, reject) => {
            this._https.post(`${environment.externalApiURL}/api/users/list-by-role?rolename=Mentor`, {...data}).subscribe((response: any) => {
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
  createUser(user: any) {
    return this._https.post(`${environment.externalApiURL}/api/users`, { ...user }, { responseType: 'text' }).pipe(
      tap((response: any) => {
        console.log(response, "response")
        this.openSnackBar(response?.message || 'User created successfully', 'Close');
        console.log(response);
      }),
      catchError(error => {
        let errorData: any = error?.error;

        // If it's a string, parse it
        if (typeof errorData === 'string') {
          try {
            errorData = JSON.parse(errorData);
          } catch {
            errorData = { message: errorData }; // fallback
          }
        }

        const errorMsg = Array.isArray(errorData?.messages)
          ? errorData.messages.join('\n')
          : (errorData?.message || 'Failed to create user');

        this.openSnackBar(errorMsg, 'Close');
        throw error;
      })
    );
  }
    updateUser(user: any): Promise<any> {
        return new Promise((resolve, reject) => {

            this._https.post(`${environment.externalApiURL}/api/users/update`, { ...user })
                .subscribe(response => {
                    resolve(response);
                    if (response) {
                        this.onMentorManagementChanged.next('');
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
                        this.onMentorManagementChanged.next('');
                        this.openSnackBar("Successfully removed.", "Close");
                    }
                    else {
                        this.openSnackBar("Failed", "Close");
                    }
                });
        });
    }
    assignedMentortoStudent(mentorId, menteeId) {
        return new Promise((resolve, reject) => {
          this._https.post(`${environment.externalApiURL}/api/v1/mentor/${mentorId}/mentee/${menteeId}`,{}).subscribe(
            (response: any) => {
              resolve(response);
            },
            reject
          );
        });
      }
      assignedCourse(data) {
        return new Promise((resolve, reject) => {
          this._https.post(`${environment.apiURL}/mentor/assign-mentor-courses`,{...data}).subscribe(
            (response: any) => {
              resolve(response);
            },
            reject
          );
        });
      }
}