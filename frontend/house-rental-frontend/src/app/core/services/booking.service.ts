import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface BookingRequest {
  property_id: number;
  move_in_date: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3001/api/bookings';

  constructor(private http: HttpClient) {}

  createBooking(bookingData: BookingRequest): Observable<any> {
    console.log('=== BOOKING SERVICE CREATE BOOKING ===');
    console.log('BookingService.createBooking called with:', bookingData);
    console.log('API URL:', this.apiUrl);
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    console.log('Request headers:', headers);
    
    return this.http.post(`${this.apiUrl}`, bookingData, { headers }).pipe(
      tap(response => {
        console.log('=== BOOKING API SUCCESS ===');
        console.log('Booking API response:', response);
      }),
      catchError(error => {
        console.error('=== BOOKING API ERROR ===');
        console.error('Booking API error:', error);
        console.error('Error status:', error.status);
        console.error('Error statusText:', error.statusText);
        console.error('Error body:', error.error);
        return throwError(() => error);
      })
    );
  }

  getTenantBookings(): Observable<any> {
    return this.http.get('http://localhost:3001/api/bookings/tenant');
  }

  getOwnerBookings(): Observable<any> {
    return this.http.get('http://localhost:3001/api/bookings/owner');
  }

  getOwnerTenants(): Observable<any> {
    return this.http.get('http://localhost:3001/api/bookings/owner/tenants');
  }

  updateBookingStatus(bookingId: number, status: string, reason?: string): Observable<any> {
    const body = reason ? { status, rejection_reason: reason } : { status };
    return this.http.put(`http://localhost:3001/api/bookings/${bookingId}/status`, body);
  }
}