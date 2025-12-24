import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

@Component({
  selector: 'app-home',
  template: `
    @if (state.profile(); as p) {
    <div class="code-container">
      <div class="line"><span class="comment">#!/bin/bash</span></div>
      <div class="line"></div>
      <div class="line"><span class="comment"># Portfolio Boot Script</span></div>
      <div class="line">
        <span class="comment"># Owner: {{ p.name }}</span>
      </div>
      <div class="line"></div>
      <div class="line">
        <span class="keyword">NAME</span>=<span class="string">"{{ p.name }}"</span>
      </div>
      <div class="line">
        <span class="keyword">ROLE</span>=<span class="string">"{{ p.role }}"</span>
      </div>
      <div class="line"></div>
      <div class="line"><span class="function">identify_user</span>() {{ '{' }}</div>
      <div class="line">
        <span class="keyword">echo</span> <span class="string">"Detecting operator..."</span>
      </div>
      <div class="line"><span class="keyword">sleep</span> 1</div>
      <div class="line">
        <span class="keyword">echo</span> <span class="string">"User: $NAME"</span>
      </div>
      <div class="line">{{ '}' }}</div>
      <div class="line"></div>
      <div class="line"><span class="function">init_system</span>() {{ '{' }}</div>
      <div class="line">
        <span class="keyword">echo</span> <span class="string">"Building portfolio assets..."</span>
      </div>
      <div class="line">
        <span class="keyword">for</span> i <span class="keyword">in</span> {{ '{' }}1..100{{ '}' }};
        <span class="keyword">do</span>
      </div>
      <div class="line">
        <span class="keyword">printf</span> <span class="string">"\\rLoading: [%-25s] %d%%"</span>
        <span class="string">"$(printf '█%.0s' $(seq 1 $((i/4))))"</span>
        <span class="string">"$i"</span>
      </div>
      <div class="line"><span class="keyword">sleep</span> 0.05</div>
      <div class="line"><span class="keyword">done</span></div>
      <div class="line">
        <span class="keyword">echo</span> -e
        <span class="string">"\\nReady: Workspace initialized successfully."</span>
      </div>
      <div class="line">{{ '}' }}</div>
      <div class="line"></div>
      <div class="line"><span class="comment"># Execute boot sequence</span></div>
      <div class="line"><span class="function">identify_user</span></div>
      <div class="line"><span class="function">init_system</span></div>
      <div class="line"></div>
      <div class="line">
        <span class="keyword">echo</span>
        <span class="string">"Welcome, $NAME. Scroll down to explore my work."</span>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .code-container {
        font-family: var(--font-mono);
        font-size: 14px;
        line-height: 1.6;
        color: #d4d4d4;
      }
      .line {
        min-height: 1.6em;
        white-space: pre;
      }
      .keyword {
        color: #c586c0; /* Bash variable/keyword */
      }
      .string {
        color: #ce9178;
      }
      .comment {
        color: #6a9955;
        font-style: italic;
      }
      .function {
        color: #dcdcaa; /* Function color */
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HomeComponent {
  protected state = inject(PortfolioStateService);
}
