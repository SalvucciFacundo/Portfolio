import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TerminalService } from '../../core/services/terminal.service';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills-preview',
  imports: [CommonModule],
  template: `
    <div class="skills-dashboard">
      @for (group of state.skills(); track group.category) {
      <div class="skill-category">
        <h4 class="category-header"><span class="ln">//</span> {{ group.category }}</h4>

        <div class="tech-grid">
          @for (item of group.items; track item) {
          <div class="tech-card" (click)="log($event, item)">
            <div class="tech-icon-wrapper">
              <i [class]="getIconClass(item)"></i>
            </div>
            <span class="tech-name">{{ item }}</span>
          </div>
          }
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        max-width: 900px;
        margin: 0 auto;
        padding-top: 20px;
      }

      .skills-dashboard {
        display: flex;
        flex-direction: column;
        gap: 40px;
      }

      .category-header {
        color: #58a6ff;
        font-family: var(--font-mono);
        font-size: 14px;
        margin-bottom: 20px;
        letter-spacing: 1px;
        .ln {
          color: rgba(255, 255, 255, 0.2);
          margin-right: 8px;
        }
      }

      .tech-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 15px;
      }

      .tech-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;

        &:hover {
          background: rgba(56, 139, 253, 0.1);
          border-color: #58a6ff;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);

          .tech-icon-wrapper i {
            color: #58a6ff;
            transform: scale(1.1);
          }
        }
      }

      .tech-icon-wrapper {
        font-size: 32px;
        color: #8b949e;
        transition: all 0.3s;

        i {
          display: block;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      }

      .tech-name {
        font-size: 11px;
        font-weight: 600;
        color: #c9d1d9;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        text-align: center;
      }

      @media (max-width: 600px) {
        .tech-grid {
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
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

  getIconClass(name: string): string {
    const n = name.toLowerCase();

    // Naming logic for Devicon (tries to match name with standard icon names)
    if (n.includes('angular')) return 'devicon-angularjs-plain';
    if (n.includes('react')) return 'devicon-react-original';
    if (n.includes('typescript')) return 'devicon-typescript-plain';
    if (n.includes('javascript')) return 'devicon-javascript-plain';
    if (n.includes('firebase')) return 'devicon-firebase-plain';
    if (n.includes('node')) return 'devicon-nodejs-plain';
    if (n.includes('css')) return 'devicon-css3-plain';
    if (n.includes('html')) return 'devicon-html5-plain';
    if (n.includes('sass') || n.includes('scss')) return 'devicon-sass-original';
    if (n.includes('git')) return 'devicon-git-plain';
    if (n.includes('docker')) return 'devicon-docker-plain';
    if (n.includes('python')) return 'devicon-python-plain';
    if (n.includes('java') && !n.includes('script')) return 'devicon-java-plain';
    if (n.includes('c#')) return 'devicon-csharp-plain';
    if (n.includes('linux')) return 'devicon-linux-plain';
    if (n.includes('tailwind')) return 'devicon-tailwindcss-original';
    if (n.includes('figma')) return 'devicon-figma-plain';
    if (n.includes('photoshop')) return 'devicon-photoshop-plain';
    if (n.includes('mongo')) return 'devicon-mongodb-plain';
    if (n.includes('sql')) return 'devicon-sqlite-plain';
    if (n.includes('unity')) return 'devicon-unity-original';

    // Default if no match
    return 'devicon-code-plain';
  }

  log(event: MouseEvent, name: string) {
    event.stopPropagation();
    this.terminal.log(`> Service discovered: [${name}]. Module status: ACTIVE.`, 'success');
  }
}
