import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private apiUrl = `${environment.apiUrl}/owner`;

  constructor(private http: HttpClient) {}

  private getJsonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`).pipe(
      catchError(error => {
        console.error('Dashboard API error:', error);
        throw error;
      })
    );
  }

  getOwnerProperties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/properties`).pipe(
      catchError(error => {
        console.error('Properties API error:', error);
        throw error;
      })
    );
  }

  getOwnerBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings`);
  }

  getOwnerTenants(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tenants`);
  }

  updateBookingStatus(bookingId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/bookings/${bookingId}/status`, { status }, { headers: this.getJsonHeaders() });
  }

  addProperty(propertyData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/properties`, propertyData, { headers: this.getJsonHeaders() });
  }

  deleteProperty(propertyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/properties/${propertyId}`);
  }

  uploadPropertyImages(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/properties/upload-images`, formData);
  }
}