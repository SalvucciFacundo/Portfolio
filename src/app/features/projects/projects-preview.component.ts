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
      <div class="project-preview shadow">
        <div class="project-img">
          @if (project.imageUrl) {
          <img [src]="project.imageUrl" [alt]="project.title" />
          } @else {
          <div class="placeholder-img">{{ project.title }}</div>
          }
        </div>
        <div class="project-info">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <div class="tech-stack">
            @for (tag of project.tags; track tag) {
            <span class="tag">{{ tag }}</span>
            }
          </div>
          <div class="btn-group">
            <button class="primary" (click)="log($event, 'Launching', project.title)">
              Live Demo
            </button>
            <button class="secondary" (click)="log($event, 'Fetching Repository', project.title)">
              GitHub
            </button>
          </div>
        </div>
      </div>
      } @if (state.isLoadingProjects()) {
      <div class="project-preview shadow skeleton">
        <div class="project-img gray"></div>
        <div class="project-info">
          <div class="line gray title"></div>
          <div class="line gray p"></div>
        </div>
      </div>
      } @if (state.hasMoreProjects() && !state.isLoadingProjects()) {
      <div class="load-more-container">
        <button class="load-more" (click)="state.loadMoreProjects()">
          Cargar más proyectos...
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
        gap: 30px;
        align-items: center;
        width: 100%;
      }
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
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .placeholder-img {
        font-size: 20px;
        font-weight: bold;
        color: white;
        text-align: center;
        padding: 20px;
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
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
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

      .load-more-container {
        margin-top: 20px;
        width: 100%;
        display: flex;
        justify-content: center;
      }
      .load-more {
        background: transparent;
        color: #007acc;
        border: 1px solid #007acc;
        padding: 8px 16px;
        width: auto;
        flex: none;
      }

      .gray {
        background: #333 !important;
      }
      .line {
        height: 15px;
        margin-bottom: 10px;
        border-radius: 4px;
      }
      .line.title {
        width: 70%;
      }
      .line.p {
        width: 100%;
        height: 40px;
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
export class ProjectsPreviewComponent {
  protected state = inject(PortfolioStateService);
  private terminal = inject(TerminalService);

  log(event: MouseEvent, action: string, name: string) {
    event.stopPropagation();
    this.terminal.log(`> ${action} project: ${name}...`, 'info');
    this.terminal.log(`> Done. Target environment ready.`, 'success');
  }
}
