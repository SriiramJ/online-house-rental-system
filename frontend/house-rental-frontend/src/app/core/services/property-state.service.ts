import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyStateService {
  // Use Subject for immediate event emission
  private propertiesUpdatedSubject = new Subject<void>();
  private dashboardUpdatedSubject = new Subject<void>();

  // Observable streams
  propertiesUpdated$ = this.propertiesUpdatedSubject.asObservable();
  dashboardUpdated$ = this.dashboardUpdatedSubject.asObservable();

  constructor() {}

  // Trigger property list refresh
  triggerPropertiesUpdate(): void {
    console.log('Triggering properties update');
    this.propertiesUpdatedSubject.next();
  }

  // Trigger dashboard refresh
  triggerDashboardUpdate(): void {
    console.log('Triggering dashboard update');
    this.dashboardUpdatedSubject.next();
  }

  // Trigger both updates (when property is added/deleted/updated)
  triggerAllUpdates(): void {
    console.log('Triggering all updates');
    this.triggerPropertiesUpdate();
    this.triggerDashboardUpdate();
  }
}
