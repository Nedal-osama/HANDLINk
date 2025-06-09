import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private predictUrl = 'http://sign-language.runasp.net/api/SignPrediction/predict';
  private historyUrl = 'http://sign-language.runasp.net/api/SignPrediction/userPredictions';

  constructor(private http: HttpClient) {}

  predictImage(file: File, email: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const params = new HttpParams().set('email', email);

    return this.http.post<any>(this.predictUrl, formData, { params });
  }

  getUserPredictions(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(this.historyUrl, { params });
  }


}
