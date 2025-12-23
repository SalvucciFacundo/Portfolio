import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TerminalService } from '../../core/services/terminal.service';

@Component({
  selector: 'app-skills-preview',
  template: `
    <div class="skills-preview">
      <div class="category">
        <h4>Frontend Development</h4>
        <div class="skill-item" (click)="log($event, 'Angular', '95%')">
          <span>Angular</span>
          <div class="skill-bar"><div class="fill" style="width: 95%"></div></div>
        </div>
        <div class="skill-item" (click)="log($event, 'TypeScript', '90%')">
          <span>TypeScript</span>
          <div class="skill-bar"><div class="fill" style="width: 90%"></div></div>
        </div>
      </div>
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SkillsPreviewComponent {
  private terminal = inject(TerminalService);

  log(event: MouseEvent, name: string, level: string) {
    event.stopPropagation();
    this.terminal.log(`> Skill Report [${name}]: Current proficiency at ${level}`, 'success');
  }
}
