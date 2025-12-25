import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  template: `
    <div class="code-container">
      @if (state.profile(); as p) {
      <div class="line"><span class="ln">1</span><span class="comment">/**</span></div>
      <div class="line">
        <span class="ln">2</span><span class="comment"> * @system identity_module</span>
      </div>
      <div class="line">
        <span class="ln">3</span><span class="comment"> * @operator {{ p.name }}</span>
      </div>
      <div class="line"><span class="ln">4</span><span class="comment"> */</span></div>
      <div class="line"><span class="ln">5</span></div>
      <div class="line">
        <span class="ln">6</span><span class="keyword">export interface</span>
        <span class="type">SystemOperator</span> &#123;
      </div>
      <div class="line">
        <span class="ln">7</span>&nbsp;&nbsp;<span class="prop">fullName</span>:
        <span class="type">string</span>;
      </div>
      <div class="line">
        <span class="ln">8</span>&nbsp;&nbsp;<span class="prop">role</span>:
        <span class="type">string</span>;
      </div>
      <div class="line">
        <span class="ln">9</span>&nbsp;&nbsp;<span class="prop">location</span>:
        <span class="type">string</span>;
      </div>
      <div class="line">
        <span class="ln">10</span>&nbsp;&nbsp;<span class="prop">status</span>:
        <span class="string">'OPEN_TO_WORK'</span> | <span class="string">'BUSY'</span>;
      </div>
      <div class="line">
        <span class="ln">11</span>&nbsp;&nbsp;<span class="prop">stack</span>:
        <span class="type">string</span>[];
      </div>
      <div class="line">
        <span class="ln">12</span>&nbsp;&nbsp;<span class="prop">availability</span>:
        <span class="type">string</span>;
      </div>
      <div class="line"><span class="ln">13</span>&#125;</div>
      <div class="line"><span class="ln">14</span></div>
      <div class="line">
        <span class="ln">15</span><span class="keyword">const</span>
        <span class="const">OPERATOR_DATA</span>: <span class="type">SystemOperator</span> = &#123;
      </div>
      <div class="line">
        <span class="ln">16</span>&nbsp;&nbsp;<span class="prop">fullName</span>:
        <span class="string">'{{ p.name }}'</span>,
      </div>
      <div class="line">
        <span class="ln">17</span>&nbsp;&nbsp;<span class="prop">role</span>:
        <span class="string">'{{ p.role }}'</span>,
      </div>
      <div class="line">
        <span class="ln">18</span>&nbsp;&nbsp;<span class="prop">location</span>:
        <span class="string">'{{ p.location }} ({{ p.timezone }})'</span>,
      </div>
      <div class="line">
        <span class="ln">19</span>&nbsp;&nbsp;<span class="prop">status</span>:
        <span class="string">'{{ p.status === 'Open to Work' ? 'OPEN_TO_WORK' : 'BUSY' }}'</span>,
      </div>
      <div class="line">
        <span class="ln">20</span>&nbsp;&nbsp;<span class="prop">stack</span>: [<span class="string"
          >'Angular'</span
        >, <span class="string">'TypeScript'</span>, <span class="string">'Firebase'</span>,
        <span class="string">'RxJS'</span>],
      </div>
      <div class="line">
        <span class="ln">21</span>&nbsp;&nbsp;<span class="prop">availability</span>:
        <span class="string">'{{ p.availability }}'</span>
      </div>
      <div class="line"><span class="ln">22</span>&#125;;</div>
      <div class="line"><span class="ln">23</span></div>
      <div class="line">
        <span class="ln">24</span><span class="comment">// Professional Brief</span>
      </div>
      <div class="line">
        <span class="ln">25</span><span class="keyword">const</span> <span class="prop">bio</span> =
        <span class="string">&#96;</span>
      </div>
      <div class="line">
        <span class="ln">26</span><span class="string">&nbsp;&nbsp;{{ p.bio }}</span>
      </div>
      <div class="line"><span class="ln">27</span><span class="string">&#96;</span>;</div>
      } @else {
      <div class="line">
        <span class="ln">1</span
        ><span class="comment">// Fetching operator data from secure cloud...</span>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .code-container {
        font-family: 'Fira Code', 'JetBrains Mono', monospace;
        font-size: 14px;
        line-height: 1.6;
        padding: 20px;
      }
      .line {
        display: flex;
        white-space: pre;
      }
      .ln {
        width: 30px;
        color: rgba(255, 255, 255, 0.15);
        text-align: right;
        padding-right: 15px;
        user-select: none;
      }
      .keyword {
        color: #c586bf;
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
      .const {
        color: #4fc1ff;
        font-weight: bold;
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
  protected state = inject(PortfolioStateService);
}
