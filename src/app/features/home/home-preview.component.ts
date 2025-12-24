import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../core/services/navigation.service';

interface TerminalLine {
  type: 'command' | 'result' | 'progress' | 'access' | 'scroll';
  text?: string;
  bar?: string;
  percent?: number;
}

@Component({
  selector: 'app-home-preview',
  imports: [CommonModule],
  template: `
    <div class="home-terminal-container">
      <div class="terminal-window">
        <!-- Minimalist Header -->
        <div class="terminal-header">
          <span class="bash-label">bash — 80x24</span>
          <div class="window-controls">
            <div class="control-dot"></div>
            <div class="control-dot"></div>
            <div class="control-dot"></div>
          </div>
        </div>

        <div class="terminal-body">
          @for (line of displayLines(); track $index) {
          <div class="line" [class.access-line]="line.type === 'access'">
            @if (line.type === 'command') {
            <span class="prompt">></span> <span class="command">{{ line.text }}</span>
            } @else if (line.type === 'result') {
            <span class="result">{{ line.text }}</span>
            } @else if (line.type === 'progress') {
            <div class="progress-block">
              <span class="result">Loading graphics...</span>
              <div class="progress-bar-row">
                <span class="bar-ascii">{{ line.bar }}</span>
                <span class="percent-label">{{ line.percent }}%</span>
              </div>
            </div>
            } @else if (line.type === 'access') {
            <div class="access-text">[{{ line.text }}]</div>
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
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .home-terminal-container {
        width: 100%;
        height: 100%;
        background: #0d0f14;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .terminal-window {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #0d0f14;
        font-family: 'Fira Code', 'JetBrains Mono', monospace;
      }

      .terminal-header {
        background: #161921;
        padding: 8px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.03);

        .bash-label {
          font-size: 11px;
          color: #626772;
          font-weight: 400;
          letter-spacing: 0.5px;
        }

        .window-controls {
          display: flex;
          gap: 6px;
          .control-dot {
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: #282c34;
          }
        }
      }

      .terminal-body {
        flex: 1;
        padding: 30px;
        overflow-y: hidden; /* No scrollbars as requested */
        color: #d1d1d1;
        font-size: 14px;
        line-height: 1.5;
        scrollbar-width: none; /* Hide for Firefox */
        &::-webkit-scrollbar {
          display: none;
        } /* Hide for Chrome */
      }

      .line {
        margin-bottom: 8px;
        animation: fadeIn 0.2s ease-out forwards;
      }

      .prompt {
        color: #5c6370;
        margin-right: 10px;
      }

      .command {
        color: #e5e5e5;
      }

      .result {
        color: #9da5b4;
      }

      .progress-bar-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 4px;
        .bar-ascii {
          color: #282c34;
          letter-spacing: 1px;
          font-size: 14px;
        }
        .percent-label {
          color: #9da5b4;
          font-weight: normal;
        }
      }

      .access-text {
        margin-top: 15px;
        color: #d1d1d1;
        font-weight: 500;
        letter-spacing: 1px;
      }

      .scroll-line {
        margin-top: 40px;
        color: #e5e5e5;
        font-size: 13px;
        letter-spacing: 2px;
        text-transform: uppercase;
        display: flex;
        align-items: center;
      }

      .terminal-blink {
        animation: blink 1s infinite;
        margin-left: 2px;
        font-weight: bold;
      }

      .cursor {
        display: inline-block;
        width: 8px;
        height: 15px;
        background: #d1d1d1;
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
  isTyping = signal(true);
  showScroll = signal(false);
  displayLines = signal<TerminalLine[]>([]);

  ngOnInit() {
    this.runBootSequence();
  }

  async runBootSequence() {
    const sequence: TerminalLine[] = [
      { type: 'command', text: 'user.identify()' },
      { type: 'result', text: 'Detecting user... Facundo Salvucci [OK]' },
      { type: 'command', text: 'user.getRole()' },
      { type: 'result', text: 'Loading role... Full Stack Developer & Angular Architect' },
      { type: 'command', text: 'system.init_interface()' },
      { type: 'progress' },
      { type: 'access', text: 'SUCCESS: INTERFACE INITIALIZED' },
      { type: 'scroll', text: 'Scroll to continue' },
    ];

    for (const step of sequence) {
      if (step.type === 'progress') {
        const progressLine: TerminalLine = { type: 'progress', bar: '', percent: 0 };
        this.displayLines.update((lines) => [...lines, progressLine]);

        for (let i = 0; i <= 100; i += 10) {
          await this.delay(60);
          progressLine.percent = i;
          progressLine.bar = '█'.repeat(i / 10) + ' '.repeat(10 - i / 10);
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
      await this.delay(350);
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
