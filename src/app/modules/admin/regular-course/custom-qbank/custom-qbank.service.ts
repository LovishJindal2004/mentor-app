import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomQBankService {
 CQBankList: BehaviorSubject<any>;
  private userCourse: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public userCourse$: Observable<string> = this.userCourse.asObservable();

  constructor(private _httpClient: HttpClient) {
    this.CQBankList = new BehaviorSubject([]);
  }
  getCustomQbankSubject(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/cmcq/getsubject`, {  })
  }
  getTags(modulename: string): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/get-tags/${modulename}`, {  })
  }
  DeleteCQBank(id: string): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/cmcq/delete/${id}`, {  })
  }
  getLevelofQuestion(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/get-qbanklevelquestions`, {  })
  }
  getCustomQBankDetails(id): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/cmcq/getbyid/${id}`, {  })
  }
  assignCustomQBankDetails(id): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/cmcq/assign/${id}`, {  })
  }
  getCustomQbankList(courseId): Observable<any> {
    return this._httpClient.post<any>(`${environment.apiURL}/cmcq/list?courseId=` + courseId, {  })
  }
  getAnsweersheetQbnkquestionDetailById(QuestionDetailId) {
    return this._httpClient.get<any>(`${environment.apiURL}/cmcq/question/${QuestionDetailId}`,)
  }
  getQbnkAnswersheet(CourseId, Examid) {
    let params = new HttpParams();
    params = params.append('examid', Examid.toString());
    params = params.append('courseId', CourseId.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/cmcq/answersheet`, { params })
  }
  createExam(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/cmcq/create/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  reportQuestion(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/common/create-question-bug-report/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  BookmarkQbnkQuestion(request: any): Observable<any> {
    const params = new HttpParams()
      .set('examid', request.examid.toString())
      .set('courseId', request.courseId.toString())
      .set('questionId', request.questionId.toString())
      .set('IsBookMark', request.IsBookMark)
    return this._httpClient.post<any>(`${environment.apiURL}/cmcq/bookmark`, null, { params })
  }
  getQbankExamResult(examId, courseId) {
    let params = new HttpParams();
    params = params.append('examid', examId);
    params = params.append('courseId', courseId);
    return this._httpClient.get<any>(`${environment.apiURL}/cmcq/exam-result?${params}`)
  }
  getQbankExamQuestion(CourseId, Examid,isTimerEnabled): Observable<any> {
    let params = new HttpParams();
    params = params.append('CourseId', CourseId.toString());
    params = params.append('Examid', Examid.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/cmcq/examquestions`, { params })
  }
  submitQuestion(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/cmcq/submit-question/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  finishExam(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/cmcq/submit-exam/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getQbnkquestionDetailById(QuestionDetailId, Examid) {
    return this._httpClient.get<any>(`${environment.apiURL}/cmcq/question/${QuestionDetailId}/${Examid}`,)
  }
}