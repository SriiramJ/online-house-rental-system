import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private apiUrl = `${environment.apiUrl}/tenant`;

  constructor(private http: HttpClient) {}

  getTenantBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings`);
  }

  getTenantDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }
}