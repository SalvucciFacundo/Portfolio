import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TerminalService } from '../../core/services/terminal.service';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-preview',
  imports: [CommonModule],
  template: `
    @if (state.profile(); as p) {
    <div class="profile-card">
      <div class="avatar">{{ p.name.substring(0, 2).toUpperCase() }}</div>
      <h2>{{ p.name }}</h2>
      <p class="role">{{ p.role }}</p>
      <div class="bio">"{{ p.motto }}"</div>
      <div class="socials">
        <button (click)="log($event, 'Angular')">Angular</button>
        <button (click)="log($event, 'TypeScript')">TypeScript</button>
        <button (click)="log($event, 'Firebase')">Firebase</button>
      </div>
    </div>
    } @else {
    <div class="profile-card skeleton">
      <div class="avatar gray"></div>
      <div class="line gray title"></div>
      <div class="line gray sub"></div>
    </div>
    }
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

      /* Skeleton logic */
      .gray {
        background: #333 !important;
      }
      .line {
        height: 15px;
        margin: 10px auto;
        border-radius: 4px;
      }
      .line.title {
        width: 60%;
      }
      .line.sub {
        width: 40%;
      }
      .skeleton {
        animation: pulse 1.5s infinite;
      }
      @keyframes pulse {
        0% {
          opacity: 0.6;
        }
        50% {
          opacity: 0.3;
        }
        100% {
          opacity: 0.6;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AboutPreviewComponent {
  protected state = inject(PortfolioStateService);
  private terminal = inject(TerminalService);

  log(event: MouseEvent, skill: string) {
    event.preventDefault();
    event.stopPropagation();
    this.terminal.log(`> Analizando expertise en: ${skill.toUpperCase()}...`, 'info');
    this.terminal.log(`> Resultado: Perfil de desarrollador senior detectado.`, 'success');
  }
}
