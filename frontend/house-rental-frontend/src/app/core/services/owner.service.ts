import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private apiUrl = `${environment.apiUrl}/owner`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private getUploadHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Don't set Content-Type for FormData, let browser set it
    });
  }

  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`, { headers: this.getHeaders() });
  }

  getOwnerProperties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/properties`, { headers: this.getHeaders() });
  }

  getOwnerBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings`, { headers: this.getHeaders() });
  }

  getOwnerTenants(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tenants`, { headers: this.getHeaders() });
  }

  updateBookingStatus(bookingId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/bookings/${bookingId}/status`, { status }, { headers: this.getHeaders() });
  }

  addProperty(propertyData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/properties`, propertyData, { headers: this.getHeaders() });
  }

  deleteProperty(propertyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/properties/${propertyId}`, { headers: this.getHeaders() });
  }

  uploadPropertyImages(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/properties/upload-images`, formData, { headers: this.getUploadHeaders() });
  }
}