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
    CommonModule,
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
  private previewScroll = viewChild<ElementRef>('previewScroll');

  constructor() {
    effect(() => {
      // Handle Scroll Requests from sidebar
      const sectionId = this.nav.scrollToRequest();
      if (sectionId) {
        const el = this.previewScroll()?.nativeElement;
        const target = el?.querySelector(`#${sectionId}-section`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        this.nav.scrollToRequest.set(null); // Reset request
      }
    });

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

  onPreviewScroll(event: Event) {
    if (typeof window === 'undefined' || window.innerWidth > 768) return; // Only scroll spy on mobile and client

    const container = event.target as HTMLElement;
    const scrollPos = container.scrollTop + 100; // Offset for better detection

    const sections = [
      {
        id: 'about',
        top: container.querySelector('#about-section')?.getBoundingClientRect().top || 0,
      },
      {
        id: 'skills',
        top: container.querySelector('#skills-section')?.getBoundingClientRect().top || 0,
      },
      {
        id: 'projects',
        top: container.querySelector('#projects-section')?.getBoundingClientRect().top || 0,
      },
      {
        id: 'contact',
        top: container.querySelector('#contact-section')?.getBoundingClientRect().top || 0,
      },
    ];

    // Find current section
    const current = sections.reverse().find((s) => s.top <= 150);
    if (current && this.nav.activeFile()?.path !== current.id) {
      // We map path back to filename
      const mapping: Record<string, string> = {
        about: 'about.component.html',
        skills: 'skills.component.html',
        projects: 'projects.component.html',
        contact: 'contact.component.html',
      };

      // Update active file WITHOUT switching view mode or closing sidebar
      const fileName = mapping[current.id];
      if (fileName) {
        this.nav.openFile(fileName, false); // false = don't switch view
      }
    }
  }
}
