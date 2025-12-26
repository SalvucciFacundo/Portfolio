import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TerminalService } from '../../core/services/terminal.service';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects-preview',
  imports: [CommonModule],
  template: `
    <div class="projects-grid">
      @for (project of state.projects(); track project.id) {
      <div class="project-workstation" [class.is-featured]="project.featured">
        <!-- Terminal Header -->
        <div class="workstation-header">
          <div class="dots"><span></span><span></span><span></span></div>
          <div class="filename">
            {{ project.exeName || 'project_' + (project.id?.substring(0, 5) || 'sys') + '.exe' }}
          </div>
          <div class="status-badge" [class.active]="project.links.live">
            {{ project.links.live ? 'LIVE' : 'IDLE' }}
          </div>
        </div>

        <!-- Visual Auditor (ONLY FOR FEATURED) -->
        @if (project.featured) {
        <div class="project-visual">
          <div class="scanner-line"></div>
          @if (project.imageUrl) {
          <img [src]="project.imageUrl" [alt]="project.title" loading="lazy" />
          } @else {
          <div class="visual-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
              />
            </svg>
            <span>[ NO_ASSET_SIGNAL ]</span>
          </div>
          }
          <div class="tech-overlay">
            <div class="tech-pills">
              @for (tag of project.tags; track tag) {
              <div class="tech-pill">
                <i [class]="getIconClass(tag)"></i>
                <span>{{ tag }}</span>
              </div>
              }
            </div>
          </div>
        </div>
        }

        <!-- System Logs / Info -->
        <div class="workstation-content">
          <h3 class="system-title">{{ project.title }}</h3>

          <!-- Tech pills in content if NOT featured -->
          @if (!project.featured) {
          <div class="tech-pills compact-mode">
            @for (tag of project.tags; track tag) {
            <div class="tech-pill">
              <i [class]="getIconClass(tag)"></i>
              <span>{{ tag }}</span>
            </div>
            }
          </div>
          }

          <p class="system-desc">{{ project.description }}</p>

          <div class="specs-grid">
            <div class="spec-item">
              <span class="label">ROLE:</span>
              <span class="value">{{ project.role || 'Lead Developer' }}</span>
            </div>
            <div class="spec-item">
              <span class="label">HOST:</span>
              <span class="value">{{ project.host || 'Vercel' }}</span>
            </div>
          </div>

          <div class="workstation-actions">
            @if (project.links.live) {
            <a
              [href]="project.links.live"
              target="_blank"
              class="cmd-btn primary"
              (click)="log($event, 'EXECUTE', project.title)"
            >
              [ EXECUTE_LIVE ]
            </a>
            } @if (project.links.github) {
            <a
              [href]="project.links.github"
              target="_blank"
              class="cmd-btn secondary"
              (click)="log($event, 'FETCH', project.title)"
            >
              [ VIEW_SOURCE ]
            </a>
            }
          </div>
        </div>
      </div>
      } @if (state.isLoadingProjects()) {
      <div class="project-workstation skeleton">
        <div class="workstation-header gray"></div>
        <div class="project-visual gray"></div>
        <div class="workstation-content">
          <div class="line gray title"></div>
          <div class="line gray p"></div>
        </div>
      </div>
      } @if (state.hasMoreProjects() && !state.isLoadingProjects()) {
      <div class="load-more-container">
        <button class="load-more-btn" (click)="state.loadMoreProjects()">
          >> FETCH_MORE_RECORDS
        </button>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .projects-grid {
        display: flex;
        flex-direction: column;
        gap: 40px;
        align-items: center;
        width: 100%;
      }

      .project-workstation {
        background: rgba(30, 30, 46, 0.4);
        backdrop-filter: blur(10px);
        width: 100%;
        max-width: 450px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        pointer-events: auto;

        &:hover {
          border-color: rgba(0, 122, 204, 0.4);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);

          .scanner-line {
            animation: scan 2s linear infinite;
            opacity: 1;
          }

          .tech-overlay {
            opacity: 1;
            transform: translateY(0);
          }
        }

        &.is-featured {
          max-width: 600px;
          .system-desc {
            -webkit-line-clamp: 3;
            height: auto;
          }
        }
      }

      .workstation-header {
        background: rgba(255, 255, 255, 0.03);
        padding: 10px 15px;
        display: flex;
        align-items: center;
        gap: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);

        .dots {
          display: flex;
          gap: 6px;
          span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
          }
        }

        .filename {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #8b949e;
          flex: 1;
        }

        .status-badge {
          font-family: var(--font-mono);
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.05);
          color: #666;

          &.active {
            color: #3fb950;
            background: rgba(63, 185, 80, 0.15);
          }
        }
      }

      .project-visual {
        height: 200px;
        background: #0d1117;
        position: relative;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.8;
          transition: transform 0.5s ease;
        }

        .scanner-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #58a6ff, transparent);
          box-shadow: 0 0 10px #58a6ff;
          z-index: 5;
          opacity: 0;
        }

        .tech-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          display: flex;
          align-items: flex-end;
          padding: 15px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }

        .visual-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 100%;
          color: rgba(255, 255, 255, 0.15);
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 2px;

          svg {
            width: 30px;
            opacity: 0.3;
          }
        }
      }

      .tech-pills.compact-mode {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 15px;
        .tech-pill {
          background: rgba(88, 166, 255, 0.05);
          border: 1px solid rgba(88, 166, 255, 0.1);
          color: #8b949e;
          i {
            color: #58a6ff;
            opacity: 0.7;
          }
        }
      }

      .tech-pills {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      .tech-pill {
        font-size: 9px;
        font-family: var(--font-mono);
        background: rgba(88, 166, 255, 0.2);
        color: #58a6ff;
        padding: 3px 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 5px;

        i {
          font-size: 11px;
        }

        span {
          text-transform: uppercase;
        }
      }

      .workstation-content {
        padding: 20px;
      }

      .system-title {
        color: #e6edf3;
        font-size: 18px;
        margin-bottom: 8px;
        font-weight: 600;
        letter-spacing: -0.5px;
      }

      .system-desc {
        color: #8b949e;
        font-size: 13px;
        line-height: 1.5;
        margin-bottom: 20px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .specs-grid {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;
        border-left: 2px solid #58a6ff;
      }

      .spec-item {
        display: flex;
        justify-content: space-between;
        font-family: var(--font-mono);
        font-size: 11px;

        .label {
          color: #58a6ff;
        }
        .value {
          color: #c9d1d9;
        }
      }

      .workstation-actions {
        display: flex;
        gap: 12px;
      }

      .cmd-btn {
        flex: 1;
        text-align: center;
        padding: 10px;
        font-family: var(--font-mono);
        font-size: 12px;
        text-decoration: none;
        border-radius: 4px;
        transition: all 0.2s;
        border: 1px solid transparent;

        &.primary {
          background: #238636;
          color: white;
          &:hover {
            background: #2ea043;
            box-shadow: 0 0 15px rgba(46, 160, 67, 0.4);
          }
        }

        &.secondary {
          background: transparent;
          border-color: #30363d;
          color: #c9d1d9;
          &:hover {
            background: #30363d;
            border-color: #8b949e;
          }
        }
      }

      .load-more-container {
        margin-top: 20px;
      }

      .load-more-btn {
        background: transparent;
        border: 1px solid #30363d;
        color: #58a6ff;
        font-family: var(--font-mono);
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 4px;
        &:hover {
          background: rgba(88, 166, 255, 0.05);
          border-color: #58a6ff;
        }
      }

      @keyframes scan {
        0% {
          top: 0;
        }
        100% {
          top: 100%;
        }
      }

      .skeleton {
        animation: pulse 1.5s infinite;
        .gray {
          background: #333 !important;
        }
        .line {
          height: 15px;
          margin-bottom: 10px;
          border-radius: 4px;
          &.title {
            width: 70%;
          }
          &.p {
            width: 100%;
            height: 40px;
          }
        }
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 0.6;
        }
        50% {
          opacity: 0.3;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProjectsPreviewComponent {
  protected state = inject(PortfolioStateService);
  private terminal = inject(TerminalService);

  log(event: MouseEvent, action: string, name: string) {
    event.stopPropagation();
    this.terminal.log(`> ${action} project: ${name}...`, 'info');
    this.terminal.log(`> Done. Target environment ready.`, 'success');
  }

  getIconClass(name: string): string {
    const n = name.toLowerCase();
    const base = 'colored ';
    if (n.includes('angular')) return base + 'devicon-angularjs-plain';
    if (n.includes('react')) return base + 'devicon-react-original';
    if (n.includes('typescript')) return base + 'devicon-typescript-plain';
    if (n.includes('javascript')) return base + 'devicon-javascript-plain';
    if (n.includes('firebase')) return base + 'devicon-firebase-plain';
    if (n.includes('node')) return base + 'devicon-nodejs-plain';
    if (n.includes('css')) return base + 'devicon-css3-plain';
    if (n.includes('html')) return base + 'devicon-html5-plain';
    if (n.includes('sass') || n.includes('scss')) return base + 'devicon-sass-original';
    if (n.includes('git')) return base + 'devicon-git-plain';
    if (n.includes('docker')) return base + 'devicon-docker-plain';
    if (n.includes('python')) return base + 'devicon-python-plain';
    if (n.includes('java') && !n.includes('script')) return base + 'devicon-java-plain';
    if (n.includes('c#')) return base + 'devicon-csharp-plain';
    if (n.includes('linux')) return base + 'devicon-linux-plain';
    if (n.includes('tailwind')) return base + 'devicon-tailwindcss-original';
    if (n.includes('figma')) return base + 'devicon-figma-plain';
    if (n.includes('photoshop')) return base + 'devicon-photoshop-plain';
    if (n.includes('mongo')) return base + 'devicon-mongodb-plain';
    if (n.includes('sql')) return base + 'devicon-sqlite-plain';
    if (n.includes('unity')) return base + 'devicon-unity-original';
    return base + 'devicon-code-plain';
  }
}
