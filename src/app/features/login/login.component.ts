import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>PORTFOLIO CMS</h2>
        <p>Inicia sesión para gestionar tus proyectos</p>

        <div class="input-group">
          <input type="email" [(ngModel)]="email" name="email" placeholder="Email" />
        </div>
        <div class="input-group">
          <input type="password" [(ngModel)]="password" name="password" placeholder="Contraseña" />
        </div>

        @if (error()) {
        <div class="error-msg">{{ error() }}</div>
        }

        <button (click)="onLogin()" [disabled]="loading()">
          {{ loading() ? 'Cargando...' : 'Acceder' }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #1e1e1e;
      }
      .login-box {
        background-color: #252526;
        padding: 40px;
        border-radius: 8px;
        border: 1px solid #3c3c3c;
        width: 100%;
        max-width: 400px;
        text-align: center;
      }
      h2 {
        margin-bottom: 10px;
        color: #fff;
      }
      p {
        margin-bottom: 30px;
        font-size: 14px;
        color: #858585;
      }
      .input-group {
        margin-bottom: 20px;
      }
      input {
        width: 100%;
        padding: 12px;
        background-color: #1e1e1e;
        border: 1px solid #3c3c3c;
        color: white;
        border-radius: 4px;
        outline: none;
        box-sizing: border-box;
        &:focus {
          border-color: #007acc;
        }
      }
      .error-msg {
        color: #f44336;
        font-size: 12px;
        margin-bottom: 15px;
      }
      button {
        width: 100%;
        padding: 12px;
        background-color: #007acc;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        &:hover {
          background-color: #0062a3;
        }
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LoginComponent {
  private auth = inject(AuthService);

  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  async onLogin() {
    this.loading.set(true);
    this.error.set(null);

    const res = await this.auth.login(this.email, this.password);

    if (!res.success) {
      this.error.set('Credenciales inválidas. Por favor intenta de nuevo.');
      this.loading.set(false);
    }
  }
}
