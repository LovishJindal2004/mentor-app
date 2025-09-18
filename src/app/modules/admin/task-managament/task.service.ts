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
    onAssignedStudentManagementChanged: BehaviorSubject<any>;
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
        this.onAssignedStudentManagementChanged = new BehaviorSubject([]);
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
    getTestExams(testType, categoryName) {
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
            this._https.post(`${environment.externalApiURL}/api/task/create-task`, { ...data }).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    updateTask(data) {
        return new Promise((resolve, reject) => {
            this._https.post(`${environment.externalApiURL}/api/task/update-task`, { ...data }).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    updateTaskDescription(data) {
        return new Promise((resolve, reject) => {
            this._https.post(`${environment.externalApiURL}/api/task/update-task-description`, { ...data }).subscribe((response: any) => {
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
    getTaskDetails(guid) {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.externalApiURL}/api/task/get-task-details/${guid}`).subscribe((response: any) => {
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
    updateTaskOrder(data) {
        return new Promise((resolve, reject) => {
            this._https.post(`${environment.externalApiURL}/api/task/reorder`, { ...data }).subscribe((response: any) => {
                this.onTasksChanged.next(response);
                resolve(response);
            }, reject);
        })
    };
    // getAssignedTaskList(data) {

    //     return new Promise((resolve, reject) => {
    //         this._https.post(`${environment.externalApiURL}/api/task/list`, data).subscribe((response: any) => {
    //             this.onTasksChanged.next(response);
    //             resolve(response);
    //         }, reject);
    //     });

    // }

    getAssignedTaskList(data, status?: number) {
        const payload = { ...data };
        if (status !== undefined) {
            payload.status = status; // Add status filter
        }

        return new Promise((resolve, reject) => {
            this._https.post(`${environment.externalApiURL}/api/task/list`, payload).subscribe((response: any) => {
                this.onTasksChanged.next(response);
                resolve(response);
            }, reject);
        });
    }

    status() {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.apiURL}/common/status`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    getComments(data, taskId) {
        return this._https.post(`${environment.apiURL}/comment/comment-list?taskguid=${taskId}`, { ...data }).toPromise();
    }

    createComment(data) {
        return this._https.post(`${environment.apiURL}/comment/create-comment`, { ...data }).toPromise();
    }

    updateComment(data) {
        return this._https.post(`${environment.apiURL}/comment/update-comment`, { ...data }).toPromise();
    }

    deleteComment(commentId: string) {
        return this._https.get(`${environment.apiURL}/comment/delete-comment?commentGuid=${commentId}`).toPromise();
    }

    // createTask(taskData: any) {
    //     return new Promise((resolve, reject) => {
    //         this._https.post(`${environment.externalApiURL}/api/task/create-task`, taskData).subscribe((response: any) => {
    //             resolve(response);
    //         }, reject);
    //     });
    // }


    deleteTask(taskId: string) {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.externalApiURL}/api/task/delete-task?taskguid=${taskId}`, {}).subscribe((response: any) => {
                resolve(response);
            }, reject);
        });
    }
    getAssignedStudentList(mentorId) {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.externalApiURL}/api/task/assigned-task-students?taskguid=${mentorId}`, {}).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };
    getReport(taskId,mentorId) {
        return new Promise((resolve, reject) => {
            this._https.get(`${environment.externalApiURL}/api/task/task/${taskId}/mentee/${mentorId}/activity`, {}).subscribe((response: any) => {
                resolve(response);
            }, reject);
        })
    };


    // updateTask(taskId: string, taskData: any) {
    //     return new Promise((resolve, reject) => {
    //         this._https.put(`${environment.externalApiURL}/api/task/update/${taskId}`, taskData).subscribe((response: any) => {
    //             resolve(response);
    //         }, reject);
    //     });
    // }
}