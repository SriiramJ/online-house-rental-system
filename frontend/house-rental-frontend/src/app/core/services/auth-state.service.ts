import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // Check if user has token on service initialization
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedInSubject.next(!!token);
  }

  setLoggedIn(status: boolean) {
    this.isLoggedInSubject.next(status);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.setLoggedIn(true);
  }

  clearToken() {
    localStorage.removeItem('token');
    this.setLoggedIn(false);
  }
}