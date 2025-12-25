import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
      <div class="toast" [class]="toast.type" (click)="toastService.remove(toast.id)">
        <div class="icon">
          @switch (toast.type) { @case ('success') { <span class="badge success">✓</span> } @case
          ('error') { <span class="badge error">!</span> } @default {
          <span class="badge info">i</span> } }
        </div>
        <div class="message">{{ toast.message }}</div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      }

      .toast {
        pointer-events: auto;
        min-width: 280px;
        max-width: 400px;
        background: rgba(30, 30, 30, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
        cursor: pointer;
        animation: toast-in 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        transition: all 0.3s;
      }

      .toast:hover {
        transform: scale(1.02);
        border-color: rgba(255, 255, 255, 0.2);
      }

      @keyframes toast-in {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .badge {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
      }

      .success .badge {
        background: #238636;
        color: white;
      }
      .error .badge {
        background: #da3633;
        color: white;
      }
      .info .badge {
        background: #388bfd;
        color: white;
      }

      .message {
        font-size: 14px;
        color: #c9d1d9;
        font-weight: 500;
        letter-spacing: 0.3px;
      }

      .toast.success {
        border-left: 4px solid #238636;
      }
      .toast.error {
        border-left: 4px solid #da3633;
      }
      .toast.info {
        border-left: 4px solid #388bfd;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ToastComponent {
  protected toastService = inject(ToastService);
}
