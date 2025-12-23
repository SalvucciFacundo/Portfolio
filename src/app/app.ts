import {
  Component,
  ChangeDetectionStrategy,
  inject,
  effect,
  viewChild,
  ElementRef,
} from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from './layout/sidebar.component';
import { TabsBarComponent } from './layout/tabs-bar.component';
import { NavigationService } from './core/services/navigation.service';
import { TerminalService } from './core/services/terminal.service';
import { ThemeService } from './core/services/theme.service';
import { AboutPreviewComponent } from './features/about/about-preview.component';
import { SkillsPreviewComponent } from './features/skills/skills-preview.component';
import { ProjectsPreviewComponent } from './features/projects/projects-preview.component';
import { ContactPreviewComponent } from './features/contact/contact-preview.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    TabsBarComponent,
    AboutPreviewComponent,
    SkillsPreviewComponent,
    ProjectsPreviewComponent,
    ContactPreviewComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly nav = inject(NavigationService);
  protected readonly terminal = inject(TerminalService);
  protected readonly theme = inject(ThemeService);
  private router = inject(Router);
  private terminalScroll = viewChild<ElementRef>('terminalScroll');

  constructor() {
    effect(() => {
      this.terminal.logs(); // Dependency
      const el = this.terminalScroll()?.nativeElement;
      if (el) {
        setTimeout(() => (el.scrollTop = el.scrollHeight), 0);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
