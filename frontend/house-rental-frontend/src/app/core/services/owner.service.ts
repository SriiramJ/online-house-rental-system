import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
      tap(response => console.log('Dashboard response:', response)),
      catchError(error => {
        console.error('Dashboard API error:', error);
        return throwError(() => error);
      })
    );
  }

  getOwnerProperties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/properties`).pipe(
      tap(response => console.log('Owner properties response:', response)),
      catchError(error => {
        console.error('Owner properties API error:', error);
        return throwError(() => error);
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
    console.log('=== OWNER SERVICE ADD PROPERTY ===');
    console.log('API URL:', `${environment.apiUrl}/properties`);
    console.log('Property data being sent:', JSON.stringify(propertyData, null, 2));
    console.log('Headers:', this.getJsonHeaders());
    
    return this.http.post(`${environment.apiUrl}/properties`, propertyData, { headers: this.getJsonHeaders() }).pipe(
      tap(response => {
        console.log('=== ADD PROPERTY HTTP SUCCESS ===');
        console.log('Add property response:', response);
      }),
      catchError(error => {
        console.log('=== ADD PROPERTY HTTP ERROR ===');
        console.error('Add property error:', error);
        console.error('Error status:', error.status);
        console.error('Error statusText:', error.statusText);
        console.error('Error body:', error.error);
        console.error('Error headers:', error.headers);
        return throwError(() => error);
      })
    );
  }

  getProperty(propertyId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/properties/${propertyId}`, { headers: this.getJsonHeaders() }).pipe(
      tap(response => console.log('Get property response:', response)),
      catchError(error => {
        console.error('Get property error:', error);
        return throwError(() => error);
      })
    );
  }

  updateProperty(propertyId: number, propertyData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/properties/${propertyId}`, propertyData, { headers: this.getJsonHeaders() }).pipe(
      tap(response => console.log('Update property response:', response)),
      catchError(error => {
        console.error('Update property error:', error);
        return throwError(() => error);
      })
    );
  }

  deleteProperty(propertyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/properties/${propertyId}`);
  }

  uploadPropertyImages(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/properties/upload-images`, formData);
  }
}