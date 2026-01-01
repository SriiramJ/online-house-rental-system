import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { SidebarComponent, SidebarItem } from '../../../shared/shared/sidebar/sidebar.component';
import { OwnerService } from '../../../core/services/owner.service';
import { SidebarService } from '../../../core/services/sidebar.service';
import { ToastService } from '../../../core/services/toast.service';
import { PropertyStateService } from '../../../core/services/property-state.service';
import { LucideAngularModule, Plus, Edit, Trash2, Eye, ArrowLeft, MapPin, Bed, Bath, Maximize, Home as HomeIcon, Menu, BarChart3, Calendar, Users } from 'lucide-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, SidebarComponent, LucideAngularModule],
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.css']
})
export class MyPropertiesComponent implements OnInit, OnDestroy {
  readonly Plus = Plus;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Eye = Eye;
  readonly ArrowLeft = ArrowLeft;
  readonly MapPin = MapPin;
  readonly Bed = Bed;
  readonly Bath = Bath;
  readonly Maximize = Maximize;
  readonly HomeIcon = HomeIcon;
  readonly Menu = Menu;
  readonly BarChart3 = BarChart3;
  readonly Calendar = Calendar;
  readonly Users = Users;

  properties: any[] = [];
  loading = false;
  showDeleteModal = false;
  propertyToDelete: any = null;
  private subscriptions: Subscription[] = [];
  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', route: '/owner/dashboard', icon: BarChart3 },
    { label: 'My Properties', route: '/owner/properties', icon: HomeIcon },
    { label: 'Booking Requests', route: '/owner/booking-requests', icon: Calendar },
    { label: 'My Tenants', route: '/owner/tenants', icon: Users }
  ];

  constructor(
    private ownerService: OwnerService,
    private toast: ToastService,
    private router: Router,
    public sidebarService: SidebarService,
    private cdr: ChangeDetectorRef,
    private propertyStateService: PropertyStateService
  ) {}

  ngOnInit() {
    this.loadProperties();
    this.setupPropertyStateListener();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupPropertyStateListener() {
    const propertiesSub = this.propertyStateService.propertiesUpdated$.subscribe(() => {
      console.log('Properties update triggered in My Properties');
      this.loadProperties();
    });
    this.subscriptions.push(propertiesSub);
  }

  ionViewWillEnter() {
    this.loadProperties();
  }

  loadProperties() {
    this.loading = true;
    this.ownerService.getOwnerProperties().subscribe({
      next: (response) => {
        this.properties = response.properties || [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.toast.error('Failed to load properties');
        this.properties = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getAvailableCount(): number {
    return this.properties.filter(p => p.status === 'Available').length;
  }

  getPendingCount(): number {
    return this.properties.filter(p => p.status === 'Pending').length;
  }

  getOccupiedCount(): number {
    return this.properties.filter(p => p.status === 'Rented').length;
  }

  getPropertyImage(property: any): string {
    console.log('Getting image for property:', property.title, 'Photos:', property.photos);
    
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
    } else if (property.image) {
      imageUrl = property.image;
    }
    
    console.log('Final image URL for', property.title, ':', imageUrl);
    return imageUrl;
  }

  handleDeleteClick(property: any) {
    this.propertyToDelete = property;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.propertyToDelete = null;
  }

  confirmDelete() {
    if (this.propertyToDelete) {
      this.ownerService.deleteProperty(this.propertyToDelete.id).subscribe({
        next: (response) => {
          console.log('Property deleted successfully');
          this.toast.success('Property deleted successfully');
          this.loadProperties(); // Reload the properties list
          // Trigger updates for dashboard and other components
          console.log('Triggering all updates after property deletion');
          this.propertyStateService.triggerAllUpdates();
          this.showDeleteModal = false;
          this.propertyToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting property:', error);
          this.toast.error('Failed to delete property');
          this.showDeleteModal = false;
          this.propertyToDelete = null;
        }
      });
    }
  }

  goToDashboard() {
    // Trigger updates before navigating to ensure fresh data
    this.propertyStateService.triggerAllUpdates();
    this.router.navigate(['/owner/dashboard']);
  }
}
