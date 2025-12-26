import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PropertyService, Property } from '../../core/services/property.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { ToastService } from '../../core/services/toast.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LucideAngularModule, ArrowLeft, MapPin, Bed, Bath, Building, Wifi, Car, Dumbbell, Waves, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private authState: AuthStateService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.isLoggedIn = !!this.authState.getToken();
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
          image: response.property.photos && response.property.photos.length > 0 
            ? response.property.photos[0] 
            : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
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

  nextImage() {
    if (this.property && this.property.photos && this.property.photos.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.property.photos.length;
    }
  }

  prevImage() {
    if (this.property && this.property.photos && this.property.photos.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.property.photos.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  getCurrentImage(): string {
    if (this.property && this.property.photos && this.property.photos.length > 0) {
      return this.property.photos[this.currentImageIndex];
    }
    return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800';
  }

  goBack() {
    this.router.navigate(['/properties']);
  }

  bookProperty() {
    if (!this.isLoggedIn) {
      this.toast.warning('Login required', 'Please log in to book this property');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    if (this.property) {
      this.toast.info('Redirecting to booking', 'Taking you to the booking page...');
      this.router.navigate(['/properties', this.property.id, 'book']);
    }
  }

  contactOwner() {
    if (!this.isLoggedIn) {
      this.toast.warning('Login required', 'Please log in to contact the property owner');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    this.toast.info('Contact feature coming soon', 'We\'re working on direct messaging between tenants and owners!');
  }
}