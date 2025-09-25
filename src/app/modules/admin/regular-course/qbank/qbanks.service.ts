import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environment/environment';

@Injectable({
  providedIn: 'root'
})
export class QBankService {

  private userCourse: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public userCourse$: Observable<string> = this.userCourse.asObservable();

  constructor(private _httpClient: HttpClient) {

  }
  setUserCourseId(values: any): void {
    this.userCourse.next(values);
  }
  getQbanksubjectsbyCourseId(courseId): Observable<any> {
    // let params = new HttpParams();
    // params = params.append('CourseId', courseId.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/qbank/subjects`, {  })
  }
  getQbanksubjects(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/qbank/subjects`, {  })
  }

  getQbnkTopicExamList(subjectId, CourseId,): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseId', CourseId);
    return this._httpClient.get<any>(`${environment.apiURL}/qbank/topics/${subjectId}?${params}`)
  }
  getQbankExamResult(examId, courseId) {
    let params = new HttpParams();
    params = params.append('examid', examId);
    params = params.append('courseId', courseId);
    return this._httpClient.get<any>(`${environment.apiURL}/qbank/result?${params}`)
  }

  getQbankExamDetail(examId, courseId) {
    let params = new HttpParams();
    params = params.append('examid', examId);
    params = params.append('courseId', courseId);
    return this._httpClient.get<any>(`${environment.apiURL}/qbank/get-exam-details/${examId}?${params}`)
  }
  getQbankExamQuestion(CourseId, Examid,isTimerEnabled): Observable<any> {
    let params = new HttpParams();
    params = params.append('CourseId', CourseId.toString());
    params = params.append('Examid', Examid.toString());
    params = params.append('isTimerEnabled', isTimerEnabled.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/qbank/questions`, { params })
  }
  getQbnkquestionDetailById(QuestionDetailId, Examid) {
    return this._httpClient.get<any>(`${environment.apiURL}/qbank/question/${QuestionDetailId}/${Examid}`,)
  }
  getAnsweersheetQbnkquestionDetailById(QuestionDetailId) {
    return this._httpClient.get<any>(`${environment.apiURL}/qbank/question/${QuestionDetailId}`,)
  }
  getQbnkAnswersheet(CourseId, Examid) {
    let params = new HttpParams();
    params = params.append('examid', Examid.toString());
    params = params.append('courseId', CourseId.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/qbank/answersheet`, { params })
  }

  submitQuestion(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/qbank/submit-question/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  finishExam(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/qbank/submit-exam/`, { ...request })
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
    return this._httpClient.post<any>(`${environment.apiURL}/qbank/bookmark`, null, { params })
  }
  getBookmarkCount(): Observable<any>{
    return this._httpClient.get<any>(`${environment.apiURL}/qbank/bookmark/count`)
  }
  getBookmarkSubjcetWise(): Observable<any>{
    return this._httpClient.get<any>(`${environment.apiURL}/qbank/bookmark/subjects`)
  }
  getBookmarkQbnkQuestionList(subjectId,pageNumber,Pagesize): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/qbank/bookmark/subject/${subjectId}/questions?pageNumber=${pageNumber}&pageSize=${Pagesize}`)
  }
  getBookmarkQbnkQuestionDetails(subjectId,pageNumber,Pagesize): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/qbank/bookmark/subject/${subjectId}/questionswithdetail?pageNumber=${pageNumber}&pageSize=${Pagesize}`)
  }
  getDayWiseQbankCompletedByMonth(request) {
    let params = new HttpParams();
    params = params.append('year', request.year.toString());
    params = params.append('month', request.month.toString());


    return this._httpClient.get<any>(`${environment.apiURL}/qbank/monthwise/analytics`, { params });
  }
}