import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [CommonModule],
  template: `
    <pre class="code-editor">
<span class="keyword">import</span> &#123; <span class="type-name">Routes</span> &#125; <span class="keyword">from</span> <span class="string">'&#64;angular/router'</span>;
<span class="keyword">import</span> &#123; <span class="type-name">ContactComponent</span> &#125; <span class="keyword">from</span> <span class="string">'./contact.component'</span>;

<span class="keyword">export const</span> <span class="variable">CONTACT_ROUTES</span>: <span class="type-name">Routes</span> = [
  &#123;
    <span class="property">path</span>: <span class="string">''</span>,
    <span class="property">component</span>: <span class="type-name">ContactComponent</span>,
    <span class="property">data</span>: &#123;
      <span class="property">email</span>: <span class="string">'{{ state.profile()?.socials?.email || 'facu.salvucci&#64;gmail.com' }}'</span>,
      <span class="property">linkedin</span>: <span class="string">'{{ state.profile()?.socials?.linkedin || '#' }}'</span>,
      <span class="property">github</span>: <span class="string">'{{ state.profile()?.socials?.github || '#' }}'</span>,
      <span class="property">status</span>: <span class="string">'READY_TO_CONNECT'</span>
    &#125;
  &#125;
];
    </pre>
  `,
  styles: [
    `
      .code-editor {
        font-family: var(--font-mono);
        font-size: 14px;
        line-height: 1.6;
        color: #d4d4d4;
        padding: 20px;
        background: transparent;
      }
      .keyword {
        color: #c586c0;
      }
      .string {
        color: #ce9178;
      }
      .variable {
        color: #9cdcfe;
      }
      .type-name {
        color: #4ec9b0;
      }
      .property {
        color: #9cdcfe;
      }
      .comment {
        color: #6a9955;
        font-style: italic;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  protected state = inject(PortfolioStateService);
}
