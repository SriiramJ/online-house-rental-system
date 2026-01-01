import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private isConnectedSubject = new BehaviorSubject<boolean>(true);
  public isConnected$ = this.isConnectedSubject.asObservable();
  
  private healthCheckUrl = `${environment.apiUrl.replace('/api', '')}/health`;

  constructor(private http: HttpClient) {
    this.startHealthCheck();
  }

  checkConnection(): Observable<boolean> {
    return this.http.get(this.healthCheckUrl, { timeout: 5000 })
      .pipe(
        map(() => {
          this.isConnectedSubject.next(true);
          return true;
        }),
        catchError(() => {
          this.isConnectedSubject.next(false);
          return [false];
        })
      );
  }

  private startHealthCheck() {
    // Check connection every 30 seconds
    timer(0, 30000)
      .pipe(
        switchMap(() => this.checkConnection())
      )
      .subscribe();
  }

  getConnectionStatus(): boolean {
    return this.isConnectedSubject.value;
  }
}