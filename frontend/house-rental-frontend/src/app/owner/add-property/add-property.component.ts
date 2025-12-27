import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { OwnerService } from '../../core/services/owner.service';
import { ToastService } from '../../core/services/toast.service';
import { LucideAngularModule, Upload, X, Plus, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, LucideAngularModule],
  template: `
    <app-navbar></app-navbar>
    
    <div class="max-w-4xl mx-auto px-4 py-8 mt-16">
      <div class="mb-8">
        <button 
          type="button" 
          (click)="goToDashboard()" 
          class="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors bg-transparent border-none cursor-pointer p-0 outline-none"
        >
          <lucide-icon [img]="ArrowLeft" class="w-4 h-4"></lucide-icon>
          Back to Dashboard
        </button>
        <h1 class="text-3xl text-gray-900 mb-2">
          {{isEditMode ? 'Edit Property' : 'Add New Property'}}
        </h1>
        <p class="text-gray-600">
          {{isEditMode ? 'Update your property details' : 'Fill in the details to list your property'}}
        </p>
      </div>

      <form #propertyForm="ngForm" (ngSubmit)="onSubmit(propertyForm)" class="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-gray-700 mb-2">
            Property Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            [(ngModel)]="formData.title"
            #title="ngModel"
            required
            class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
            [class.border-red-500]="title.invalid && title.touched"
            [class.border-gray-300]="!title.invalid || !title.touched"
            placeholder="e.g., Modern Downtown Apartment"
          >
          <p *ngIf="title.invalid && title.touched" class="mt-1 text-sm text-red-600">
            Title is required
          </p>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            [(ngModel)]="formData.description"
            #description="ngModel"
            required
            rows="4"
            class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
            [class.border-red-500]="description.invalid && description.touched"
            [class.border-gray-300]="!description.invalid || !description.touched"
            placeholder="Describe your property in detail..."
          ></textarea>
          <p *ngIf="description.invalid && description.touched" class="mt-1 text-sm text-red-600">
            Description is required
          </p>
        </div>

        <!-- Rent and Location -->
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label for="rent" class="block text-gray-700 mb-2">
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
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
              [class.border-red-500]="rent.invalid && rent.touched"
              [class.border-gray-300]="!rent.invalid || !rent.touched"
              placeholder="2500"
            >
            <p *ngIf="rent.invalid && rent.touched" class="mt-1 text-sm text-red-600">
              Valid rent amount is required
            </p>
          </div>

          <div>
            <label for="location" class="block text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              [(ngModel)]="formData.location"
              #location="ngModel"
              required
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
              [class.border-red-500]="location.invalid && location.touched"
              [class.border-gray-300]="!location.invalid || !location.touched"
              placeholder="City, State"
            >
            <p *ngIf="location.invalid && location.touched" class="mt-1 text-sm text-red-600">
              Location is required
            </p>
          </div>
        </div>

        <!-- Property Details -->
        <div class="grid md:grid-cols-3 gap-6">
          <div>
            <label for="bedrooms" class="block text-gray-700 mb-2">
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
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
              [class.border-red-500]="bedrooms.invalid && bedrooms.touched"
              [class.border-gray-300]="!bedrooms.invalid || !bedrooms.touched"
              placeholder="2"
            >
            <p *ngIf="bedrooms.invalid && bedrooms.touched" class="mt-1 text-sm text-red-600">
              Number of bedrooms is required
            </p>
          </div>

          <div>
            <label for="bathrooms" class="block text-gray-700 mb-2">
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
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
              [class.border-red-500]="bathrooms.invalid && bathrooms.touched"
              [class.border-gray-300]="!bathrooms.invalid || !bathrooms.touched"
              placeholder="2"
            >
            <p *ngIf="bathrooms.invalid && bathrooms.touched" class="mt-1 text-sm text-red-600">
              Number of bathrooms is required
            </p>
          </div>

          <div>
            <label for="area" class="block text-gray-700 mb-2">
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
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
              [class.border-red-500]="area.invalid && area.touched"
              [class.border-gray-300]="!area.invalid || !area.touched"
              placeholder="1200"
            >
            <p *ngIf="area.invalid && area.touched" class="mt-1 text-sm text-red-600">
              Property area is required
            </p>
          </div>
        </div>

        <!-- Amenities -->
        <div>
          <label class="block text-gray-700 mb-2">Amenities</label>
          
          <!-- Selected Amenities -->
          <div *ngIf="formData.amenities.length > 0" class="flex flex-wrap gap-2 mb-3">
            <span
              *ngFor="let amenity of formData.amenities"
              class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full"
            >
              {{amenity}}
              <button
                type="button"
                (click)="removeAmenity(amenity)"
                class="hover:text-indigo-900 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200 bg-transparent border-none"
              >
                <lucide-icon [img]="X" class="w-3 h-3"></lucide-icon>
              </button>
            </span>
          </div>

          <!-- Add Amenity -->
          <div class="flex gap-2 mb-3">
            <input
              type="text"
              [(ngModel)]="newAmenity"
              name="newAmenity"
              (keypress)="onAmenityKeyPress($event)"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="Type amenity name..."
            >
            <button
              type="button"
              (click)="addAmenity(newAmenity)"
              class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <lucide-icon [img]="Plus" class="w-5 h-5"></lucide-icon>
              Add
            </button>
          </div>

          <!-- Suggestions -->
          <div class="flex flex-wrap gap-2">
            <button
              *ngFor="let amenity of getAvailableAmenities()"
              type="button"
              (click)="addAmenity(amenity)"
              class="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50"
            >
              + {{amenity}}
            </button>
          </div>
        </div>

        <!-- Image Upload -->
        <div>
          <label class="block text-gray-700 mb-2">Property Images</label>
          <input 
            type="file" 
            id="imageUpload" 
            multiple 
            accept="image/jpeg,image/jpg,image/png" 
            (change)="onFileSelect($event)" 
            class="hidden"
          >
          <div 
            (click)="triggerFileUpload()" 
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 focus-within:border-indigo-500 transition-all duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <lucide-icon [img]="Upload" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-icon>
            <p class="text-gray-600 mb-2">Click to upload or drag and drop</p>
            <p class="text-sm text-gray-500">PNG, JPG up to 10MB</p>
          </div>
        </div>

        <!-- Availability -->
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            id="available"
            name="available"
            [(ngModel)]="formData.available"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          >
          <label for="available" class="text-gray-700">
            Property is available for rent
          </label>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            (click)="goBack()"
            class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-center font-medium text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="loading"
            class="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-medium"
          >
            <div *ngIf="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span *ngIf="!loading">{{isEditMode ? 'Update Property' : 'Add Property'}}</span>
          </button>
        </div>
      </form>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .max-w-4xl {
      max-width: 56rem;
    }
    
    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }
    
    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    .py-8 {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }
    
    .mt-16 {
      margin-top: 4rem;
    }
    
    .mb-8 {
      margin-bottom: 2rem;
    }
    
    .mb-2 {
      margin-bottom: 0.5rem;
    }
    
    .mb-3 {
      margin-bottom: 0.75rem;
    }
    
    .mb-4 {
      margin-bottom: 1rem;
    }
    
    .transition-colors {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
    }
    
    .text-3xl {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
    
    .text-gray-900 {
      color: #111827;
    }
    
    .text-gray-600 {
      color: #4b5563;
    }
    
    .text-gray-700 {
      color: #374151;
    }
    
    .text-gray-800 {
      color: #1f2937;
    }
    
    .text-red-600 {
      color: #dc2626;
    }
    
    .text-indigo-700 {
      color: #3730a3;
    }
    
    .text-white {
      color: #ffffff;
    }
    
    .text-sm {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    
    .text-gray-500 {
      color: #6b7280;
    }
    
    .placeholder-gray-500::placeholder {
      color: #6b7280;
    }
    
    .resize-none {
      resize: none;
    }
    
    .font-medium {
      font-weight: 500;
    }
    
    .duration-200 {
      transition-duration: 200ms;
    }
    
    .transition-all {
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .bg-white {
      background-color: #ffffff;
    }
    
    .bg-indigo-100 {
      background-color: #e0e7ff;
    }
    
    .bg-indigo-600 {
      background-color: #4f46e5;
    }
    
    .bg-gray-50 {
      background-color: #f9fafb;
    }
    
    .bg-gray-400 {
      background-color: #9ca3af;
    }
    
    .rounded-lg {
      border-radius: 0.5rem;
    }
    
    .rounded-full {
      border-radius: 9999px;
    }
    
    .shadow-sm {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    
    .p-6 {
      padding: 1.5rem;
    }
    
    .p-8 {
      padding: 2rem;
    }
    
    .p-1 {
      padding: 0.25rem;
    }
    
    .bg-transparent {
      background-color: transparent;
    }
    
    .bg-opacity-20 {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .hover\:bg-opacity-20:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .bg-indigo-200 {
      background-color: #c7d2fe;
    }
    
    .border-none {
      border: none;
      outline: none;
    }
    
    .hidden {
      display: none;
    }
    
    .px-3 {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
    
    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    .py-1 {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }
    
    .py-2 {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    
    .py-3 {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }
    
    .px-6 {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    
    .pt-6 {
      padding-top: 1.5rem;
    }
    
    .mt-1 {
      margin-top: 0.25rem;
    }
    
    .space-y-6 > * + * {
      margin-top: 1.5rem;
    }
    
    .block {
      display: block;
    }
    
    .flex {
      display: flex;
    }
    
    .inline-flex {
      display: inline-flex;
    }
    
    .grid {
      display: grid;
    }
    
    .w-full {
      width: 100%;
    }
    
    .w-3 {
      width: 0.75rem;
    }
    
    .w-4 {
      width: 1rem;
    }
    
    .w-5 {
      width: 1.25rem;
    }
    
    .w-12 {
      width: 3rem;
    }
    
    .h-3 {
      height: 0.75rem;
    }
    
    .h-4 {
      height: 1rem;
    }
    
    .h-5 {
      height: 1.25rem;
    }
    
    .h-12 {
      height: 3rem;
    }
    
    .flex-1 {
      flex: 1 1 0%;
    }
    
    .flex-wrap {
      flex-wrap: wrap;
    }
    
    .items-center {
      align-items: center;
    }
    
    .justify-center {
      justify-content: center;
    }
    
    .gap-2 {
      gap: 0.5rem;
    }
    
    .gap-3 {
      gap: 0.75rem;
    }
    
    .gap-4 {
      gap: 1rem;
    }
    
    .gap-6 {
      gap: 1.5rem;
    }
    
    .border {
      border-width: 1px;
    }
    
    .border-2 {
      border-width: 2px;
    }
    
    .border-t {
      border-top-width: 1px;
    }
    
    .border-dashed {
      border-style: dashed;
    }
    
    .border-gray-200 {
      border-color: #e5e7eb;
    }
    
    .border-gray-300 {
      border-color: #d1d5db;
    }
    
    .border-indigo-500 {
      border-color: #6366f1;
    }
    
    .border-red-500 {
      border-color: #ef4444;
    }
    
    .cursor-pointer {
      cursor: pointer;
    }
    
    .text-center {
      text-align: center;
    }
    
    .transition-colors {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
    }
    
    .focus\:ring-2:focus {
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5);
    }
    
    .focus\:ring-indigo-500:focus {
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5);
    }
    
    .focus\:ring-gray-500:focus {
      box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.5);
    }
    
    .focus\:ring-offset-2:focus {
      box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px rgba(79, 70, 229, 0.5);
    }
    
    .focus\:border-indigo-500:focus {
      border-color: #6366f1;
    }
    
    .focus-within\:border-indigo-500:focus-within {
      border-color: #6366f1;
    }
    
    .focus\:border-transparent:focus {
      border-color: transparent;
    }
    
    .hover\:bg-gray-50:hover {
      background-color: #f9fafb;
    }
    
    .hover\:bg-gray-100:hover {
      background-color: #f3f4f6;
    }
    
    .hover\:bg-indigo-700:hover {
      background-color: #4338ca;
    }
    
    .hover\:border-indigo-400:hover {
      border-color: #818cf8;
    }
    
    .hover\:text-indigo-900:hover {
      color: #312e81;
    }
    
    .hover\:text-gray-800:hover {
      color: #1f2937;
    }
    
    .hover\:border-indigo-500:hover {
      border-color: #6366f1;
    }
    
    .disabled\:opacity-50:disabled {
      opacity: 0.5;
    }
    
    .disabled\:cursor-not-allowed:disabled {
      cursor: not-allowed;
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    .border-b-2 {
      border-bottom-width: 2px;
    }
    
    .border-white {
      border-color: #ffffff;
    }
    
    @media (min-width: 768px) {
      .md\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      
      .md\:grid-cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
  `]
})
export class AddPropertyComponent {
  isEditMode = false;
  loading = false;
  newAmenity = '';

  formData = {
    title: '',
    description: '',
    rent: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: [] as string[],
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
    private toast: ToastService
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
        amenities: ['Parking', 'Gym', 'Pool', 'WiFi'],
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

  removeAmenity(amenity: string) {
    this.formData.amenities = this.formData.amenities.filter(a => a !== amenity);
  }

  onAmenityKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
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

    // Mock success/failure for UI testing
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% success rate
      
      if (isSuccess) {
        this.loading = false;
        if (this.isEditMode) {
          this.toast.success('Property updated successfully!');
        } else {
          this.toast.success('Property added successfully!');
        }
        // Reset form
        this.resetForm();
        form.resetForm();
        // Navigate back to properties page
        setTimeout(() => {
          this.router.navigate(['/owner/properties']);
        }, 1500);
      } else {
        this.loading = false;
        this.toast.error('Failed to save property. Please try again.');
      }
    }, 2000);
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
      amenities: [],
      available: true
    };
    this.newAmenity = '';
  }

  validateForm(): boolean {
    return !!(this.formData.title.trim() && 
             this.formData.description.trim() && 
             this.formData.rent && parseFloat(this.formData.rent) > 0 &&
             this.formData.location.trim() &&
             this.formData.bedrooms && parseInt(this.formData.bedrooms) > 0 &&
             this.formData.bathrooms && parseInt(this.formData.bathrooms) > 0 &&
             this.formData.area && parseFloat(this.formData.area) > 0);
  }

  goBack() {
    this.router.navigate(['/owner/properties']);
  }

  goToDashboard() {
    this.router.navigate(['/owner/dashboard']);
  }

  triggerFileUpload() {
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelect(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic here
      console.log('Selected files:', files);
      this.toast.success(`${files.length} image(s) selected`);
    }
  }
}