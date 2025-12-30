import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  show: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private addToast(type: Toast['type'], message: string, description?: string) {
    const toast: Toast = {
      id: this.generateId(),
      type,
      message,
      description,
      show: true
    };

    // Use setTimeout to avoid change detection issues
    setTimeout(() => {
      const currentToasts = this.toastsSubject.value;
      this.toastsSubject.next([...currentToasts, toast]);
    }, 0);

    // Auto remove
    setTimeout(() => {
      this.remove(toast.id);
    }, type === 'error' ? 5000 : 4000);
  }

  success(message: string, description?: string) {
    this.addToast('success', message, description);
  }

  error(message: string, description?: string) {
    this.addToast('error', message, description);
  }

  warning(message: string, description?: string) {
    this.addToast('warning', message, description);
  }

  info(message: string, description?: string) {
    this.addToast('info', message, description);
  }

  remove(id: string) {
    const currentToasts = this.toastsSubject.value;
    const updatedToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(updatedToasts);
  }

  loading(message: string) {
    return this.addToast('info', message);
  }

  dismiss(id?: string) {
    if (id) {
      this.remove(id);
    } else {
      this.toastsSubject.next([]);
    }
  }
}