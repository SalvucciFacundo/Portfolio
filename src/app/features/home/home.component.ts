import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="code-container">
      <div class="line">
        <span class="keyword">import</span> {{ '{' }} Page {{ '}' }}
        <span class="keyword">from</span> <span class="string">'@angular/core'</span>;
      </div>
      <div class="line">
        <span class="keyword">import</span> {{ '{' }} Portfolio {{ '}' }}
        <span class="keyword">from</span> <span class="string">'./core'</span>;
      </div>
      <div class="line"></div>
      <div class="line"><span class="comment">/**</span></div>
      <div class="line"><span class="comment"> * Welcome to the Portfolio Terminal</span></div>
      <div class="line"><span class="comment"> * Starting the exploration journey...</span></div>
      <div class="line"><span class="comment"> */</span></div>
      <div class="line">
        <span class="keyword">export class</span> <span class="class-name">HomeComponent</span>
        {{ '{' }}
      </div>
      <div class="line">
        <span class="keyword">readonly</span> title =
        <span class="string">'Facundo Salvucci'</span>;
      </div>
      <div class="line">
        <span class="keyword">readonly</span> stacks = [<span class="string">'Angular'</span>,
        <span class="string">'TypeScript'</span>, <span class="string">'Firebase'</span>];
      </div>
      <div class="line"></div>
      <div class="line"><span class="keyword">constructor</span>() {{ '{' }}</div>
      <div class="line">
        <span class="class-name">console</span>.log(<span class="string"
          >'Initializing Portfolio Engine...'</span
        >);
      </div>
      <div class="line">{{ '}' }}</div>
      <div class="line">{{ '}' }}</div>
    </div>
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
      }
      .keyword {
        color: #569cd6;
      }
      .string {
        color: #ce9178;
      }
      .comment {
        color: #6a9955;
        font-style: italic;
      }
      .class-name {
        color: #4ec9b0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
