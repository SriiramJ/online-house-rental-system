import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface BookingUpdate {
  propertyId: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  isAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BookingStateService {
  private bookingUpdatesSubject = new BehaviorSubject<BookingUpdate | null>(null);
  public bookingUpdates$ = this.bookingUpdatesSubject.asObservable();

  private propertyUpdatesSubject = new BehaviorSubject<{id: number, is_available: boolean} | null>(null);
  public propertyUpdates$ = this.propertyUpdatesSubject.asObservable();

  updateBookingStatus(propertyId: number, status: 'Pending' | 'Approved' | 'Rejected') {
    const isAvailable = status === 'Rejected';
    this.bookingUpdatesSubject.next({ propertyId, status, isAvailable });
    this.propertyUpdatesSubject.next({ id: propertyId, is_available: isAvailable });
  }

  createBooking(propertyId: number) {
    this.updateBookingStatus(propertyId, 'Pending');
  }
}