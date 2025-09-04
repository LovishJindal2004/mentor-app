import { Injectable, NgZone } from '@angular/core';
import { AES, enc } from 'crypto-js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';
import { User } from '../user/user.types';
import { DataGuardService } from './guards/dataGuard';
import { appConfig } from './app.config';

@Injectable({
  providedIn: 'root'
})

export class helperService {
  constructor(private _dataGuardService: DataGuardService, private _router: Router, private _httpClient: HttpClient) {
    this.getUserDetail();
  }
  private secretKey: string = 'Tinat@#@#mind';
  CollegeLogo: string;
  helper = new JwtHelperService();
  keyName = appConfig.localStorageName.TenantInfoStorageName;
  getSecretKey(): string {
    return this.secretKey;
  }
  encryptObject(obj: any, key: string): string {
    const encrypted = AES.encrypt(JSON.stringify(obj), this.secretKey).toString();
    return encrypted;
  }

  decryptObject(encryptedData: string, key: string): any {
    try {
      const decrypted = AES.decrypt(encryptedData, this.secretKey).toString(enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      // throw new Error("Failed to decrypt data");
    }
  }

  public getUserDetail(): User {
    let user: User = null;

    const _user = this._dataGuardService.getLocalData('accessToken');
    if (_user) {
      try {
        user = this.helper.decodeToken(_user);
        if (user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone']) {
          user.Mobile = user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'];
        }
        // to change the roles
        // user.Roles = "Lecturer";

      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('accessToken');
      }
    }

    return user;
  }
  //Firebase 

  getAnswersheetDownload(examID: number, questionsResult: any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/pdf',

        responseType: 'blob',
        Accept: 'application/pdf',
        observe: 'response'
      })
    };
    //return this._httpClient.get(`${environment.externalApiURL}/api/user/print/live-quiz/answer-sheet/${examID}/pdf`, httpOptions);

   return this._httpClient.post(`${environment.apiURL}/livequiz/print/answersheet/${examID}`, { ...{ QuestionDetailMockTest: questionsResult.QuestionDetailMockTest, ExamName: questionsResult.ExamDetail.Title } })
    

  }
}