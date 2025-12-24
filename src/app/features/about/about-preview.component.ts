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
      <div class="header">
        <div class="avatar">{{ p.name.substring(0, 2).toUpperCase() }}</div>
        @if (p.status) {
        <div class="status-badge">{{ p.status }}</div>
        }
      </div>

      <h2>{{ p.name }}</h2>
      <p class="role">{{ p.role }}</p>

      <div class="info-grid">
        @if (p.location) {
        <div class="info-item">
          <span class="icon">📍</span>
          <span>{{ p.location }}</span>
        </div>
        } @if (p.education) {
        <div class="info-item">
          <span class="icon">🎓</span>
          <span>{{ p.education.degree }} ({{ p.education.university }})</span>
        </div>
        }
      </div>

      <div class="motto-box">"{{ p.motto }}"</div>

      @if (p.bio) {
      <p class="bio-text">{{ p.bio }}</p>
      }

      <div class="socials">
        @if (p.socials.github) {
        <a [href]="p.socials.github" target="_blank" class="social-link">GitHub</a>
        } @if (p.socials.linkedin) {
        <a [href]="p.socials.linkedin" target="_blank" class="social-link">LinkedIn</a>
        }
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
      .header {
        position: relative;
        margin-bottom: 20px;
      }
      .avatar {
        width: 80px;
        height: 80px;
        background: linear-gradient(45deg, #007acc, #4ec9b0);
        border-radius: 50%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28px;
        font-weight: bold;
        color: white;
        border: 4px solid rgba(255, 255, 255, 0.05);
      }
      .status-badge {
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        background: #4ec9b0;
        color: #0b0e14;
        font-size: 10px;
        font-weight: 800;
        padding: 4px 12px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 10px rgba(78, 201, 176, 0.3);
        white-space: nowrap;
      }
      h2 {
        margin-top: 10px;
        margin-bottom: 5px;
        color: white;
        font-size: 20px;
      }
      .role {
        color: #007acc;
        font-weight: 500;
        margin-bottom: 15px;
        font-size: 14px;
      }
      .info-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;
        background: rgba(255, 255, 255, 0.02);
        padding: 12px;
        border-radius: 12px;
      }
      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: #888;
        text-align: left;
      }
      .info-item .icon {
        font-size: 14px;
      }
      .motto-box {
        font-size: 13px;
        color: #a9b1d6;
        line-height: 1.6;
        font-style: italic;
        margin-bottom: 15px;
        background: rgba(255, 255, 255, 0.03);
        padding: 10px;
        border-radius: 8px;
      }
      .bio-text {
        font-size: 13px;
        color: #ccc;
        line-height: 1.5;
        margin-bottom: 20px;
      }
      .socials {
        margin-top: 20px;
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
      }
      .social-link {
        font-size: 11px;
        padding: 6px 14px;
        background: rgba(0, 122, 204, 0.1);
        border-radius: 20px;
        color: #9cdcfe;
        border: 1px solid rgba(0, 122, 204, 0.3);
        text-decoration: none;
        transition: all 0.2s;

        &:hover {
          background: rgba(0, 122, 204, 0.3);
          border-color: #007acc;
          transform: translateY(-2px);
          color: white;
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
