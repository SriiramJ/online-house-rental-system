import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface BookingUpdate {
  propertyId: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  propertyStatus: 'Available' | 'Pending' | 'Rented';
}

@Injectable({
  providedIn: 'root'
})
export class BookingStateService {
  private bookingUpdatesSubject = new BehaviorSubject<BookingUpdate | null>(null);
  public bookingUpdates$ = this.bookingUpdatesSubject.asObservable();

  private propertyUpdatesSubject = new BehaviorSubject<{id: number, status: string} | null>(null);
  public propertyUpdates$ = this.propertyUpdatesSubject.asObservable();

  updateBookingStatus(propertyId: number, status: 'Pending' | 'Approved' | 'Rejected') {
    // Property status changes based on booking status
    let propertyStatus: 'Available' | 'Pending' | 'Rented';
    if (status === 'Rejected') {
      propertyStatus = 'Available';
    } else if (status === 'Approved') {
      propertyStatus = 'Rented';
    } else {
      propertyStatus = 'Pending';
    }
    this.bookingUpdatesSubject.next({ propertyId, status, propertyStatus });
    this.propertyUpdatesSubject.next({ id: propertyId, status: propertyStatus });
  }

  createBooking(propertyId: number) {
    // When booking is created, property becomes pending
    const propertyStatus = 'Pending';
    this.bookingUpdatesSubject.next({ propertyId, status: 'Pending', propertyStatus });
    this.propertyUpdatesSubject.next({ id: propertyId, status: propertyStatus });
  }
}