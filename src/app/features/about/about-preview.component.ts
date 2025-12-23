import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TerminalService } from '../../core/services/terminal.service';

@Component({
  selector: 'app-about-preview',
  template: `
    <div class="profile-card">
      <div class="avatar">FS</div>
      <h2>Facundo Salvucci</h2>
      <p class="role">Full Stack Developer</p>
      <div class="bio">"Construyendo el futuro una línea de código a la vez."</div>
      <div class="socials">
        <button (click)="log($event, 'Angular')">Angular</button>
        <button (click)="log($event, 'TypeScript')">TypeScript</button>
        <button (click)="log($event, 'Firebase')">Firebase</button>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-card {
        background: linear-gradient(145deg, #1e1e2e, #11111b);
        padding: 30px;
        border-radius: 16px;
        text-align: center;
        width: 100%;
        max-width: 300px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 10;
        position: relative;
      }
      .avatar {
        width: 80px;
        height: 80px;
        background: linear-gradient(45deg, #007acc, #4ec9b0);
        border-radius: 50%;
        margin: 0 auto 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28px;
        font-weight: bold;
        color: white;
      }
      h2 {
        margin-bottom: 5px;
        color: white;
        font-size: 20px;
      }
      .role {
        color: #007acc;
        font-weight: 500;
        margin-bottom: 20px;
        font-size: 14px;
      }
      .bio {
        font-size: 13px;
        color: #a9b1d6;
        line-height: 1.6;
        font-style: italic;
      }
      .socials {
        margin-top: 20px;
        display: flex;
        gap: 8px;
        justify-content: center;
        flex-wrap: wrap;
      }
      button {
        font-size: 10px;
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        color: #9cdcfe;
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: pointer;
        transition: all 0.2s;
        pointer-events: auto;

        &:hover {
          background: rgba(0, 122, 204, 0.3);
          border-color: #007acc;
          transform: translateY(-2px);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AboutPreviewComponent {
  private terminal = inject(TerminalService);

  log(event: MouseEvent, skill: string) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Logging skill:', skill); // For browser console
    this.terminal.log(`> Analizando expertise en: ${skill.toUpperCase()}...`, 'info');
    this.terminal.log(`> Resultado: Perfil de desarrollador senior detectado.`, 'success');
  }
}
