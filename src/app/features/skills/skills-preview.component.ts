import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TerminalService } from '../../core/services/terminal.service';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills-preview',
  imports: [CommonModule],
  template: `
    <div class="skills-preview">
      @for (group of state.skills(); track group.category) {
      <div class="category">
        <h4>{{ group.category }}</h4>
        @for (item of group.items; track item) {
        <div class="skill-item" (click)="log($event, item)">
          <span>{{ item }}</span>
          <div class="skill-bar"><div class="fill" style="width: 85%"></div></div>
        </div>
        }
      </div>
      } @empty {
      <div class="category skeleton">
        <div class="line gray title"></div>
        <div class="skill-item"><div class="skill-bar gray"></div></div>
        <div class="skill-item"><div class="skill-bar gray"></div></div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .skills-preview {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        pointer-events: auto;
      }
      .category {
        margin-bottom: 30px;
      }
      h4 {
        color: #89ca78;
        margin-bottom: 15px;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .skill-item {
        margin-bottom: 20px;
        cursor: pointer;
        transition: transform 0.2s;
      }
      .skill-item:hover {
        transform: translateX(5px);
      }
      .skill-item span {
        display: block;
        font-size: 12px;
        color: #a9b1d6;
        margin-bottom: 5px;
      }
      .skill-bar {
        height: 6px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        overflow: hidden;
      }
      .fill {
        height: 100%;
        background: linear-gradient(90deg, #61afef, #c678dd);
        border-radius: 4px;
      }

      .gray {
        background: #333 !important;
      }
      .line.title {
        width: 50%;
        height: 15px;
        border-radius: 4px;
        margin-bottom: 15px;
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
export class SkillsPreviewComponent {
  protected state = inject(PortfolioStateService);
  private terminal = inject(TerminalService);

  log(event: MouseEvent, name: string) {
    event.stopPropagation();
    this.terminal.log(`> Skill Report [${name}]: Expertise verified.`, 'success');
  }
}
