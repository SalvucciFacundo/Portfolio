import { Component, ChangeDetectionStrategy, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../core/services/navigation.service';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

interface TerminalLine {
  type: 'command' | 'result' | 'progress' | 'system' | 'scroll' | 'hero' | 'subhero';
  text?: string;
  bar?: string;
  percent?: number;
}

@Component({
  selector: 'app-home-preview',
  imports: [CommonModule],
  template: `
    <div class="home-terminal-container">
      <div class="terminal-body">
        @for (line of displayLines(); track $index) {
        <div class="line" [class]="line.type">
          @if (line.type === 'command') {
          <span class="prompt">$</span> <span class="command">{{ line.text }}</span>
          } @else if (line.type === 'result') {
          <span class="result">{{ line.text }}</span>
          } @else if (line.type === 'hero') {
          <h1 class="hero-name">{{ line.text }}</h1>
          } @else if (line.type === 'subhero') {
          <div class="hero-role">{{ line.text }}</div>
          } @else if (line.type === 'progress') {
          <div class="progress-block">
            <span class="result">Building production assets...</span>
            <div class="progress-bar-row">
              <span class="bar-ascii">{{ line.bar }}</span>
              <span class="percent-label">{{ line.percent }}%</span>
            </div>
          </div>
          } @else if (line.type === 'system') {
          <div class="system-text">{{ line.text }}</div>
          } @else if (line.type === 'scroll') {
          <div class="scroll-line" (click)="scrollTo('about')" style="cursor: pointer">
            <span>{{ line.text }}<span class="terminal-blink">... ⇣</span></span>
          </div>
          }
        </div>
        } @if (isTyping() && !showScroll()) {
        <span class="cursor"></span>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: transparent; /* Rely on browser-body gradient */
        padding: 40px;
        box-sizing: border-box;
      }

      .home-terminal-container {
        max-width: 1000px;
        width: 100%;
        max-height: 95%; /* Use almost all available height */
        background: #0d0f14;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: 'Fira Code', 'JetBrains Mono', monospace;
        box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.02);
      }

      .terminal-body {
        flex: 1;
        padding: 40px;
        overflow: hidden; /* No internal scroll */
        color: #abb2bf;
        font-size: 14px;
        line-height: 1.6;
        display: flex;
        flex-direction: column;
      }

      .line {
        margin-bottom: 8px;
        animation: fadeIn 0.2s ease-out forwards;
      }

      .prompt {
        color: #98c379; /* One Dark Green */
        margin-right: 12px;
        font-weight: bold;
      }

      .command {
        color: #61afef; /* One Dark Blue */
      }

      .result {
        color: #5c6370; /* Muted code gray */
      }

      /* Hero Name - Sophisticated & Clean */
      .hero-name {
        font-size: clamp(2rem, 6vw, 4rem);
        color: #ffffff;
        margin: 15px 0 5px;
        font-weight: 700;
        letter-spacing: -1px;
        line-height: 1.1;
      }

      /* Hero Role - Dev style label */
      .hero-role {
        color: #d19a66; /* One Dark Orange */
        font-size: 1.1rem;
        font-weight: 500;
        margin-bottom: 20px;
        opacity: 0.9;

        &::before {
          content: '// ';
          color: #5c6370;
        }
      }

      .progress-bar-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 6px;
        .bar-ascii {
          color: #2c313a;
          letter-spacing: 2px;
          font-size: 14px;
        }
        .percent-label {
          color: #98c379;
          font-weight: bold;
        }
      }

      .system-text {
        color: #abb2bf;
        background: rgba(255, 255, 255, 0.03);
        padding: 4px 10px;
        border-radius: 4px;
        display: inline-block;
        margin-top: 10px;
        font-size: 12px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .scroll-line {
        margin-top: auto;
        padding-top: 50px;
        color: #626772;
        font-size: 12px;
        letter-spacing: 2px;
        text-transform: uppercase;
        display: flex;
        align-items: center;
      }

      .terminal-blink {
        animation: blink 1s infinite;
        margin-left: 5px;
      }

      .cursor {
        display: inline-block;
        width: 8px;
        height: 16px;
        background: #61afef;
        animation: blink 1s infinite;
        vertical-align: middle;
        margin-left: 5px;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes blink {
        0%,
        49% {
          opacity: 1;
        }
        50%,
        100% {
          opacity: 0;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePreviewComponent implements OnInit {
  private nav = inject(NavigationService);
  protected state = inject(PortfolioStateService);
  isTyping = signal(true);
  showScroll = signal(false);
  displayLines = signal<TerminalLine[]>([]);

  constructor() {
    // Restart boot sequence when profile data changes (e.g. from modal)
    effect(() => {
      const p = this.state.profile();
      if (p) {
        // Clear and restart
        this.displayLines.set([]);
        this.runBootSequence();
      }
    });
  }

  ngOnInit() {
    // Sequence is started by the effect above
  }

  async runBootSequence() {
    const p = this.state.profile();
    const name = p?.name || 'Facundo Salvucci';
    const role = p?.role || 'Full Stack Developer & Angular Architect';

    const sequence: TerminalLine[] = [
      { type: 'command', text: 'whoami' },
      { type: 'hero', text: name },
      { type: 'subhero', text: role },
      { type: 'command', text: 'npm start --portfolio' },
      { type: 'progress' },
      { type: 'system', text: 'Ready: Workspace initialized successfully.' },
      { type: 'scroll', text: 'Scroll to explore' },
    ];

    for (const step of sequence) {
      if (step.type === 'progress') {
        const progressLine: TerminalLine = { type: 'progress', bar: '', percent: 0 };
        this.displayLines.update((lines) => [...lines, progressLine]);

        for (let i = 0; i <= 100; i += 4) {
          await this.delay(80); // Slower, more deliberate loading
          progressLine.percent = i;
          progressLine.bar = '█'.repeat(i / 4) + ' '.repeat(25 - i / 4);
          this.displayLines.update((lines) => [...lines]);
        }
      } else if (step.type === 'hero') {
        await this.delay(300);
        const newLine: TerminalLine = { type: step.type, text: '' };
        this.displayLines.update((lines) => [...lines, newLine]);

        const textToType = step.text || '';
        for (let i = 0; i < textToType.length; i++) {
          await this.delay(30);
          newLine.text += textToType[i];
          this.displayLines.update((lines) => [...lines]);
        }
      } else if (step.type === 'scroll') {
        this.showScroll.set(true);
        const scrollLine: TerminalLine = { type: 'scroll', text: step.text };
        this.displayLines.update((lines) => [...lines, scrollLine]);
      } else {
        const newLine: TerminalLine = { type: step.type, text: '' };
        this.displayLines.update((lines) => [...lines, newLine]);

        const textToType = step.text || '';
        for (let i = 0; i < textToType.length; i++) {
          await this.delay(20);
          newLine.text += textToType[i];
          this.displayLines.update((lines) => [...lines]);
        }
      }
      await this.delay(300);
    }

    this.isTyping.set(false);
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  scrollTo(section: string) {
    this.nav.requestScroll(section);
  }
}
