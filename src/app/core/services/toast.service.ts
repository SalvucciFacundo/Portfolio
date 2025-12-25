import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  show(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const id = Date.now().toString();
    this.toastsSignal.update((current) => [...current, { id, message, type }]);

    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  remove(id: string) {
    this.toastsSignal.update((current) => current.filter((t) => t.id !== id));
  }
}
