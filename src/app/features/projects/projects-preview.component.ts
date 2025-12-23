import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TerminalService } from '../../core/services/terminal.service';

@Component({
  selector: 'app-projects-preview',
  template: `
    <div class="project-preview shadow">
      <div class="project-img">
        <div class="placeholder-img">E-Commerce</div>
      </div>
      <div class="project-info">
        <h3>E-Commerce Platform</h3>
        <p>Modern shopping experience with real-time updates.</p>
        <div class="tech-stack">
          <span class="tag">Angular</span>
          <span class="tag">Firebase</span>
        </div>
        <div class="btn-group">
          <button class="primary" (click)="log($event, 'Launching', 'E-Commerce')">
            Live Demo
          </button>
          <button class="secondary" (click)="log($event, 'Fetching Repository', 'E-Commerce')">
            GitHub
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .project-preview {
        background: #1e1e2e;
        width: 100%;
        max-width: 320px;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
        pointer-events: auto;
      }
      .project-img {
        height: 160px;
        background: linear-gradient(135deg, #61afef, #c678dd);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .placeholder-img {
        font-size: 20px;
        font-weight: bold;
        color: white;
      }
      .project-info {
        padding: 20px;
      }
      h3 {
        color: white;
        margin-bottom: 10px;
        font-size: 18px;
      }
      p {
        color: #a9b1d6;
        font-size: 13px;
        margin-bottom: 20px;
      }
      .tech-stack {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 25px;
      }
      .tag {
        font-size: 10px;
        background: rgba(0, 122, 204, 0.2);
        color: #61afef;
        padding: 4px 8px;
        border-radius: 4px;
      }
      .btn-group {
        display: flex;
        gap: 10px;
      }
      button {
        flex: 1;
        padding: 10px;
        font-size: 12px;
        font-weight: 600;
        border-radius: 6px;
        cursor: pointer;
        border: none;
        transition: opacity 0.2s;
      }
      button:hover {
        opacity: 0.8;
      }
      button.primary {
        background-color: #007acc;
        color: white;
      }
      button.secondary {
        background-color: #333;
        color: white;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProjectsPreviewComponent {
  private terminal = inject(TerminalService);

  log(event: MouseEvent, action: string, name: string) {
    event.stopPropagation();
    this.terminal.log(`> ${action} project: ${name}...`, 'info');
    this.terminal.log(`> Done. Target environment ready.`, 'success');
  }
}
