import { Component, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <header class="modal-header">
          <span>{{ title() }}</span>
          <button class="close-btn" (click)="close.emit()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>
        <main class="modal-content">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .modal-container {
        background: #1e1e1e;
        border: 1px solid #3c3c3c;
        border-radius: 8px;
        width: 100%;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        animation: modalEnter 0.2s ease-out;
      }

      @keyframes modalEnter {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(10px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      .modal-header {
        padding: 12px 16px;
        border-bottom: 1px solid #3c3c3c;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        font-weight: 600;
        color: #ccc;
      }

      .close-btn {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        padding: 4px;
        display: flex;
        &:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        svg {
          width: 16px;
          height: 16px;
        }
      }

      .modal-content {
        padding: 20px;
        max-height: 80vh;
        overflow-y: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  title = input<string>('Dialog');
  close = output<void>();
}
