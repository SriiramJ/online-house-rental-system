import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'TENANT' | 'OWNER';
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private toast: ToastService) {}

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setSession(response.data.user, response.data.token);
          this.toast.success('Welcome back!', `Hello ${response.data.user.name}, you're successfully logged in.`);
        }
      })
    );
  }

  register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'TENANT' | 'OWNER';
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/register`, userData).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setSession(response.data.user, response.data.token);
          this.toast.success('Welcome to RentEase!', `Account created successfully. Hello ${response.data.user.name}!`);
        }
      })
    );
  }

  logout(): void {
    const user = this.getCurrentUser();
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.toast.info('Logged out successfully', `Goodbye ${user?.name || 'User'}, see you soon!`);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  isOwner(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'OWNER';
  }

  isTenant(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'TENANT';
  }

  private setSession(user: User, token: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
}
