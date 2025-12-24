import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TerminalService } from '../../core/services/terminal.service';

@Component({
  selector: 'app-contact-preview',
  template: `
    <div class="contact-card shadow">
      <h3>¡Hablemos!</h3>
      <p>Si tienes una propuesta o quieres colaborar, no dudes en escribirme.</p>

      <div class="contact-links">
        <a href="mailto:facundo.salvucci@example.com" class="link-item" (click)="log('Email')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
          <span>Email</span>
        </a>
        <a href="#" class="link-item" (click)="log('LinkedIn')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path
              d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
            />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
          <span>LinkedIn</span>
        </a>
      </div>
    </div>
  `,
  styles: [
    `
      .contact-card {
        background: #1e1e2e;
        padding: 30px;
        border-radius: 12px;
        text-align: center;
        max-width: 350px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      h3 {
        color: white;
        margin-bottom: 10px;
      }
      p {
        color: #a9b1d6;
        font-size: 14px;
        margin-bottom: 25px;
        line-height: 1.6;
      }
      .contact-links {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .link-item {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        color: #61afef;
        text-decoration: none;
        transition: all 0.2s;
        border: 1px solid rgba(255, 255, 255, 0.05);

        &:hover {
          background: rgba(97, 175, 239, 0.1);
          transform: translateY(-2px);
        }
        svg {
          width: 18px;
          height: 18px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPreviewComponent {
  private terminal = inject(TerminalService);

  log(platform: string) {
    this.terminal.log(`> Intentando conectar vía ${platform}...`, 'info');
    this.terminal.log(`> Redirección exitosa.`, 'success');
  }
}
