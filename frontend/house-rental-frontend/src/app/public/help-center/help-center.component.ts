import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AuthService } from '../../core/services/auth.service';
import { LucideAngularModule, Heart, HelpCircle, MessageCircle, Phone } from 'lucide-angular';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, LucideAngularModule],
  template: `
    <app-navbar></app-navbar>
    
    <div class="help-center-container">
      <div class="hero-section">
        <div class="hero-content">
          <lucide-icon [img]="Heart" class="hero-icon"></lucide-icon>
          <h1 class="hero-title">We're Here to Help You</h1>
          <p class="hero-subtitle">
            Your comfort and satisfaction are our top priorities. We're committed to making your rental journey as smooth and pleasant as possible.
          </p>
        </div>
      </div>

      <div class="content-section">
        <div class="faq-section">
          <h2 class="section-title">
            <lucide-icon [img]="HelpCircle" class="section-icon"></lucide-icon>
            Frequently Asked Questions
          </h2>
          
          <div class="faq-grid">
            <!-- Tenant FAQs -->
            <div class="faq-item" *ngIf="!authService.isOwner()">
              <h3 class="faq-question">How do I book a property?</h3>
              <p class="faq-answer">
                We've made it incredibly simple! Just browse our beautiful properties, click on one you love, and hit the "Book Now" button. 
                We'll guide you through each step with care and attention to detail.
              </p>
            </div>

            <div class="faq-item" *ngIf="!authService.isOwner()">
              <h3 class="faq-question">What if I need to cancel my booking?</h3>
              <p class="faq-answer">
                Life happens, and we completely understand! Please reach out to us as soon as possible. 
                We'll work with you compassionately to find the best solution for your situation.
              </p>
            </div>

            <!-- Owner FAQs -->
            <div class="faq-item" *ngIf="authService.isOwner()">
              <h3 class="faq-question">How do I list my property?</h3>
              <p class="faq-answer">
                Getting started is easy! Navigate to "Add Property" from your dashboard. We'll walk you through uploading photos, 
                setting descriptions, and pricing your property to attract the perfect tenants.
              </p>
            </div>

            <div class="faq-item" *ngIf="authService.isOwner()">
              <h3 class="faq-question">How do I manage bookings?</h3>
              <p class="faq-answer">
                Your dashboard provides a comprehensive view of all bookings, tenant communications, and property performance. 
                We make property management simple and stress-free.
              </p>
            </div>

            <!-- Common FAQs -->
            <div class="faq-item">
              <h3 class="faq-question">How do I contact {{ authService.isOwner() ? 'tenants' : 'property owners' }}?</h3>
              <p class="faq-answer">
                Once you're logged in, you can easily connect through our secure messaging system. 
                We facilitate warm, friendly communication between {{ authService.isOwner() ? 'owners and tenants' : 'tenants and owners' }}.
              </p>
            </div>

            <div class="faq-item">
              <h3 class="faq-question">Is my personal information safe?</h3>
              <p class="faq-answer">
                Absolutely! We treat your privacy with the utmost respect and care. Your personal information is protected with 
                industry-leading security measures because your trust means everything to us.
              </p>
            </div>
          </div>
        </div>

        <div class="support-section">
          <h2 class="section-title">
            <lucide-icon [img]="MessageCircle" class="section-icon"></lucide-icon>
            Still Need Help?
          </h2>
          
          <div class="support-content">
            <p class="support-text">
              We're always here for you with a smile! Our friendly support team is ready to assist you with any questions, 
              concerns, or just to chat about your rental needs. Don't hesitate to reach out - we genuinely care about your experience.
            </p>
            
            <div class="support-actions">
              <a routerLink="/contact" class="support-btn">
                <lucide-icon [img]="Phone" class="btn-icon"></lucide-icon>
                Contact Our Friendly Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .help-center-container {
      min-height: 100vh;
      background: #f9fafb;
      padding-top: 70px;
    }

    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 2rem;
      color: #fbbf24;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      line-height: 1.6;
    }

    .content-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 2rem;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 2rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 2rem;
    }

    .section-icon {
      width: 32px;
      height: 32px;
      color: #667eea;
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .faq-item {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .faq-question {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 1rem;
    }

    .faq-answer {
      color: #374151;
      line-height: 1.6;
    }

    .support-section {
      background: white;
      padding: 3rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      text-align: center;
    }

    .support-text {
      font-size: 1.125rem;
      color: #374151;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .support-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 0.75rem;
      font-weight: 600;
      transition: all 0.2s;
    }

    .support-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-icon {
      width: 20px;
      height: 20px;
    }
  `]
})
export class HelpCenterComponent {
  readonly Heart = Heart;
  readonly HelpCircle = HelpCircle;
  readonly MessageCircle = MessageCircle;
  readonly Phone = Phone;

  constructor(public authService: AuthService) {}
}