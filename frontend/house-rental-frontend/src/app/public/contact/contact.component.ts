import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { LucideAngularModule, Heart, Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-angular';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent, LucideAngularModule],
  template: `
    <app-navbar></app-navbar>
    
    <div class="contact-container">
      <div class="hero-section">
        <div class="hero-content">
          <lucide-icon [img]="Heart" class="hero-icon"></lucide-icon>
          <h1 class="hero-title">We'd Love to Hear From You</h1>
          <p class="hero-subtitle">
            Your thoughts, questions, and feedback mean the world to us. We're here to listen, help, and make your experience wonderful.
          </p>
        </div>
      </div>

      <div class="content-section">
        <div class="contact-grid">
          <div class="contact-info">
            <h2 class="section-title">Get in Touch</h2>
            <p class="section-description">
              We believe every conversation is an opportunity to build something beautiful together. 
              Whether you have questions, need assistance, or just want to share your experience, we're here with open hearts and minds.
            </p>

            <div class="contact-methods">
              <div class="contact-method">
                <lucide-icon [img]="Mail" class="method-icon"></lucide-icon>
                <div class="method-content">
                  <h3 class="method-title">Email Us</h3>
                  <p class="method-description">Drop us a line anytime! We read every message with care.</p>
                  <a href="mailto:hello@rentease.com" class="method-link">hello@rentease.com</a>
                </div>
              </div>

              <div class="contact-method">
                <lucide-icon [img]="Phone" class="method-icon"></lucide-icon>
                <div class="method-content">
                  <h3 class="method-title">Call Us</h3>
                  <p class="method-description">Speak directly with our friendly team members.</p>
                  <a href="tel:+1-555-RENTEASE" class="method-link">+1 (555) RENT-EASE</a>
                </div>
              </div>

              <div class="contact-method">
                <lucide-icon [img]="MapPin" class="method-icon"></lucide-icon>
                <div class="method-content">
                  <h3 class="method-title">Visit Us</h3>
                  <p class="method-description">Come by for a warm cup of coffee and a friendly chat.</p>
                  <p class="method-link">123 Harmony Street<br>Kindness City, KC 12345</p>
                </div>
              </div>

              <div class="contact-method">
                <lucide-icon [img]="Clock" class="method-icon"></lucide-icon>
                <div class="method-content">
                  <h3 class="method-title">Office Hours</h3>
                  <p class="method-description">We're here when you need us most.</p>
                  <p class="method-link">Monday - Friday: 8AM - 8PM<br>Weekend: 10AM - 6PM</p>
                </div>
              </div>
            </div>
          </div>

          <div class="message-section">
            <div class="message-card">
              <lucide-icon [img]="MessageSquare" class="card-icon"></lucide-icon>
              <h3 class="card-title">Send Us a Message</h3>
              <p class="card-description">
                We'd be delighted to hear from you! Share your thoughts, ask questions, or just say hello. 
                Every message brings a smile to our faces.
              </p>
              
              <div class="message-form">
                <div class="form-group">
                  <label class="form-label">Your Name</label>
                  <input type="text" class="form-input" [(ngModel)]="contactForm.name" name="name" placeholder="We'd love to know what to call you">
                </div>
                
                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <input type="email" class="form-input" [(ngModel)]="contactForm.email" name="email" placeholder="So we can get back to you">
                </div>
                
                <div class="form-group">
                  <label class="form-label">Subject</label>
                  <input type="text" class="form-input" [(ngModel)]="contactForm.subject" name="subject" placeholder="What's on your mind?">
                </div>
                
                <div class="form-group">
                  <label class="form-label">Your Message</label>
                  <textarea class="form-textarea" rows="5" [(ngModel)]="contactForm.message" name="message" placeholder="Share your thoughts, questions, or feedback. We're all ears!"></textarea>
                </div>
                
                <button class="submit-btn" (click)="sendMessage()">
                  <lucide-icon [img]="Heart" class="btn-icon"></lucide-icon>
                  Send Message with Love
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="appreciation-section">
          <div class="appreciation-content">
            <h2 class="appreciation-title">Thank You for Being Amazing</h2>
            <p class="appreciation-text">
              Every interaction with you makes our day brighter. Whether you're {{ authService.isTenant() ? 'a tenant finding your perfect home' : authService.isOwner() ? 'an owner sharing your beautiful property' : 'a tenant finding your perfect home or an owner sharing your beautiful property' }}, 
              or someone just exploring what we offer - you're the reason we do what we do. 
              Thank you for being part of our wonderful community. 💙
            </p>
          </div>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .contact-container {
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

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      margin-bottom: 4rem;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 1rem;
    }

    .section-description {
      color: #374151;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .contact-methods {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .contact-method {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .method-icon {
      width: 24px;
      height: 24px;
      color: #667eea;
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .method-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.5rem;
    }

    .method-description {
      color: #6b7280;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .method-link {
      color: #667eea;
      font-weight: 500;
      text-decoration: none;
    }

    .method-link:hover {
      text-decoration: underline;
    }

    .message-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .card-icon {
      width: 32px;
      height: 32px;
      color: #667eea;
      margin-bottom: 1rem;
    }

    .card-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 1rem;
    }

    .card-description {
      color: #374151;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .form-input, .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: border-color 0.2s;
    }

    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .submit-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      justify-content: center;
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-icon {
      width: 20px;
      height: 20px;
    }

    .appreciation-section {
      background: white;
      padding: 3rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      text-align: center;
    }

    .appreciation-title {
      font-size: 2rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 1rem;
    }

    .appreciation-text {
      font-size: 1.125rem;
      color: #374151;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .hero-title {
        font-size: 2rem;
      }
    }
  `]
})
export class ContactComponent {
  readonly Heart = Heart;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly Clock = Clock;
  readonly MessageSquare = MessageSquare;

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(public authService: AuthService, private toast: ToastService) {}

  sendMessage() {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      this.toast.warning('Please fill required fields', 'Name, email, and message are required');
      return;
    }

    // Simulate sending message
    this.toast.success('Message sent successfully!', 'Thank you for reaching out. We\'ll get back to you soon!');
    
    // Reset form
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}