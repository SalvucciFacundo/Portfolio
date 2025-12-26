import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  template: `
    <div class="code-container">
      <div class="line">
        <span class="comment">&lt;!-- SYSTEM RECAP: Dynamic Portfolio Modules --&gt;</span>
      </div>

      <div class="line">
        <span class="tag">&lt;section</span> <span class="attr">class</span>=<span class="string"
          >"workstation-grid"</span
        ><span class="tag">&gt;</span>
      </div>

      @for (project of state.projects(); track project.id) {
      <div class="line indent-1">
        <span class="keyword">&#64;if</span> (project.featured) &lcub;
      </div>
      <div class="line indent-2">
        <span class="tag">&lt;article</span>
      </div>
      <div class="line indent-3">
        <span class="attr">class</span>=<span class="string">"project-card featured"</span>
      </div>
      <div class="line indent-3">
        <span class="attr">[id]</span>=<span class="string">"'{{ project.id }}'"</span
        ><span class="tag">&gt;</span>
      </div>

      <div class="line indent-3">
        <span class="tag">&lt;header&gt;</span>
      </div>
      <div class="line indent-4 breadcrumb">
        <span class="tag">&lt;h2&gt;</span>{{ project.title }}<span class="tag">&lt;/h2&gt;</span>
      </div>
      <div class="line indent-4">
        <span class="tag">&lt;span</span> <span class="attr">class</span>=<span class="string"
          >"exe-name"</span
        ><span class="tag">&gt;</span>{{ project.exeName }}<span class="tag">&lt;/span&gt;</span>
      </div>
      <div class="line indent-3">
        <span class="tag">&lt;/header&gt;</span>
      </div>

      <div class="line indent-3">
        <span class="tag">&lt;p&gt;</span>{{ project.description
        }}<span class="tag">&lt;/p&gt;</span>
      </div>

      <div class="line indent-2">
        <span class="tag">&lt;/article&gt;</span>
      </div>
      <div class="line indent-1">&rcub; <span class="keyword">&#64;else</span> &lcub;</div>

      <div class="line indent-2">
        <span class="comment">&lt;!-- COMPACT MODE ACTIVATED --&gt;</span>
      </div>
      <div class="line indent-2">
        <span class="tag">&lt;div</span> <span class="attr">class</span>=<span class="string"
          >"compact-module"</span
        ><span class="tag">&gt;</span>
      </div>
      <div class="line indent-3">
        <span class="tag">&lt;h3&gt;</span>{{ project.title }}<span class="tag">&lt;/h3&gt;</span>
      </div>
      <div class="line indent-2">
        <span class="tag">&lt;/div&gt;</span>
      </div>

      <div class="line indent-1">&rcub;</div>
      }

      <div class="line">
        <span class="tag">&lt;/section&gt;</span>
      </div>
    </div>
  `,
  styles: [
    `
      .code-container {
        font-family: var(--font-mono);
        font-size: 14px;
        line-height: 1.6;
        padding: 20px;
        color: #d4d4d4;
        background: transparent;
      }
      .line {
        display: flex;
        white-space: pre;
        min-height: 1.6em;
      }
      .indent-1 {
        padding-left: 2ch;
      }
      .indent-2 {
        padding-left: 4ch;
      }
      .indent-3 {
        padding-left: 6ch;
      }
      .indent-4 {
        padding-left: 8ch;
      }

      /* Syntax Highlighting */
      .tag {
        color: #569cd6;
      } /* Blue for tags */
      .attr {
        color: #9cdcfe;
      } /* Light blue for attributes */
      .string {
        color: #ce9178;
      } /* Orange for strings */
      .keyword {
        color: #c586c0;
      } /* Purple for @if, @for */
      .comment {
        color: #6a9955;
      } /* Green for comments */

      .breadcrumb {
        color: #4ec9b0; /* Teal for titles in code */
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  protected state = inject(PortfolioStateService);
}
