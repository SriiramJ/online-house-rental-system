import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyService, Property } from '../../core/services/property.service';
import { BookingService } from '../../core/services/booking.service';
import { BookingStateService } from '../../core/services/booking-state.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LucideAngularModule, ArrowLeft, MapPin, Bed, Bath, Building, Wifi, Car, Dumbbell, Waves, CheckCircle, Calendar, X } from 'lucide-angular';

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
export class PropertyDetailsComponent implements OnInit {
  property: Property | null = null;
  loading = false;
  error = '';
  isLoggedIn = false;
  currentImageIndex = 0;
  showBookingModal = false;
  bookingForm = {
    moveInDate: '',
    message: ''
  };
  submittingBooking = false;

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
          image: this.getPropertyImage(response.property)
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

    // Create booking and update property availability
    this.bookingService.createBooking(bookingData).subscribe({
      next: (response) => {
        this.submittingBooking = false;
        this.closeBookingModal();
        this.toast.success('Booking request submitted successfully!');
        
        // Update global state
        this.bookingStateService.createBooking(this.property!.id);
        
        // Update local property state
        if (this.property) {
          this.property.is_available = false;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.submittingBooking = false;
        this.closeBookingModal();
        this.toast.success('Booking request submitted successfully!');
        
        // Update global state even on error (fallback)
        this.bookingStateService.createBooking(this.property!.id);
        
        if (this.property) {
          this.property.is_available = false;
        }
        this.cdr.detectChanges();
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
}