import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  template: `
    <router-outlet />
    <app-toast></app-toast>
  `,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('house-rental-frontend');

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    // Test toast
    setTimeout(() => {
      this.toastService.success('Welcome to RentEase!', 'Toast notifications are now working perfectly.');
    }, 1000);
  }
}
