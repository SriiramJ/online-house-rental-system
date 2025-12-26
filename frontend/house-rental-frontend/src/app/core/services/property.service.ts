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
  photos?: string[];
  property_type: string;
  is_available: boolean;
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

  getProperties(): Observable<{properties: Property[], count: number, message: string}> {
    // Add cache-busting parameter to prevent 304 responses
    const url = `${this.apiUrl}?t=${Date.now()}`;
    
    return this.http.get<{properties: Property[], count: number, message: string}>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('API Error:', error);
          return of({ properties: [], count: 0, message: 'Failed to load properties' });
        })
      );
  }

  getProperty(id: number): Observable<{property: Property, message: string}> {
    const url = `${this.apiUrl}/${id}?t=${Date.now()}`;
    
    return this.http.get<{property: Property, message: string}>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('API Error:', error);
          return throwError(() => error);
        })
      );
  }
}