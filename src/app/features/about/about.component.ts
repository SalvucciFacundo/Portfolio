import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DataService } from '../../core/data/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  template: `
    <div class="code-container">
      @if (aboutData$ | async; as data) {
      <div class="line">
        <span class="ln">1</span><span class="keyword">interface</span>
        <span class="type">Developer</span> &#123;
      </div>
      <div class="line">
        <span class="ln">2</span>&nbsp;&nbsp;<span class="prop">name</span>:
        <span class="string">'{{ data.name }}'</span>;
      </div>
      <div class="line">
        <span class="ln">3</span>&nbsp;&nbsp;<span class="prop">role</span>:
        <span class="string">'{{ data.role }}'</span>;
      </div>
      <div class="line">
        <span class="ln">4</span>&nbsp;&nbsp;<span class="prop">location</span>:
        <span class="string">'{{ data.location }}'</span>;
      </div>
      <div class="line">
        <span class="ln">5</span>&nbsp;&nbsp;<span class="prop">motto</span>:
        <span class="string">'{{ data.motto }}'</span>;
      </div>
      <div class="line"><span class="ln">6</span>&#125;</div>
      } @else {
      <div class="line">
        <span class="ln">1</span><span class="keyword">// Cargando perfil de Firebase...</span>
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
      .keyword {
        color: #c586c0;
      }
      .type {
        color: #4ec9b0;
      }
      .prop {
        color: #9cdcfe;
      }
      .string {
        color: #ce9178;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AboutComponent {
  private dataService = inject(DataService);

  // We'll assume a document named 'profile' in 'about' collection
  aboutData$ = this.dataService.getDoc<any>('about', 'profile');
}
