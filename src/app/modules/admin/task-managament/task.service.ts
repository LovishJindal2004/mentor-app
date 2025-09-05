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
    getVideoSubjects() {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.apiURL}/video/subjects`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    getVideoTopics(subjectId) {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.apiURL}/video/topics?SubjectId=${subjectId}`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    getVideos(topicid) {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.apiURL}/video/topic-video?topicId=${topicid}`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };

    // Task Management API Methods
    getAssignedTaskList(params?: any) {
        // Default pagination and sorting parameters if not provided
        const defaultParams = {
            pageNumber: 1,
            pageSize: 10,
            orderBy: "",
            sortOrder: "",
            advancedSearch: {
                fields: [],
                keyword: "",
                advancedFilter: {
                    fields: [],
                    operator: "",
                    value: ""
                },
                filter: ""
            }
        };
        
        // Merge default parameters with provided parameters
        const requestParams = { ...defaultParams, ...params };
        
        return new Promise((resolve, reject) => {
            this._https.post(`${environment.externalApiURL}/api/task/list`, requestParams).subscribe((response: any) => {
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