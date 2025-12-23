import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DataService } from '../../core/data/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  imports: [CommonModule],
  template: `
    <div class="code-container">
      <div class="line">
        <span class="ln">1</span
        ><span class="comment">// Mis Habilidades Técnicas (Firestore)</span>
      </div>
      <div class="line"><span class="ln">2</span><span class="variable">$skills</span>: (</div>

      @if (skills$ | async; as skills) { @for (skillGroup of skills; track skillGroup.id; let i =
      $index) {
      <div class="line">
        <span class="ln">{{ 3 + i }}</span
        >&nbsp;&nbsp;<span class="string">'{{ skillGroup.category }}'</span>: ( @for (name of
        skillGroup.items; track name; let last = $last) { <span class="string">'{{ name }}'</span
        >{{ !last ? ', ' : '' }}
        } ),
      </div>
      } } @else {
      <div class="line">
        <span class="ln">3</span>&nbsp;&nbsp;<span class="comment">// Cargando skills...</span>
      </div>
      }

      <div class="line"><span class="ln">10</span>);</div>
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
      .comment {
        color: #6a9955;
      }
      .variable {
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
export class SkillsComponent {
  private dataService = inject(DataService);

  // Fetch collection of skills
  skills$ = this.dataService.getCollection<any>('skills');
}
