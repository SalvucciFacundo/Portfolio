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
        <span class="ln">1</span><span class="comment">// Perfil del Desarrollador</span>
      </div>
      <div class="line">
        <span class="ln">2</span><span class="keyword">export class</span>
        <span class="type">AboutComponent</span> &#123;
      </div>
      <div class="line">
        <span class="ln">3</span>&nbsp;&nbsp;<span class="keyword">public</span>
        <span class="prop">name</span> = <span class="string">'{{ data.name }}'</span>;
      </div>
      <div class="line">
        <span class="ln">4</span>&nbsp;&nbsp;<span class="keyword">public</span>
        <span class="prop">role</span> = <span class="string">'{{ data.role }}'</span>;
      </div>
      <div class="line">
        <span class="ln">5</span>&nbsp;&nbsp;<span class="keyword">public</span>
        <span class="prop">status</span> =
        <span class="string">'{{ data.status || 'Open to Work' }}'</span>;
      </div>
      <div class="line">
        <span class="ln">6</span>&nbsp;&nbsp;<span class="keyword">public</span>
        <span class="prop">education</span> = &#123;
      </div>
      <div class="line">
        <span class="ln">7</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="prop">degree</span>:
        <span class="string">'{{ data.education?.degree || 'Tecnicatura en Programación' }}'</span>,
      </div>
      <div class="line">
        <span class="ln">8</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="prop">university</span>:
        <span class="string">'{{ data.education?.university || 'UTN' }}'</span>
      </div>
      <div class="line"><span class="ln">9</span>&nbsp;&nbsp;&#125;;</div>
      <div class="line">
        <span class="ln">10</span>&nbsp;&nbsp;<span class="keyword">public</span>
        <span class="prop">summary</span> = <span class="string">\`</span>
      </div>
      <div class="line">
        <span class="ln">11</span><span class="string">&nbsp;&nbsp;&nbsp;&nbsp;{{ data.bio }}</span>
      </div>
      <div class="line"><span class="ln">12</span>&nbsp;&nbsp;<span class="string">\`</span>;</div>
      <div class="line">
        <span class="ln">13</span>
      </div>
      <div class="line">
        <span class="ln">14</span>&nbsp;&nbsp;<span class="keyword">constructor</span>() &#123;
      </div>
      <div class="line">
        <span class="ln">15</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="type">console</span>.<span
          class="prop"
          >log</span
        >(<span class="string">'Cargando perfil de éxito...'</span>);
      </div>
      <div class="line"><span class="ln">16</span>&nbsp;&nbsp;&#125;</div>
      <div class="line"><span class="ln">17</span>&#125;</div>
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
      .comment {
        color: #6a9955;
        font-style: italic;
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
