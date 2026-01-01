import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertTriangle, RefreshCw, Server } from 'lucide-angular';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="error-container" [ngClass]="{'connection-error': isConnectionError}">
      <div class="error-content">
        <lucide-icon 
          [img]="isConnectionError ? Server : AlertTriangle" 
          class="error-icon"
          [class.connection-icon]="isConnectionError">
        </lucide-icon>
        
        <h3 class="error-title">
          {{ isConnectionError ? 'Server Connection Failed' : 'Something went wrong' }}
        </h3>
        
        <p class="error-message">{{ message }}</p>
        
        <div class="error-actions" *ngIf="showRetry">
          <button 
            class="retry-button" 
            (click)="onRetry()"
            [disabled]="retrying">
            <lucide-icon [img]="RefreshCw" class="retry-icon" [class.spinning]="retrying"></lucide-icon>
            {{ retrying ? 'Retrying...' : 'Try Again' }}
          </button>
        </div>
        
        <div class="error-help" *ngIf="isConnectionError">
          <p class="help-text">To fix this issue:</p>
          <ol class="help-steps">
            <li>Make sure the backend server is running</li>
            <li>Check if port 3001 is available</li>
            <li>Verify your network connection</li>
          </ol>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      padding: 2rem;
      text-align: center;
    }

    .error-content {
      max-width: 500px;
      padding: 2rem;
      border-radius: 12px;
      background: #fef2f2;
      border: 1px solid #fecaca;
    }

    .connection-error .error-content {
      background: #eff6ff;
      border-color: #bfdbfe;
    }

    .error-icon {
      width: 48px;
      height: 48px;
      color: #dc2626;
      margin-bottom: 1rem;
    }

    .connection-icon {
      color: #2563eb;
    }

    .error-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .error-message {
      color: #6b7280;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .retry-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .retry-button:hover:not(:disabled) {
      background: #2563eb;
    }

    .retry-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .retry-icon {
      width: 16px;
      height: 16px;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .error-help {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
      text-align: left;
    }

    .help-text {
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .help-steps {
      color: #6b7280;
      padding-left: 1.25rem;
    }

    .help-steps li {
      margin-bottom: 0.25rem;
    }
  `]
})
export class ErrorDisplayComponent {
  @Input() message = 'An unexpected error occurred';
  @Input() showRetry = true;
  @Input() retrying = false;
  @Output() retry = new EventEmitter<void>();

  readonly AlertTriangle = AlertTriangle;
  readonly RefreshCw = RefreshCw;
  readonly Server = Server;

  get isConnectionError(): boolean {
    return this.message.toLowerCase().includes('connect') || 
           this.message.toLowerCase().includes('server') ||
           this.message.toLowerCase().includes('port 3001');
  }

  onRetry() {
    this.retry.emit();
  }
}