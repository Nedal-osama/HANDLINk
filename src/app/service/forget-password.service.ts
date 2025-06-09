import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {
  private baseUrl: string = 'https://sign-language.runasp.net/api/Account';

  constructor(private _HttpClient: HttpClient) {}

  forgotPasswordByEmail(userEmail: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/forgotPasswordByEmail`, userEmail, { responseType: 'text' });
  }

  forgotPasswordByTelegram(phoneNumber: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/forgotPasswordByTelegram`, phoneNumber, { responseType: 'text' });
  }

  verifyResetCode(resetCode: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/verifyResetCode`, resetCode, { responseType: 'text' });
  }

  resetPassword(resetPasswordForm: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/resetPassword`, resetPasswordForm, { responseType: 'text' });
  }
}
