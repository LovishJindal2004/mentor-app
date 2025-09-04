import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Courses } from '../models/Course.model';

@Injectable({
  providedIn: 'root'
})
export class CousreService {
  private Coursefilter: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public courseIdvalue$: Observable<string> = this.Coursefilter.asObservable();
  private Coursefilterhippo: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public courseIdvaluehippo$: Observable<string> = this.Coursefilterhippo.asObservable();
  private userCourse: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public userCourse$: Observable<string> = this.userCourse.asObservable();
  constructor(private _httpClient: HttpClient) {

  }
  setCourseId(values: any): void {
    this.Coursefilter.next(values);
  }
  setHippoCourseId(values: any): void {
    this.Coursefilterhippo.next(values);
  }
  setUserCourseId(values: any): void {
    this.userCourse.next(values);
  }
  getCourses(PageNumber, PageSize): Observable<Courses[]> {
    let params = new HttpParams();
    params = params.append('PageNumber', PageNumber.toString());
    params = params.append('PageSize', PageSize.toString());
    return this._httpClient.get<Courses[]>(`${environment.apiURL}/course/list`, { params })
  }

  getHippos(courseId): Observable<any> {
    let params = new HttpParams();
    params = params.append('CourseId', courseId.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/hippos/getcoursehippos`, { params })
  }
  getHipposDetails(HippoId, Subject): Observable<any> {
    let params = new HttpParams();
    params = params.append('HippoId', HippoId.toString());
    params = params.append('subject', Subject.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/hippos/gethippodetailsbyid`, { params })
  }
  getsubjects(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/course/courses-brief-info`)
  }
  getsubjectsbyId(courseId): Observable<any> {
    let params = new HttpParams();
    params = params.append('CourseId', courseId.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/course/subjects`, { params })
  }
  getCourseDetailsbyId(SubjectId,CourseId): Observable<any> {
    let params = new HttpParams();
    params = params.append('SubjectId', SubjectId);
    params = params.append('courseId', CourseId);
    return this._httpClient.get<any>(`${environment.apiURL}/course/subjectdetail`, { params })
  }
  SubjectViews(request: any): Observable<any> {
    return this._httpClient.post<any>(`${environment.apiURL}/common/views`, { ...request })
  }
  getpages(name): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/pages?topicName=${name}`,)
  }
}

