import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SystemStats {
  users: { role: string; count: number }[];
  properties: number;
  bookings: {
    total: number;
    by_status: { status: string; count: number }[];
  };
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  created_at: string;
}

export interface AdminProperty {
  id: number;
  title: string;
  location: string;
  rent: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  is_available: boolean;
  owner_name: string;
  owner_email: string;
  pending_requests: number;
  approved_bookings: number;
  created_at: string;
}

export interface AdminBooking {
  id: number;
  property_title: string;
  property_location: string;
  property_rent: number;
  tenant_name: string;
  tenant_email: string;
  owner_name: string;
  owner_email: string;
  status: string;
  move_in_date: string;
  lease_duration: string;
  message?: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getSystemStats(): Observable<{ success: boolean; data: SystemStats }> {
    console.log('Making API call to:', `${this.apiUrl}/stats`);
    return this.http.get<{ success: boolean; data: SystemStats }>(`${this.apiUrl}/stats`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Admin stats API error:', error);
          return throwError(() => error);
        })
      );
  }

  getAllUsers(): Observable<{ success: boolean; data: AdminUser[] }> {
    return this.http.get<{ success: boolean; data: AdminUser[] }>(`${this.apiUrl}/users`);
  }

  getAllProperties(): Observable<{ success: boolean; data: AdminProperty[] }> {
    return this.http.get<{ success: boolean; data: AdminProperty[] }>(`${this.apiUrl}/properties`);
  }

  getAllBookings(): Observable<{ success: boolean; data: AdminBooking[] }> {
    return this.http.get<{ success: boolean; data: AdminBooking[] }>(`${this.apiUrl}/bookings`);
  }
}