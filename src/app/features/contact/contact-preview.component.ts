import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { TerminalService } from '../../core/services/terminal.service';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact-preview',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="comms-panel">
      <!-- Sidebar / Left Column: Socials & Email -->
      <aside class="comms-sidebar">
        <header class="sidebar-header">
          <div class="header-badge">
            <div class="status-dot"></div>
            <span>CONTACTO</span>
          </div>
          <h3>¡Hola!</h3>
          <p>
            Estoy disponible para nuevas propuestas o simplemente para charlar sobre tecnología.
          </p>
        </header>

        <div class="connections-list">
          <label class="section-label">Canales Directos</label>

          <div
            class="email-card"
            (click)="copyEmail(state.profile()?.socials?.email || 'facu.salvucci@gmail.com')"
          >
            <div class="email-info">
              <i class="devicon-google-plain colored"></i>
              <div class="text-stack">
                <span class="label">Enviar correo</span>
                <span class="value">{{
                  state.profile()?.socials?.email || 'facu.salvucci@gmail.com'
                }}</span>
              </div>
            </div>
            <div class="copy-hint">
              {{ copyStatus() === 'COPIED!' ? '¡COPIADO!' : 'Clic para copiar' }}
            </div>
          </div>

          <div class="social-links-row">
            @if (state.profile()?.socials?.linkedin; as link) {
            <a [href]="link" target="_blank" class="social-btn linkedin" (click)="log('LinkedIn')">
              <i class="devicon-linkedin-plain"></i>
              <span>LinkedIn</span>
            </a>
            } @if (state.profile()?.socials?.github; as link) {
            <a [href]="link" target="_blank" class="social-btn github" (click)="log('GitHub')">
              <i class="devicon-github-original"></i>
              <span>GitHub</span>
            </a>
            }
          </div>
        </div>
      </aside>

      <!-- Main / Right Column: Form -->
      <main class="comms-content">
        @if (!isSent()) {
        <form (submit)="sendMessage($event)" class="contact-form">
          <div class="form-grid">
            <div class="field-group">
              <label>Nombre completo</label>
              <input
                type="text"
                name="name"
                [(ngModel)]="form.name"
                placeholder="John Doe"
                required
              />
            </div>
            <div class="field-group">
              <label>Tu correo</label>
              <input
                type="email"
                name="email"
                [(ngModel)]="form.email"
                placeholder="email@ejemplo.com"
                required
              />
            </div>
          </div>

          <div class="field-group">
            <label>Asunto</label>
            <input
              type="text"
              name="subject"
              [(ngModel)]="form.subject"
              placeholder="Propuesta de proyecto..."
              required
            />
          </div>

          <div class="field-group">
            <label>Mensaje</label>
            <textarea
              name="message"
              [(ngModel)]="form.message"
              rows="5"
              placeholder="Cuéntame sobre tu proyecto..."
              required
            ></textarea>
          </div>

          <button type="submit" class="send-btn" [disabled]="isSending()">
            <div class="btn-content">
              <span>{{ isSending() ? 'ENVIANDO...' : 'ENVIAR MENSAJE' }}</span>
            </div>
          </button>
        </form>
        } @else {
        <div class="success-screen">
          <div class="checkmark">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3fb950" stroke-width="3">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h4>¡Mensaje Enviado!</h4>
          <p>Gracias por contactarme. Te responderé lo antes posible.</p>
          <button class="secondary-btn" (click)="resetForm()">ENVIAR OTRO</button>
        </div>
        }
      </main>
    </div>
  `,
  styles: [
    `
      .comms-panel {
        display: grid;
        grid-template-columns: 320px 1fr;
        background: rgba(13, 17, 23, 0.4);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
        overflow: hidden;
        min-height: 520px;
        width: 100%;
      }

      /* Sidebar Left */
      .comms-sidebar {
        background: rgba(255, 255, 255, 0.02);
        padding: 30px;
        border-right: 1px solid rgba(255, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .sidebar-header {
        margin-bottom: 30px;
        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(88, 166, 255, 0.1);
          padding: 4px 10px;
          border-radius: 4px;
          color: #58a6ff;
          font-family: var(--font-mono);
          font-size: 9px;
          margin-bottom: 15px;
          .status-dot {
            width: 6px;
            height: 6px;
            background: #3fb950;
            border-radius: 50%;
            box-shadow: 0 0 8px #3fb950;
          }
        }
        h3 {
          color: #e6edf3;
          font-size: 20px;
          margin-bottom: 8px;
        }
        p {
          color: #8b949e;
          font-size: 13px;
          line-height: 1.5;
        }
      }

      .section-label {
        font-family: var(--font-mono);
        font-size: 10px;
        color: #58a6ff;
        display: block;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .email-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 12px;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 15px;

        &:hover {
          border-color: rgba(88, 166, 255, 0.3);
          background: rgba(88, 166, 255, 0.05);
          transform: translateY(-2px);
        }

        .email-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          i {
            font-size: 20px;
          }
          .text-stack {
            display: flex;
            flex-direction: column;
            .label {
              font-size: 10px;
              color: #8b949e;
            }
            .value {
              font-size: 12px;
              color: #c9d1d9;
              font-weight: 500;
              word-break: break-all;
            }
          }
        }
        .copy-hint {
          font-size: 9px;
          color: #58a6ff;
          text-align: right;
          font-family: var(--font-mono);
        }
      }

      .social-links-row {
        display: flex;
        gap: 10px;
      }

      .social-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        color: #8b949e;
        text-decoration: none;
        transition: all 0.2s;
        i {
          font-size: 18px;
        }
        span {
          font-size: 10px;
        }

        &:hover {
          color: white;
          background: rgba(255, 255, 255, 0.08);
          &.linkedin {
            border-color: #0077b5;
            i {
              color: #0077b5;
            }
          }
          &.github {
            border-color: #f0f6fc;
          }
        }
      }

      /* Content Right */
      .comms-content {
        padding: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .contact-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }

      .field-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
        label {
          font-size: 13px;
          color: #c9d1d9;
          font-weight: 500;
        }
        input,
        textarea {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 12px;
          color: #c9d1d9;
          font-size: 14px;
          transition: all 0.2s;
          &:focus {
            outline: none;
            border-color: #58a6ff;
            background: rgba(88, 166, 255, 0.05);
          }
        }
      }

      .send-btn {
        margin-top: 10px;
        background: #238636;
        border: none;
        border-radius: 6px;
        padding: 0;
        color: white;
        font-weight: 600;
        transition: all 0.2s;
        cursor: pointer;

        &:hover:not(:disabled) {
          background: #2ea043;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(46, 160, 67, 0.2);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-content {
          padding: 14px;
          border-radius: 5px;
          color: white;
          font-family: var(--font-mono);
          font-weight: bold;
          font-size: 12px;
          letter-spacing: 1px;
        }
      }

      /* Success Screen */
      .success-screen {
        text-align: center;
        animation: fadeIn 0.5s ease;

        .checkmark {
          width: 60px;
          height: 60px;
          background: rgba(63, 185, 80, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          svg {
            width: 30px;
          }
        }

        h4 {
          color: #3fb950;
          font-family: var(--font-mono);
          margin-bottom: 10px;
        }
        p {
          color: #8b949e;
          font-size: 14px;
          margin-bottom: 30px;
        }
      }

      .secondary-btn {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #8b949e;
        padding: 10px 20px;
        border-radius: 6px;
        font-family: var(--font-mono);
        font-size: 11px;
        cursor: pointer;
        &:hover {
          color: white;
          border-color: white;
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 768px) {
        .comms-panel {
          grid-template-columns: 1fr;
        }
        .comms-sidebar {
          border-right: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPreviewComponent {
  private terminal = inject(TerminalService);
  protected state = inject(PortfolioStateService);
  private toast = inject(ToastService);

  form = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  isSending = signal(false);
  isSent = signal(false);
  copyStatus = signal('Copy Email');

  async sendMessage(event: Event) {
    event.preventDefault();
    this.isSending.set(true);

    this.terminal.log(`> INICIALIZANDO DISPATCHER...`, 'info');
    this.terminal.log(`> Conectando con servidor de correo...`, 'info');

    try {
      const templateParams = {
        name: this.form.name,
        email: this.form.email,
        subject: this.form.subject,
        message: this.form.message,
      };

      await emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.templateId,
        templateParams,
        environment.emailjs.publicKey
      );

      this.isSending.set(false);
      this.isSent.set(true);
      this.terminal.log(`> TRANSMISIÓN EXITOSA: Email enviado.`, 'success');
      this.toast.show('Mensaje enviado correctamente', 'success');
    } catch (error: any) {
      this.isSending.set(false);
      this.terminal.log(`> ERROR EN TRANSMISIÓN: ${error.text || error}`, 'error');
      this.toast.show('Error al enviar el mensaje', 'error');
    }
  }

  resetForm() {
    this.form = { name: '', email: '', subject: '', message: '' };
    this.isSent.set(false);
  }

  copyEmail(email: string) {
    navigator.clipboard.writeText(email);
    this.terminal.log(`> Email copiado al portapapeles.`, 'success');
    this.copyStatus.set('COPIED!');
    setTimeout(() => this.copyStatus.set('Copy Email'), 2000);
  }

  log(platform: string) {
    this.terminal.log(`> Redirigiendo a nodo externo: ${platform}`, 'info');
  }
}
