import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Property {
  id: number;
  title: string;
  location: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  description: string;
  images: string[];
  amenities: string[];
  available: boolean;
  owner: {
    name: string;
    phone: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-details.html',
  styleUrls: ['./property-details.css']
})
export class PropertyDetails implements OnInit {
  property: Property | null = null;
  currentImageIndex = 0;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadPropertyDetails(+id);
  }

  loadPropertyDetails(id: number) {
    // Mock data - in a real app, this would come from an API
    const mockProperties: Property[] = [
      {
        id: 1,
        title: 'Modern Downtown Apartment',
        location: 'Downtown, City Center',
        rent: 2500,
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        type: 'Apartment',
        description: 'Beautiful modern apartment in the heart of downtown. Features floor-to-ceiling windows, hardwood floors, and a gourmet kitchen. Walking distance to restaurants, shops, and public transportation.',
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
        ],
        amenities: ['Parking', 'Gym', 'Pool', 'Concierge', 'In-unit Laundry', 'Dishwasher', 'Air Conditioning'],
        available: true,
        owner: {
          name: 'Sarah Johnson',
          phone: '+1 (555) 123-4567',
          email: 'sarah.johnson@email.com'
        },
        address: {
          street: '123 Main Street, Apt 4B',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        }
      },
      {
        id: 2,
        title: 'Cozy Studio in Midtown',
        location: 'Midtown, Business District',
        rent: 1800,
        bedrooms: 1,
        bathrooms: 1,
        area: 650,
        type: 'Studio',
        description: 'Charming studio apartment perfect for young professionals. Recently renovated with modern appliances and plenty of natural light.',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1486304873000-235643847519?w=800'
        ],
        amenities: ['Parking', 'Gym', 'Rooftop Terrace', 'In-unit Laundry'],
        available: true,
        owner: {
          name: 'Mike Chen',
          phone: '+1 (555) 987-6543',
          email: 'mike.chen@email.com'
        },
        address: {
          street: '456 Business Ave, Unit 12C',
          city: 'New York',
          state: 'NY',
          zipCode: '10018'
        }
      },
      {
        id: 3,
        title: 'Spacious Family House',
        location: 'Suburb, Quiet Neighborhood',
        rent: 3500,
        bedrooms: 4,
        bathrooms: 3,
        area: 2400,
        type: 'House',
        description: 'Beautiful family home with large backyard, perfect for families. Features updated kitchen, master suite, and attached garage.',
        images: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
          'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800'
        ],
        amenities: ['Garage', 'Garden', 'Fireplace', 'Walk-in Closet', 'Dishwasher', 'Washer/Dryer'],
        available: true,
        owner: {
          name: 'David Wilson',
          phone: '+1 (555) 456-7890',
          email: 'david.wilson@email.com'
        },
        address: {
          street: '789 Oak Street',
          city: 'Westfield',
          state: 'NJ',
          zipCode: '07090'
        }
      },
      {
        id: 4,
        title: 'Luxury Condo with City View',
        location: 'Uptown, Premium Area',
        rent: 4200,
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        type: 'Condo',
        description: 'Stunning luxury condo with panoramic city views.',
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
        ],
        amenities: ['Parking', 'Gym', 'Pool'],
        available: false,
        owner: {
          name: 'Jennifer Martinez',
          phone: '+1 (555) 234-5678',
          email: 'jennifer.martinez@email.com'
        },
        address: {
          street: '999 Skyline Blvd',
          city: 'New York',
          state: 'NY',
          zipCode: '10065'
        }
      },
      {
        id: 5,
        title: 'Charming Garden Apartment',
        location: 'Garden District, Residential',
        rent: 2200,
        bedrooms: 2,
        bathrooms: 1,
        area: 950,
        type: 'Apartment',
        description: 'Lovely garden apartment with patio.',
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
        ],
        amenities: ['Garden', 'Pet-friendly'],
        available: true,
        owner: {
          name: 'Robert Taylor',
          phone: '+1 (555) 345-6789',
          email: 'robert.taylor@email.com'
        },
        address: {
          street: '567 Garden Lane',
          city: 'Brooklyn',
          state: 'NY',
          zipCode: '11215'
        }
      },
      {
        id: 6,
        title: 'Modern Loft Space',
        location: 'Arts District',
        rent: 2800,
        bedrooms: 1,
        bathrooms: 1,
        area: 1100,
        type: 'Apartment',
        description: 'Trendy modern loft with exposed brick.',
        images: [
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
        ],
        amenities: ['High Ceilings', 'Exposed Brick'],
        available: true,
        owner: {
          name: 'Emily Rodriguez',
          phone: '+1 (555) 456-7891',
          email: 'emily.rodriguez@email.com'
        },
        address: {
          street: '234 Art Street',
          city: 'Brooklyn',
          state: 'NY',
          zipCode: '11211'
        }
      }
    ];

    this.property = mockProperties.find(p => p.id === id) || null;
  }

  nextImage() {
    if (this.property && this.currentImageIndex < this.property.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  setCurrentImage(index: number) {
    this.currentImageIndex = index;
  }

  requestBooking() {
    if (this.property) {
      this.router.navigate(['/properties', this.property.id, 'book']);
    }
  }

  goBack() {
    this.router.navigate(['/properties']);
  }

  contactOwner() {
    if (this.property) {
      window.location.href = `mailto:${this.property.owner.email}?subject=Inquiry about ${this.property.title}`;
    }
  }
}