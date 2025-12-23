import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DataService } from '../../core/data/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  template: `
    <div class="code-container">
      <div class="line">
        <span class="ln">1</span><span class="md-h1"># Mis Proyectos (Cloud)</span>
      </div>
      <div class="line"><span class="ln">2</span></div>

      @if (projects$ | async; as projects) { @for (project of projects; track project.id; let i =
      $index) {
      <div class="line">
        <span class="ln">{{ 3 + i * 2 }}</span
        ><span class="md-h2">## {{ i + 1 }}. {{ project.title }}</span>
      </div>
      <div class="line">
        <span class="ln">{{ 4 + i * 2 }}</span
        >{{ project.description }}
      </div>
      <div class="line">
        <span class="ln">{{ 5 + i * 2 }}</span>
      </div>
      } } @else {
      <div class="line">
        <span class="ln">3</span><span class="comment">// Cargando proyectos...</span>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .code-container {
        font-family: var(--font-mono);
        font-size: 16px;
        line-height: 1.5;
      }
      .line {
        display: flex;
      }
      .ln {
        width: 40px;
        color: rgba(255, 255, 255, 0.2);
        text-align: right;
        padding-right: 20px;
        user-select: none;
      }
      .md-h1 {
        color: #569cd6;
        font-weight: bold;
      }
      .md-h2 {
        color: #4ec9b0;
        font-weight: bold;
      }
      .comment {
        color: #6a9955;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProjectsComponent {
  private dataService = inject(DataService);
  projects$ = this.dataService.getCollection<any>('projects');
}
