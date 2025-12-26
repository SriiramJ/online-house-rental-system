import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auth endpoints
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  // Properties endpoints
  getProperties(): Observable<any> {
    return this.http.get(`${this.baseUrl}/properties`);
  }

  getProperty(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/properties/${id}`);
  }
}