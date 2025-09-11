import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "environment/environment";
import { BehaviorSubject, catchError, tap } from "rxjs";

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
      this._https.post(`${environment.externalApiURL}/api/users/list-by-role?rolename=Mentee`, { ...data }).subscribe((response: any) => {
        resolve(response);
      }, reject);
    })
  };
  getUnAssignedStudentList(data) {
    return new Promise((resolve, reject) => {
      this._https.post(`${environment.externalApiURL}/api/v1/mentee/unassigned?rolename=Mentee`, { ...data }).subscribe((response: any) => {
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
    var self = this;
    // const headers = new HttpHeaders({
    //     'ApiKey': environment.apiKey,
    //     'tenant': user.tenantId
    // });
    return this._https.post(`${environment.externalApiURL}/api/users/mentee-register`, { ...user }, { responseType: 'text' })
      .pipe(
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
        }))
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
      this._https.delete(`${environment.externalApiURL}/api/users/delete`, { ...params },)
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
  getAssignedStudentList(data, mentorId) {
    return new Promise((resolve, reject) => {
      this._https.post(`${environment.externalApiURL}/api/v1/mentor/mentee?MentorGuid=${mentorId}`, { ...data }).subscribe((response: any) => {
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
      this._https.get(`${environment.externalApiURL}/api/v1/mentor/${mentorId}/mentee/${menteeId}`).subscribe(
        (response: any) => {
          resolve(response);
        },
        reject
      );
    });
  }
  assignedCourse(data) {
    return new Promise((resolve, reject) => {
      this._https.post(`${environment.apiURL}/mentee/assign-mentee-courses`, { ...data }).subscribe(
        (response: any) => {
          resolve(response);
        },
        reject
      );
    });
  }
  getStudentReport(userId) {
    return new Promise((resolve, reject) => {
      this._https.get(`${environment.externalApiURL}/api/v1/analytic/mentee-today-activity?menteeId=${userId}`).subscribe((response: any) => {
        resolve(response);
      }, reject);
    })
  };
  getVideoSubjects(userId) {
    return new Promise((resolve, reject) => {
      this._https.get(`${environment.apiURL}/analytic/video-subjects?menteeId=${userId}`).subscribe((response: any) => {
        resolve(response);
      }, reject);
    })
  };
  getVideos(subjectId,userId,date) {
    return new Promise((resolve, reject) => {
      this._https.get(`${environment.apiURL}/analytic/video-topics?subjectId=${subjectId}&menteeId=${userId}&date=${date}`).subscribe((response: any) => {
        resolve(response);
      }, reject);
    })
  };

  getQBankSubjects(userId) {
    return new Promise((resolve, reject) => {
      this._https.get(`${environment.apiURL}/analytic/qbank-subjects?menteeId=${userId}`).subscribe((response: any) => {
        resolve(response);
      }, reject);
    })
  };
  getQBankExams(subject, userId, date) {
    return new Promise((resolve, reject) => {
      this._https.get(`${environment.apiURL}/analytic/qbank-topics/${subject}?menteeId=${userId}&date=${date}`).subscribe((response: any) => {
        resolve(response);
      }, reject);
    })
  };
  getTestExamTypes(userId) {
    return new Promise((resolve, reject) => {
      this._https.get(`${environment.apiURL}/analytic/test-categories?menteeId=${userId}`).subscribe((response: any) => {
        resolve(response);
      }, reject);
    })
  };
  getTestExams(testType, categoryName, userId, date) {
    return new Promise((resolve, reject) => {
      this._https.get(`${environment.apiURL}/analytic/test-list?testType=${testType}&categoryName=${categoryName}&menteeId=${userId}&date=${date}`).subscribe((response: any) => {
        resolve(response);
      }, reject);
    })
  };
}