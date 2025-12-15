import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingRequest } from './booking-request';

describe('BookingRequest', () => {
  let component: BookingRequest;
  let fixture: ComponentFixture<BookingRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
