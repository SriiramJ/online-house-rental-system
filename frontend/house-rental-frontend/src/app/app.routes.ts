import { Routes } from '@angular/router';

import { PropertyList } from './properties/property-list/property-list';
import { PropertyDetails } from './properties/property-details/property-details';
import { BookingRequest } from './bookings/booking-request/booking-request';
import { OwnerDashboard } from './owner/owner-dashboard/owner-dashboard';

export const routes: Routes = [
  { path: 'properties', component: PropertyList },
  { path: 'properties/:id', component: PropertyDetails },
  { path: 'properties/:id/book', component: BookingRequest },
  { path: 'owner/dashboard', component: OwnerDashboard },
  { path: '', redirectTo: 'properties', pathMatch: 'full' },
];
