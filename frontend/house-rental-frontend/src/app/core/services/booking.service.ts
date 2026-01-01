import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PropertyStateService } from './property-state.service';

export interface BookingRequest {
  property_id: number;
  move_in_date: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(
    private http: HttpClient,
    private propertyStateService: PropertyStateService
  ) {}

  createBooking(bookingData: BookingRequest): Observable<any> {
    console.log('BookingService: Creating booking with data:', bookingData);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    };
    
    return this.http.post(`${this.apiUrl}`, bookingData, { headers }).pipe(
      tap(response => {
        console.log('Booking created successfully:', response);
        // Trigger comprehensive property updates to refresh all pages
        this.propertyStateService.triggerAllUpdates();
      }),
      catchError(error => {
        console.error('Booking creation failed:', error);
        return throwError(() => error);
      })
    );
  }

  getTenantBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tenant`);
  }

  getOwnerBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/owner`);
  }

  getOwnerTenants(): Observable<any> {
    return this.http.get(`${this.apiUrl}/owner/tenants`);
  }

  updateBookingStatus(bookingId: number, status: string, reason?: string): Observable<any> {
    const body = reason ? { status, rejection_reason: reason } : { status };
    return this.http.put(`${this.apiUrl}/${bookingId}/status`, body).pipe(
      tap(response => {
        console.log('Booking status updated:', response);
        // Trigger comprehensive property updates to refresh all pages
        this.propertyStateService.triggerAllUpdates();
      })
    );
  }
}