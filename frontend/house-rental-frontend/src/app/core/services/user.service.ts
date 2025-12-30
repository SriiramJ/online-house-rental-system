import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthStateService } from './auth-state.service';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authState: AuthStateService
  ) {}

  getCurrentUser(): Observable<{success: boolean, data: User}> {
    const token = this.authState.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{success: boolean, data: User}>(`${this.apiUrl}/profile`, { headers });
  }

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  clearCurrentUser() {
    this.currentUserSubject.next(null);
  }

  logout(): Observable<{success: boolean, message: string}> {
    const token = this.authState.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<{success: boolean, message: string}>(`${this.apiUrl}/logout`, {}, { headers });
  }
}