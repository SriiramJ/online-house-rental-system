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
    console.log('BookingService.createBooking called with:', bookingData);
    console.log('API URL:', this.apiUrl);
    
    // Add headers for proper request
    const headers = {
      'Content-Type': 'application/json'
    };
    
    return this.http.post(`${this.apiUrl}`, bookingData, { headers }).pipe(
      tap(response => console.log('Booking API response:', response)),
      catchError(error => {
        console.error('Booking API error:', error);
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

  updateBookingStatus(bookingId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${bookingId}/status`, { status });
  }
}