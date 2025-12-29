import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { OwnerService } from '../../core/services/owner.service';
import { ToastService } from '../../core/services/toast.service';
import { PropertyStateService } from '../../core/services/property-state.service';
import { LucideAngularModule, Upload, X, Plus, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, ButtonComponent, LucideAngularModule],
  template: `
    <app-navbar></app-navbar>
    
    <div class="container">
      <div class="header-section">
        <app-button 
          variant="ghost" 
          size="sm"
          (onClick)="goToDashboard()" 
          className="back-button"
        >
          <lucide-icon [img]="ArrowLeft" class="icon-sm"></lucide-icon>
          Back to Dashboard
        </app-button>
        <h1 class="page-title">
          {{isEditMode ? 'Edit Property' : 'Add New Property'}}
        </h1>
        <p class="page-subtitle">
          {{isEditMode ? 'Update your property details' : 'Fill in the details to list your property'}}
        </p>
      </div>

      <form #propertyForm="ngForm" (ngSubmit)="onSubmit(propertyForm)" class="form-container">
        <!-- Title -->
        <div class="form-group">
          <label for="title" class="form-label">
            Property Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            [(ngModel)]="formData.title"
            #title="ngModel"
            required
            class="form-input"
            [class.error]="title.invalid && title.touched"
            placeholder="e.g., Modern Downtown Apartment"
          >
          <p *ngIf="title.invalid && title.touched" class="error-message">
            Title is required
          </p>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description" class="form-label">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            [(ngModel)]="formData.description"
            #description="ngModel"
            required
            rows="4"
            class="form-textarea"
            [class.error]="description.invalid && description.touched"
            placeholder="Describe your property in detail..."
          ></textarea>
          <p *ngIf="description.invalid && description.touched" class="error-message">
            Description is required
          </p>
        </div>

        <!-- Rent and Location -->
        <div class="form-row">
          <div class="form-group">
            <label for="rent" class="form-label">
              Monthly Rent ($) *
            </label>
            <input
              type="number"
              id="rent"
              name="rent"
              [(ngModel)]="formData.rent"
              #rent="ngModel"
              required
              min="0"
              class="form-input"
              [class.error]="rent.invalid && rent.touched"
              placeholder="2500"
            >
            <p *ngIf="rent.invalid && rent.touched" class="error-message">
              Valid rent amount is required
            </p>
          </div>

          <div class="form-group">
            <label for="location" class="form-label">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              [(ngModel)]="formData.location"
              #location="ngModel"
              required
              class="form-input"
              [class.error]="location.invalid && location.touched"
              placeholder="City, State"
            >
            <p *ngIf="location.invalid && location.touched" class="error-message">
              Location is required
            </p>
          </div>
        </div>

        <!-- Property Details -->
        <div class="form-row-three">
          <div class="form-group">
            <label for="bedrooms" class="form-label">
              Bedrooms *
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              [(ngModel)]="formData.bedrooms"
              #bedrooms="ngModel"
              required
              min="0"
              class="form-input"
              [class.error]="bedrooms.invalid && bedrooms.touched"
              placeholder="2"
            >
            <p *ngIf="bedrooms.invalid && bedrooms.touched" class="error-message">
              Number of bedrooms is required
            </p>
          </div>

          <div class="form-group">
            <label for="bathrooms" class="form-label">
              Bathrooms *
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              [(ngModel)]="formData.bathrooms"
              #bathrooms="ngModel"
              required
              min="0"
              step="0.5"
              class="form-input"
              [class.error]="bathrooms.invalid && bathrooms.touched"
              placeholder="2"
            >
            <p *ngIf="bathrooms.invalid && bathrooms.touched" class="error-message">
              Number of bathrooms is required
            </p>
          </div>

          <div class="form-group">
            <label for="area" class="form-label">
              Area (sqft) *
            </label>
            <input
              type="number"
              id="area"
              name="area"
              [(ngModel)]="formData.area"
              #area="ngModel"
              required
              min="0"
              class="form-input"
              [class.error]="area.invalid && area.touched"
              placeholder="1200"
            >
            <p *ngIf="area.invalid && area.touched" class="error-message">
              Property area is required
            </p>
          </div>
        </div>

        <!-- Property Type -->
        <div class="form-group">
          <label for="propertyType" class="form-label">
            Property Type *
          </label>
          <select
            id="propertyType"
            name="propertyType"
            [(ngModel)]="formData.propertyType"
            #propertyType="ngModel"
            required
            class="form-select"
            [class.error]="propertyType.invalid && propertyType.touched"
          >
            <option value="">Select property type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Condo">Condo</option>
            <option value="Studio">Studio</option>
          </select>
          <p *ngIf="propertyType.invalid && propertyType.touched" class="error-message">
            Property type is required
          </p>
        </div>

        <!-- Amenities -->
        <div class="form-group">
          <label class="form-label">Amenities</label>
          
          <!-- Selected Amenities -->
          <div *ngIf="formData.amenities.length > 0" class="amenities-list">
            <span
              *ngFor="let amenity of formData.amenities"
              class="amenity-tag"
            >
              {{amenity}}
              <app-button
                variant="ghost"
                size="icon"
                (onClick)="removeAmenity(amenity)"
                className="remove-amenity"
              >
                <lucide-icon [img]="X" class="icon-xs"></lucide-icon>
              </app-button>
            </span>
          </div>

          <!-- Add Amenity -->
          <div class="amenity-input-group">
            <input
              type="text"
              [(ngModel)]="newAmenity"
              name="newAmenity"
              (keypress)="onAmenityKeyPress($event)"
              class="form-input"
              placeholder="Type amenity name..."
            >
            <app-button
              variant="default"
              type="button"
              (onClick)="addAmenity(newAmenity)"
            >
              <lucide-icon [img]="Plus" class="icon-sm"></lucide-icon>
              Add
            </app-button>
          </div>

          <!-- Suggestions -->
          <div class="amenity-suggestions">
            <app-button
              *ngFor="let amenity of getAvailableAmenities()"
              variant="outline"
              size="sm"
              type="button"
              (onClick)="addAmenity(amenity)"
            >
              + {{amenity}}
            </app-button>
          </div>
        </div>

        <!-- Property Images -->
        <div class="form-group">
          <label class="form-label">Property Images</label>
          
          <!-- Current Images -->
          <div *ngIf="formData.photos.length > 0" class="images-grid">
            <div *ngFor="let photo of formData.photos; let i = index" class="image-item">
              <img [src]="photo" [alt]="'Property image ' + (i + 1)" class="image-preview">
              <app-button
                variant="destructive"
                size="icon"
                (onClick)="removePhoto(i)"
                className="remove-image"
              >
                <lucide-icon [img]="X" class="icon-xs"></lucide-icon>
              </app-button>
            </div>
          </div>

          <!-- File Upload -->
          <div class="upload-area" (click)="triggerFileUpload()">
            <input
              type="file"
              id="imageUpload"
              multiple
              accept="image/*"
              (change)="onFileSelect($event)"
              class="hidden"
            >
            <lucide-icon [img]="Upload" class="upload-icon"></lucide-icon>
            <span class="upload-text">Click to upload images</span>
            <span class="upload-subtext">PNG, JPG up to 5MB each</span>
          </div>

          <!-- Add Image URL -->
          <div class="url-input-section">
            <div class="url-label">Or add image URL:</div>
            <div class="url-input-group">
              <input
                type="url"
                [(ngModel)]="newImageUrl"
                name="newImageUrl"
                (keypress)="onImageUrlKeyPress($event)"
                class="form-input"
                placeholder="Enter image URL..."
              >
              <app-button
                variant="default"
                type="button"
                (onClick)="addImageUrl()"
              >
                <lucide-icon [img]="Plus" class="icon-sm"></lucide-icon>
                Add
              </app-button>
            </div>
          </div>
        </div>

        <!-- Availability -->
        <div class="checkbox-group">
          <input
            type="checkbox"
            id="available"
            name="available"
            [(ngModel)]="formData.available"
            class="form-checkbox"
          >
          <label for="available" class="checkbox-label">
            Property is available for rent
          </label>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <app-button
            variant="outline"
            size="lg"
            type="button"
            (onClick)="goBack()"
            className="action-button"
          >
            Cancel
          </app-button>
          <app-button
            variant="default"
            size="lg"
            type="submit"
            [disabled]="loading"
            className="action-button submit-button"
          >
            <div *ngIf="loading" class="loading-spinner"></div>
            <span *ngIf="!loading">{{isEditMode ? 'Update Property' : 'Add Property'}}</span>
          </app-button>
        </div>
      </form>
    </div>

    <app-footer></app-footer>
  `,
  styleUrls: ['./add-property.component.scss']
})
export class AddPropertyComponent {
  isEditMode = false;
  loading = false;
  newAmenity = '';
  newImageUrl = '';

  sampleImageUrls = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'
  ];

  formData = {
    title: '',
    description: '',
    rent: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    propertyType: '',
    amenities: [] as string[],
    photos: [] as string[],
    available: true
  };

  amenitiesSuggestions = [
    'Parking', 'Gym', 'Pool', 'WiFi', 'Air Conditioning', 'Laundry',
    'Pet Friendly', 'Security', 'Garden', 'Balcony', 'Furnished'
  ];

  readonly Upload = Upload;
  readonly X = X;
  readonly Plus = Plus;
  readonly ArrowLeft = ArrowLeft;

  constructor(
    private ownerService: OwnerService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
    private propertyStateService: PropertyStateService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;
    
    if (this.isEditMode) {
      // Load existing property data for edit mode
      this.formData = {
        title: 'Modern Downtown Apartment',
        description: 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views.',
        rent: '2500',
        location: 'Downtown, NYC',
        bedrooms: '2',
        bathrooms: '2',
        area: '1200',
        propertyType: 'Apartment',
        amenities: ['Parking', 'Gym', 'Pool', 'WiFi'],
        photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
        available: true
      };
    }
  }

  addAmenity(amenity: string) {
    if (amenity && !this.formData.amenities.includes(amenity)) {
      this.formData.amenities.push(amenity);
      this.newAmenity = '';
    }
  }

  addImageUrl(url?: string) {
    const imageUrl = url || this.newImageUrl;
    if (imageUrl && !this.formData.photos.includes(imageUrl)) {
      this.formData.photos.push(imageUrl);
      this.newImageUrl = '';
    }
  }

  removePhoto(index: number) {
    this.formData.photos.splice(index, 1);
  }

  onImageUrlKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.addImageUrl();
    }
  }

  removeAmenity(amenity: string) {
    this.formData.amenities = this.formData.amenities.filter(a => a !== amenity);
  }

  onAmenityKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.addAmenity(this.newAmenity);
    }
  }

  getAvailableAmenities() {
    return this.amenitiesSuggestions.filter(a => !this.formData.amenities.includes(a));
  }

  onSubmit(form: NgForm) {
    console.log('Form submitted', form.valid, this.formData);
    
    if (form.invalid) {
      this.toast.error('Please fill in all required fields');
      // Mark all fields as touched to show validation errors
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      return;
    }

    this.loading = true;
    console.log('Starting submission...');

    // Prepare data for API
    const propertyData = {
      title: this.formData.title,
      description: this.formData.description,
      rent: parseFloat(this.formData.rent),
      location: this.formData.location,
      bedrooms: parseInt(this.formData.bedrooms),
      bathrooms: parseFloat(this.formData.bathrooms),
      area: parseInt(this.formData.area),
      propertyType: this.formData.propertyType,
      amenities: this.formData.amenities,
      photos: this.formData.photos.length > 0 ? this.formData.photos : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'],
      available: this.formData.available
    };

    console.log('Sending property data:', propertyData);
    console.log('Photos array:', propertyData.photos);

    this.ownerService.addProperty(propertyData).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Property added successfully:', response);
        this.toast.success('Property added successfully! Redirecting to dashboard...');
        
        // Trigger updates for dashboard and properties list
        console.log('Triggering state updates...');
        this.propertyStateService.triggerAllUpdates();
        
        // Reset form
        this.resetForm();
        form.resetForm();
        
        // Navigate to dashboard to see updated stats
        setTimeout(() => {
          this.router.navigate(['/owner/dashboard']);
        }, 1000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error adding property:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        let errorMessage = 'Failed to add property. Please try again.';
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        this.toast.error(errorMessage);
      }
    });
  }

  resetForm() {
    this.formData = {
      title: '',
      description: '',
      rent: '',
      location: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      propertyType: '',
      amenities: [],
      photos: [],
      available: true
    };
    this.newAmenity = '';
    this.newImageUrl = '';
  }

  validateForm(): boolean {
    return !!(this.formData.title.trim() && 
             this.formData.description.trim() && 
             this.formData.rent && parseFloat(this.formData.rent) > 0 &&
             this.formData.location.trim() &&
             this.formData.bedrooms && parseInt(this.formData.bedrooms) > 0 &&
             this.formData.bathrooms && parseFloat(this.formData.bathrooms) > 0 &&
             this.formData.area && parseFloat(this.formData.area) > 0 &&
             this.formData.propertyType.trim());
  }

  goBack() {
    this.router.navigate(['/owner/properties']);
  }

  goToDashboard() {
    // Trigger updates before navigating to ensure fresh data
    this.propertyStateService.triggerAllUpdates();
    this.router.navigate(['/owner/dashboard']);
  }

  triggerFileUpload() {
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelect(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.uploadImages(files);
    }
  }

  uploadImages(files: FileList) {
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    this.ownerService.uploadPropertyImages(formData).subscribe({
      next: (response) => {
        if (response.images && response.images.length > 0) {
          this.formData.photos.push(...response.images);
          this.toast.success(`${response.images.length} image(s) uploaded successfully`);
        }
      },
      error: (error) => {
        console.error('Error uploading images:', error);
        this.toast.error('Failed to upload images');
      }
    });
  }
}
