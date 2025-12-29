import { TestBed } from '@angular/core/testing';
import { PropertyStateService } from './property-state.service';

describe('PropertyStateService', () => {
  let service: PropertyStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should trigger properties update', (done) => {
    service.propertiesUpdated$.subscribe(updated => {
      if (updated) {
        expect(updated).toBe(true);
        done();
      }
    });
    
    service.triggerPropertiesUpdate();
  });

  it('should trigger dashboard update', (done) => {
    service.dashboardUpdated$.subscribe(updated => {
      if (updated) {
        expect(updated).toBe(true);
        done();
      }
    });
    
    service.triggerDashboardUpdate();
  });

  it('should trigger all updates', (done) => {
    let propertiesUpdated = false;
    let dashboardUpdated = false;
    
    service.propertiesUpdated$.subscribe(updated => {
      if (updated) propertiesUpdated = true;
      checkCompletion();
    });
    
    service.dashboardUpdated$.subscribe(updated => {
      if (updated) dashboardUpdated = true;
      checkCompletion();
    });
    
    function checkCompletion() {
      if (propertiesUpdated && dashboardUpdated) {
        expect(propertiesUpdated).toBe(true);
        expect(dashboardUpdated).toBe(true);
        done();
      }
    }
    
    service.triggerAllUpdates();
  });
});