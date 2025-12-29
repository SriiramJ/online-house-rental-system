import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyStateService {
  // Use Subject instead of BehaviorSubject for one-time events
  private propertiesUpdatedSubject = new Subject<void>();
  private dashboardUpdatedSubject = new Subject<void>();
  
  // Track if data needs refresh with timestamp
  private lastPropertyUpdate = new BehaviorSubject<number>(Date.now());
  private lastDashboardUpdate = new BehaviorSubject<number>(Date.now());

  // Observable streams
  propertiesUpdated$ = this.propertiesUpdatedSubject.asObservable();
  dashboardUpdated$ = this.dashboardUpdatedSubject.asObservable();
  
  // Timestamp observables for checking if data is stale
  lastPropertyUpdate$ = this.lastPropertyUpdate.asObservable();
  lastDashboardUpdate$ = this.lastDashboardUpdate.asObservable();

  constructor() {}

  // Trigger property list refresh
  triggerPropertiesUpdate(): void {
    console.log('Triggering properties update');
    this.lastPropertyUpdate.next(Date.now());
    this.propertiesUpdatedSubject.next();
  }

  // Trigger dashboard refresh
  triggerDashboardUpdate(): void {
    console.log('Triggering dashboard update');
    this.lastDashboardUpdate.next(Date.now());
    this.dashboardUpdatedSubject.next();
  }

  // Trigger both updates (when property is added/deleted/updated)
  triggerAllUpdates(): void {
    console.log('Triggering all updates');
    this.triggerPropertiesUpdate();
    this.triggerDashboardUpdate();
  }

  // Check if dashboard needs refresh based on timestamp
  shouldRefreshDashboard(): boolean {
    const lastUpdate = this.lastDashboardUpdate.value;
    const now = Date.now();
    // Consider data stale if it's been more than 1 second since last update trigger
    return (now - lastUpdate) < 5000; // 5 seconds window
  }
  
  // Get last update timestamp
  getLastDashboardUpdate(): number {
    return this.lastDashboardUpdate.value;
  }
}
