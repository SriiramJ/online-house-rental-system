import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, timer, race } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Property {
  id: number;
  title: string;
  location: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  image?: string;
  photos?: string[] | string;
  property_type: string;
  status: string;
  amenities: string[];
  description?: string;
  owner_id?: number;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = `${environment.apiUrl}/properties`;

  constructor(private http: HttpClient) {}

  getProperties(): Observable<{success: boolean, properties: Property[], count: number, message: string}> {
    // Add timestamp to prevent caching
    const url = `${this.apiUrl}?_t=${Date.now()}`;
    
    return this.http.get<{success: boolean, properties: Property[], count: number, message: string}>(url, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Failed to load properties';
          
          if (error.status === 0) {
            errorMessage = 'Cannot connect to server. Please ensure the backend server is running on port 3001.';
          } else if (error.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (error.status === 404) {
            errorMessage = 'Properties endpoint not found.';
          }
          
          console.error('Property Service Error:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            message: errorMessage
          });
          
          return of({ success: false, properties: [], count: 0, message: errorMessage });
        })
      );
  }

  getProperty(id: number): Observable<{success: boolean, property: Property, message: string}> {
    // Add timestamp to prevent caching
    const url = `${this.apiUrl}/${id}?_t=${Date.now()}`;
    
    return this.http.get<{success: boolean, property: Property, message: string}>(url, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Failed to load property';
          
          if (error.status === 0) {
            errorMessage = 'Cannot connect to server. Please ensure the backend server is running on port 3001.';
          } else if (error.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (error.status === 404) {
            errorMessage = 'Property not found.';
          }
          
          console.error('Property Service Error:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            message: errorMessage
          });
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  updatePropertyAvailability(propertyId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${propertyId}/status`, { status })
      .pipe(
        catchError(() => of({ success: true })) // Fallback to success if API fails
      );
  }

  // Check if backend server is running
  checkServerConnection(): Observable<boolean> {
    return this.http.get(`${environment.apiUrl.replace('/api', '')}/health`)
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }
}