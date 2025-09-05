import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "environment/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class TaskService {
    
    onStudentManagementChanged: BehaviorSubject<any>;
    onTasksChanged: BehaviorSubject<any>;
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
        this.onTasksChanged = new BehaviorSubject([]);
     }

    getQBankSubjects() {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.apiURL}/qbank/subjects`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    getQBankExams(subject) {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.apiURL}/qbank/topics/${subject}`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    getTestExamTypes() {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.apiURL}/test/categories`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    getTestExams(testType,categoryName) {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.apiURL}/test/list?testType=${testType}&categoryName=${categoryName}`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    getVideoSubjects() {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.apiURL}/video/subjects`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    // getVideoTopics(subjectId) {
    //     return new Promise((resolve, reject) => {
    //         this._https.get(`${environment.apiURL}/video/topics?SubjectId=${subjectId}`).subscribe((response: any) => {
    //             resolve(response);
    //         }, reject);
    //     })
    // };
    getVideos(subjectId) {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.apiURL}/video/topics?subjectId=${subjectId}`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    createTask(data) {
        return new Promise((resolve, reject) => {
            this._https.post(`${environment.externalApiURL}/api/task/create-task`,{...data}).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    updateTask(data) {
        return new Promise((resolve, reject) => {
            this._https.post(`${environment.externalApiURL}/api/task/update-task`,{...data}).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    getTask(guid) {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.externalApiURL}/api/task/get-task/${guid}`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    updateTaskStatus(taskid, status) {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.externalApiURL}/api/task/update-task-staus?tasks=${taskid}&status=${status}`).subscribe((response: any) => {
                this.onTasksChanged.next(response);
                resolve(response);
            }, reject);
        })
    };
    getAssignedTaskList(data) {
        // Default pagination and sorting parameters if not provided
        
        // Merge default parameters with provided parameters
        
        return new Promise((resolve, reject) => {
            this._https.post(`${environment.externalApiURL}/api/task/list`, data).subscribe((response: any) => {
                this.onTasksChanged.next(response);
                resolve(response);
            }, reject);
        });

    }

    // createTask(taskData: any) {
    //     return new Promise((resolve, reject) => {
    //         this._https.post(`${environment.externalApiURL}/api/task/create-task`, taskData).subscribe((response: any) => {
    //             resolve(response);
    //         }, reject);
    //     });
    // }

    // deleteTask(taskId: string) {
    //     return new Promise((resolve, reject) => {
    //         this._https.post(`${environment.externalApiURL}/api/task/delete-task?taskguid=${taskId}`, {}).subscribe((response: any) => {
    //             resolve(response);
    //         }, reject);
    //     });
    // }

    
    // updateTask(taskId: string, taskData: any) {
    //     return new Promise((resolve, reject) => {
    //         this._https.put(`${environment.externalApiURL}/api/task/update/${taskId}`, taskData).subscribe((response: any) => {
    //             resolve(response);
    //         }, reject);
    //     });
    // }
}