import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

@Component({
  selector: 'app-skills',
  imports: [CommonModule],
  template: `
    <div class="code-container">
      <div class="line">
        <span class="ln">1</span><span class="keyword">import</span> &lcub;
        <span class="type">Injectable</span> &rcub; <span class="keyword">from</span>&nbsp;<span
          class="string"
          >'&commat;angular/core'</span
        >;
      </div>

      <div class="line">
        <span class="ln">2</span><span class="keyword">import</span> &lcub;
        <span class="type">SkillGroup</span> &rcub; <span class="keyword">from</span>&nbsp;<span
          class="string"
          >'../models'</span
        >;
      </div>

      <div class="line"><span class="ln">3</span></div>
      <div class="line">
        <span class="ln">4</span><span class="decorator">&commat;Injectable</span>(&lcub;
        providedIn: <span class="string">'root'</span> &rcub;)
      </div>

      <div class="line">
        <span class="ln">5</span><span class="keyword">export class</span>&nbsp;<span class="type"
          >TechStackService</span
        >
        &lcub;
      </div>

      <div class="line">
        <span class="ln">6</span>&nbsp;&nbsp;<span class="keyword">readonly</span>&nbsp;<span
          class="variable"
          >arsenal</span
        >: <span class="type">SkillGroup</span>[] = [
      </div>

      @for (group of state.skills(); track group.id; let i = $index) {
      <div class="line">
        <span class="ln">{{ 7 + i }}</span
        >&nbsp;&nbsp;&nbsp;&nbsp;&lcub;
      </div>

      <div class="line">
        <span class="ln">{{ 7 + i }}a</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span
          class="variable"
          >category</span
        >: <span class="string">'{{ group.category }}'</span>,
      </div>
      <div class="line">
        <span class="ln">{{ 7 + i }}b</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span
          class="variable"
          >modules</span
        >: [@for (item of group.items; track item; let last = $last) {<span class="string"
          >'{{ item }}'</span
        >{{ !last ? ', ' : '' }} }]
      </div>
      <div class="line">
        <span class="ln">{{ 7 + i }}c</span>&nbsp;&nbsp;&nbsp;&nbsp;&rcub;,
      </div>

      }

      <div class="line">
        <span class="ln">{{ 7 + state.skills().length + 1 }}</span
        >&nbsp;&nbsp;];
      </div>
      <div class="line">
        <span class="ln">{{ 7 + state.skills().length + 2 }}</span
        >&rcub;
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
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
      }
      .line {
        display: flex;
        white-space: pre-wrap;
      }
      .ln {
        width: 35px;
        color: rgba(255, 255, 255, 0.15);
        text-align: right;
        padding-right: 15px;
        user-select: none;
        font-size: 11px;
      }
      .keyword {
        color: #c586c0;
      }
      .type {
        color: #4ec9b0;
      }
      .string {
        color: #ce9178;
      }
      .decorator {
        color: #dcdcaa;
      }
      .variable {
        color: #9cdcfe;
      }
      .comment {
        color: #6a9955;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SkillsComponent {
  protected state = inject(PortfolioStateService);
}
