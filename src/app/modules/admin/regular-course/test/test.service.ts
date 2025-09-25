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
  getsigleExam(CourseId, Examid): Observable<any> {
    let params = new HttpParams();
    params = params.append('CourseId', CourseId.toString());
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
  getpredefineExamResult(examid, courseId): Observable<any> {
    let params = new HttpParams();
    params = params.append('testId', examid.toString());
    params = params.append('courseId', courseId.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/test/result`, { params })
  }
  getpredefineExamResultv2(examid, courseId): Observable<any> {
    let params = new HttpParams();
    params = params.append('testId', examid.toString());
    params = params.append('courseId', courseId.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/test/v2-result`, { params })
  }
  getExamTopScorers(examid, courseId,byState): Observable<any> {
    let params = new HttpParams();
    params = params.append('testId', examid.toString());
    params = params.append('courseId', courseId.toString());
    params = params.append('byState', byState);
    return this._httpClient.get<any>(`${environment.apiURL}/test/top-scorers`, { params })
  }
  getpredefineExamAnswersheet(examid, courseId): Observable<any> {
    let params = new HttpParams();
    params = params.append('testId', examid.toString());
    params = params.append('courseId', courseId.toString());
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
      this._httpClient.post(`${environment.apiURL}/test/answer-sheet-progress/`, { ...request })
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
  getcategoryExamList(CourseId, examtype,categoryName): Observable<any> {
    let params = new HttpParams();
    const encodedCategoryName = encodeURIComponent(categoryName);
    params = params.append('courseId', CourseId);
    return this._httpClient.get<any>(`${environment.apiURL}/test/v2-list?${params}&testType=${examtype}&categoryName=${encodedCategoryName}`)
  }
  getpyqExamList(courseId, pyqExamType,year): Observable<any> {
    let params = new HttpParams();
    if(year){        
    params = params.append('year', year);
    }
    params = params.append('courseId', courseId.toString());
    params = params.append('testType', 3);
    params = params.append('pyqExamType', pyqExamType);  
    return this._httpClient.get<any>(`${environment.apiURL}/test/pyq/tests`,{params})
  }
  getpyqExamListSubjectwise(courseId, pyqExamType,subjectName): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseId', courseId.toString());
    params = params.append('testType', 3);
    params = params.append('pyqExamType', pyqExamType);        
    params = params.append('subjectName', subjectName);
    return this._httpClient.get<any>(`${environment.apiURL}/test/pyq/subject/tests`,{params})
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

  getLeaderBoardQuestion(CourseId, Examid, isPracticeMode): Observable<any> {
    let params = new HttpParams();
    params = params.append('CourseId', CourseId.toString());
    params = params.append('testId', Examid.toString());
    params = params.append('isPracticeMode', isPracticeMode);
    return this._httpClient.get<any>(`${environment.apiURL}/leaderboard/v2-getquestions`, { params })
  }
  submitLeaderBoardQuestion(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/leaderboard/v2-submit-question/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  finishLeaderBoardExam(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/leaderboard/v2-submit-test/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getLeaderBoardExamAnswersheet(examid, courseId,isPracticeMode): Observable<any> {
    let params = new HttpParams();
    params = params.append('testId', examid.toString());
    params = params.append('courseId', courseId.toString());
    params = params.append('isPracticeMode', isPracticeMode);
    return this._httpClient.get<any>(`${environment.apiURL}/leaderboard/v2-answersheet`, { params })
  }
  getLeaderBoardExamResult(examid, courseId,isPracticeMode): Observable<any> {
    let params = new HttpParams();
    params = params.append('testId', examid.toString());
    params = params.append('courseId', courseId.toString());
    params = params.append('isPracticeMode', isPracticeMode);
    return this._httpClient.get<any>(`${environment.apiURL}/leaderboard/v2-result`, { params })
  }
  getLeaderBoardSubjects(CourseId, testType, categoryName): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseId', CourseId.toString());
    params = params.append('testType', testType.toString());
    params = params.append('categoryName', categoryName.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/leaderboard/subject`, { params })
  }
  getLeaderBoardClasses(CourseId, testType, categoryName, isPracticeMode): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseId', CourseId.toString());
    params = params.append('testType', testType.toString());
    params = params.append('categoryName', categoryName.toString());
    params = params.append('isPracticeMode', isPracticeMode);
    return this._httpClient.get<any>(`${environment.apiURL}/leaderboard/v2-class`, { params })
  }
  getLeaderBoardSessions(CourseId, testType, className, isPracticeMode): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseId', CourseId.toString());
    params = params.append('testType', testType.toString());
    params = params.append('className', className.toString());
    params = params.append('isPracticeMode', isPracticeMode);
    return this._httpClient.get<any>(`${environment.apiURL}/leaderboard/v2-examlist`, { params })
  }
  getLeaderBoardExamList(CourseId, examtype, className, isPracticeMode): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseId', CourseId.toString());
    params = params.append('testType', examtype.toString());
    params = params.append('className', className.toString());
    params = params.append('isPracticeMode', isPracticeMode);
    return this._httpClient.get<any>(`${environment.apiURL}/leaderboard/v2-examlist`, { params })
  }
  getInClassLeaderBoardExamList(CourseId, examtype, categoryName, subjectname, className, isPracticeMode): Observable<any> {
    let params = new HttpParams();
    const encodedCategoryName = encodeURIComponent(categoryName);
    params = params.append('courseId', CourseId.toString());
    params = params.append('testType', examtype.toString());
    params = params.append('categoryName', categoryName.toString());
    params = params.append('subjectname', subjectname.toString());
    params = params.append('className', className.toString());
    params = params.append('isPracticeMode', isPracticeMode);
    return this._httpClient.get<any>(`${environment.apiURL}/leaderboard/v2-examlist`, { params })
  }
  getLeaderBoardType(CourseId, className, isPracticeMode): Observable<any> {
    let params = new HttpParams();
    params = params.append('courseId', CourseId.toString());
    params = params.append('clasName', className.toString());
    params = params.append('isPracticeMode', isPracticeMode);
    return this._httpClient.get<any>(`${environment.apiURL}/leaderboard/v2-leaderboard-type`, { params })
  }
  predefineLeaderBoardAnswerSheetProgress(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/leaderboard/answer-sheet-progress/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
