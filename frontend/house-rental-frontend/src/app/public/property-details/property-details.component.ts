import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService, Property } from '../../core/services/property.service';
import { BookingService } from '../../core/services/booking.service';
import { BookingStateService } from '../../core/services/booking-state.service';
import { PropertyStateService } from '../../core/services/property-state.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LucideAngularModule, ArrowLeft, MapPin, Bed, Bath, Building, Wifi, Car, Dumbbell, Waves, CheckCircle, Calendar, X } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoaderComponent,
    NavbarComponent,
    FooterComponent,
    LucideAngularModule
  ],
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent implements OnInit, OnDestroy {
  property: Property | null = null;
  loading = false;
  error = '';
  isLoggedIn = false;
  currentImageIndex = 0;
  showBookingModal = false;
  userBookings: any[] = [];
  hasSubmittedBooking = false;
  bookingForm = {
    moveInDate: '',
    message: ''
  };
  submittingBooking = false;
  private destroy$ = new Subject<void>();

  // Lucide icons
  readonly ArrowLeft = ArrowLeft;
  readonly MapPin = MapPin;
  readonly Bed = Bed;
  readonly Bath = Bath;
  readonly Building = Building;
  readonly Wifi = Wifi;
  readonly Car = Car;
  readonly Dumbbell = Dumbbell;
  readonly Waves = Waves;
  readonly CheckCircle = CheckCircle;
  readonly Calendar = Calendar;
  readonly X = X;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private bookingService: BookingService,
    private bookingStateService: BookingStateService,
    private propertyStateService: PropertyStateService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProperty(parseInt(id));
    }
    if (this.isLoggedIn && this.authService.isTenant()) {
      this.loadUserBookings();
    }
    this.subscribeToBookingUpdates();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeToBookingUpdates() {
    this.bookingStateService.propertyUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(update => {
        if (update && this.property && update.id === this.property.id) {
          this.property.is_available = update.is_available;
          this.cdr.detectChanges();
        }
      });

    this.bookingStateService.bookingUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.property) {
          this.loadProperty(this.property.id);
        }
        if (this.authService.isTenant()) {
          this.loadUserBookings();
        }
      });
  }

  loadProperty(id: number) {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    // Timeout fallback
    setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.error = 'Failed to load property details';
        this.cdr.detectChanges();
      }
    }, 5000);

    this.propertyService.getProperty(id).subscribe({
      next: (response: {property: Property, message: string}) => {
        this.property = {
          ...response.property,
          image: this.getPropertyImage(response.property),
          status: response.property.status
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.error = 'Failed to load property details';
        this.toast.error('Property not found', 'Unable to load property details. Please try again.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getPhotosArray(): string[] {
    if (!this.property || !this.property.photos) {
      return [];
    }
    
    if (Array.isArray(this.property.photos)) {
      return this.property.photos;
    }
    
    // Handle comma-separated string
    return this.property.photos.split(',').map(url => url.trim()).filter(url => url);
  }

  nextImage() {
    const photos = this.getPhotosArray();
    if (photos.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % photos.length;
    }
  }

  prevImage() {
    const photos = this.getPhotosArray();
    if (photos.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? photos.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  getCurrentImage(): string {
    const photos = this.getPhotosArray();
    if (photos.length > 0) {
      return photos[this.currentImageIndex];
    }
    return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800';
  }

  getPropertyImage(property: Property): string {
    // Get the first photo from the photos array
    let imageUrl = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'; // default
    
    if (property.photos && Array.isArray(property.photos) && property.photos.length > 0) {
      imageUrl = property.photos[0];
    } else if (property.photos && typeof property.photos === 'string' && property.photos.trim()) {
      // Handle case where photos is a comma-separated string
      const photoUrls = property.photos.split(',').map((url: string) => url.trim()).filter((url: string) => url);
      if (photoUrls.length > 0) {
        imageUrl = photoUrls[0];
      }
    }
    
    return imageUrl;
  }

  goBack() {
    this.router.navigate(['/properties']);
  }

  bookProperty() {
    if (!this.authService.isAuthenticated()) {
      this.toast.warning('Login required', 'Please log in to book this property');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    if (this.authService.isOwner()) {
      this.toast.error('Access denied', 'Property owners cannot book properties. Switch to tenant account to book.');
      return;
    }
    
    this.showBookingModal = true;
    this.bookingForm = {
      moveInDate: '',
      message: ''
    };
  }

  closeBookingModal() {
    this.showBookingModal = false;
    this.bookingForm = {
      moveInDate: '',
      message: ''
    };
  }

  submitBooking() {
    console.log('=== SUBMIT BOOKING CALLED ===');
    console.log('Form data:', this.bookingForm);
    console.log('Property:', this.property);
    console.log('Is authenticated:', this.authService.isAuthenticated());
    console.log('User role:', this.authService.getCurrentUser());
    
    if (!this.bookingForm.moveInDate) {
      this.toast.error('Move-in date is required');
      return;
    }

    if (!this.property || !this.property.id) {
      this.toast.error('Property information not available');
      return;
    }

    this.submittingBooking = true;
    
    const bookingData = {
      property_id: Number(this.property.id),
      move_in_date: this.bookingForm.moveInDate,
      message: this.bookingForm.message || ''
    };

    console.log('Booking data to send:', bookingData);

    // Create booking and update property availability
    this.bookingService.createBooking(bookingData).subscribe({
      next: (response) => {
        console.log('Booking success response:', response);
        this.submittingBooking = false;
        this.closeBookingModal();
        this.hasSubmittedBooking = true;
        this.toast.success('Booking request submitted successfully!');
        
        // Update global state
        this.bookingStateService.createBooking(this.property!.id);
        
        // Trigger properties list update
        this.propertyStateService.triggerPropertiesUpdate();
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.submittingBooking = false;
        console.error('Booking submission error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
        
        let errorMessage = 'Failed to submit booking request. Please try again.';
        if (error.status === 401) {
          errorMessage = 'Please log in to book this property.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.toast.error(errorMessage);
      }
    });
  }

  getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  contactOwner() {
    if (!this.authService.isAuthenticated()) {
      this.toast.warning('Login required', 'Please log in to contact the property owner');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    this.toast.info('Contact feature coming soon', 'We\'re working on direct messaging between tenants and owners!');
  }
  
  canBookProperty(): boolean {
    return this.authService.isAuthenticated() && this.authService.isTenant();
  }

  isCurrentUserOwner(): boolean {
    if (!this.authService.isAuthenticated() || !this.property) {
      return false;
    }
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === this.property.owner_id;
  }

  loadUserBookings() {
    this.bookingService.getTenantBookings().subscribe({
      next: (response) => {
        this.userBookings = response.bookings || [];
        console.log('User bookings loaded:', this.userBookings);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading user bookings:', error);
      }
    });
  }

  hasUserPendingBooking(): boolean {
    if (!this.property || !this.userBookings.length) {
      return false;
    }
    const hasPending = this.userBookings.some(booking => 
      booking.property_id === this.property!.id && booking.status === 'Pending'
    );
    console.log('Has pending booking for property', this.property.id, ':', hasPending);
    return hasPending;
  }
}