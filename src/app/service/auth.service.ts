import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private _HttpClient: HttpClient) {}
  userInfo: any = null;
  baseUrl: string = `https://sign-language.runasp.net/api/Account/`;

  register(userData: object): Observable<any> {
    return this._HttpClient.post<any>(this.baseUrl + `register`, userData);
  }

  login(userData: object): Observable<any> {
    return this._HttpClient.post<any>(this.baseUrl + `login`, userData).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('etoken', response.token);
          this.decodeUser();
        }
      })
    );
  }

 decodeUser(): void {
  const token = localStorage.getItem('etoken');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      this.userInfo = decoded;
    } catch (error) {
      this.userInfo = null;
    }
  }
}


  logout(): void {
    localStorage.removeItem('etoken');
    this.userInfo = null;
  }


}
