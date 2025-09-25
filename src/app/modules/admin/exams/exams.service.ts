import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamService {


  constructor(private _httpClient: HttpClient) { }
  getPYQExamType(CourseId, Examid): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseId', CourseId.toString());
    params = params.append('testType', Examid.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/test/pyq/test-types`, { params })
  }
  getPYQYears(CourseId, testType, pyqExamType): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseId', CourseId.toString());
    params = params.append('testType', testType.toString());
    params = params.append('pyqExamType', pyqExamType.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/test/pyq/test-type/years`, { params })
  }
  getPYQSubjects(CourseId, testType, pyqExamType): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseId', CourseId.toString());
    params = params.append('testType', testType.toString());
    // params = params.append('pyqExamType', pyqExamType.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/test/pyq/subjects`, { params })
  }
  getPYQSubjectYears(CourseId, testType, pyqExamType,subjectName): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseId', CourseId.toString());
    params = params.append('testType', testType.toString());
    params = params.append('pyqExamType', pyqExamType);
    params = params.append('subjectName', subjectName.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/test/pyq/test-type/subject/years`, { params })
  }
  getsigleExam(taskId, Examid): Observable<any> {
    let params = new HttpParams();
    params = params.append('taskId', taskId.toString());
    params = params.append('testId', Examid.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/test/questions`, { params })
  }
  submitQuestion(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/test/submit-question/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  partWisesubmitQuestion(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/test/v2-submit-question/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  finishCBTExam(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/test/submit-test/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  finishExam(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/test/submit-test/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getpartWiseQuestion(CourseId, Examid,partId): Observable<any> {
    let params = new HttpParams();
    params = params.append('CourseId', CourseId.toString());
    params = params.append('testId', Examid.toString());
    params = params.append('partId', partId);
    return this._httpClient.get<any>(`${environment.apiURL}/test/v2-questions`, { params })
  }
  SubmitPart(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/test/submit-part/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getreport(testId,courseId): Observable<any> {
    let params = new HttpParams();
    params = params.append('testId', testId.toString());
    params = params.append('courseId', courseId.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/test/test-report`, { params })
  }
  getpredefineExamResult(examid, taskId): Observable<any> {
    let params = new HttpParams();
    params = params.append('testId', examid.toString());
    params = params.append('taskId', taskId.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/test/result`, { params })
  }
  getpredefineExamResultv2(examid, taskId): Observable<any> {
    let params = new HttpParams();
    params = params.append('testId', examid.toString());
    params = params.append('taskId', taskId.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/test/result`, { params })
  }
  getExamTopScorers(examid, courseId,byState): Observable<any> {
    let params = new HttpParams();
    params = params.append('testId', examid.toString());
    params = params.append('courseId', courseId.toString());
    params = params.append('byState', byState);
    return this._httpClient.get<any>(`${environment.apiURL}/test/top-scorers`, { params })
  }
  getpredefineExamCBTAnswersheet(examid, courseId): Observable<any> {
    let params = new HttpParams();
    params = params.append('testId', examid.toString());
    params = params.append('courseId', courseId.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/test/answersheet`, { params })
  }
  getpredefineExamAnswersheet(testId, taskId): Observable<any> {
    let params = new HttpParams();
    params = params.append('testId', testId.toString());
    params = params.append('taskId', taskId.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/test/answersheet`, { params })
  }
  BookmarkPredefineQuestion(request: any): Observable<any> {
    const params = new HttpParams()
      .set('testid', request.testid.toString())
      .set('courseId', request.courseId.toString())
      .set('questionId', request.questionId.toString())
      .set('IsBookMark', request.IsBookMark)
      .set('partId', request.partId);
    return this._httpClient.post<any>(`${environment.apiURL}/test/bookmark`, null, { params })
  }
  predefineAnswerSheetProgress(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/test/answersheet-progress/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getQuestionbyID(questionDetailID: number): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/test/question/` + questionDetailID, {});
  }
  //get exam List
  getExamList(CourseId, examtype): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseId', CourseId);
    return this._httpClient.get<any>(`${environment.apiURL}/test/list?${params}&testType=${examtype}`)
  }
  getcategoryExamList(examtype,categoryName): Observable<any> {
    let params = new HttpParams();
    const encodedCategoryName = encodeURIComponent(categoryName);
    // params = params.append('courseId', CourseId);
    return this._httpClient.get<any>(`${environment.apiURL}/test/list?testType=${examtype}&categoryName=${encodedCategoryName}`)
  }
  getpyqExamList(courseId, pyqExamType,year, isPracticeMode): Observable<any> {
    let params = new HttpParams();
    if(year){        
    params = params.append('year', year);
    }
    params = params.append('courseId', courseId.toString());
    params = params.append('testType', 3);
    params = params.append('pyqExamType', pyqExamType);     
    params = params.append('isPracticeMode', isPracticeMode); 
    return this._httpClient.get<any>(`${environment.apiURL}/test/pyq/v2-tests`,{params})
  }
  getpyqExamListSubjectwise(courseId, pyqExamType,subjectName, isPracticeMode): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseId', courseId.toString());
    params = params.append('testType', 3);
    params = params.append('pyqExamType', pyqExamType);        
    params = params.append('subjectName', subjectName);       
    params = params.append('isPracticeMode', isPracticeMode);
    return this._httpClient.get<any>(`${environment.apiURL}/test/pyq/subject/v2-tests`,{params})
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
  getoverallAnalytics(req): Observable<any> {
    let params = new HttpParams();
    params = params.append('startdate', req.startdate.toString());
    params = params.append('enddate', req.enddate.toString());
    params = params.append('courseid', req.courseid.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/test/overall-exam-analytics`, { params })
  }
  getoverallSubjectPerformance(courseid): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseid', courseid.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/test/subjectwiseanalytics`, { params })
  }
  getSubjectPerformance(courseid,subjectid): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseid', courseid.toString());
    params = params.append('subjectid', subjectid);
    return this._httpClient.get<any>(`${environment.apiURL}/test/subjectwise-overall-examanalytics`, { params })
  }
}
