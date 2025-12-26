import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PropertyService, Property } from '../../core/services/property.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoaderComponent,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent implements OnInit {
  property: Property | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProperty(parseInt(id));
    }
  }

  loadProperty(id: number) {
    this.loading = true;
    this.error = '';

    this.propertyService.getProperty(id).subscribe({
      next: (response: {property: Property, message: string}) => {
        this.property = {
          ...response.property,
          image: response.property.photos && response.property.photos.length > 0 
            ? response.property.photos[0] 
            : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
        };
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load property details';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/properties']);
  }

  contactOwner() {
    // Implement contact functionality
    alert('Contact functionality will be implemented');
  }

  bookProperty() {
    // Implement booking functionality
    alert('Booking functionality will be implemented');
  }
}