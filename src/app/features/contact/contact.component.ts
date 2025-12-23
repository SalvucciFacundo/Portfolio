import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-contact',
  template: `
    <pre class="code-editor">
<span class="keyword">import</span> &#123; Contact &#125; <span class="keyword">from</span> <span class="string">'@portfolio/models'</span>;

<span class="keyword">export class</span> <span class="class-name">ContactComponent</span> &#123;
  <span class="variable">email</span> = <span class="string">'facundo.salvucci&#64;example.com'</span>;
  <span class="variable">linkedin</span> = <span class="string">'linkedin.com/in/facundosalvucci'</span>;
  
  <span class="function">sendMessage</span>(<span class="variable">msg</span>: <span class="type-name">string</span>) &#123;
    <span class="variable">console</span>.<span class="function">log</span>(<span class="string">'Enviando mensaje...'</span>, <span class="variable">msg</span>);
  &#125;
&#125;
    </pre>
  `,
  styles: [
    `
      .code-editor {
        font-family: var(--font-mono);
        font-size: 14px;
        line-height: 1.5;
        color: #d4d4d4;
      }
      .keyword {
        color: #569cd6;
      }
      .string {
        color: #ce9178;
      }
      .variable {
        color: #9cdcfe;
      }
      .function {
        color: #dcdcaa;
      }
      .class-name {
        color: #4ec9b0;
      }
      .type-name {
        color: #4ec9b0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ContactComponent {}
