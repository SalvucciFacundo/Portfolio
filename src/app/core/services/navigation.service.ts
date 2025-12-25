import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface FileEntry {
  name: string;
  path: string; // The route/preview path
  type: 'ts' | 'scss' | 'md' | 'json' | 'html' | 'config' | 'git' | 'angular' | 'shell' | 'routing';
  folder: string;
  isOpen?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);
  isSidebarVisible = signal(typeof window !== 'undefined' ? window.innerWidth > 992 : true);
  viewMode = signal<'code' | 'preview'>('preview');
  scrollToRequest = signal<string | null>(null);
  isNavigating = signal(false);

  getFileIcon(type: string, fileName?: string): string {
    const base = 'assets/material-icons';
    let icon = '';

    // Special cases based on file name (Sync with sidebar logic)
    if (fileName) {
      if (fileName.includes('.service.')) {
        icon = 'angular-service.clone.svg';
      } else if (fileName.includes('.component.')) {
        icon = 'angular-component.clone.svg';
      } else if (fileName === 'README.md') {
        icon = 'readme.svg';
      } else if (fileName === 'package.json' || fileName === 'package-lock.json') {
        icon = 'nodejs.svg';
      } else if (fileName.includes('tsconfig')) {
        icon = 'tsconfig.svg';
      }
    }

    if (!icon) {
      const mapping: Record<string, string> = {
        ts: 'typescript.svg',
        html: 'html.svg',
        scss: 'sass.svg',
        md: 'markdown.svg',
        json: 'json.svg',
        config: 'editorconfig.svg',
        git: 'git.svg',
        angular: 'angular.svg',
        shell: 'console.svg',
        routing: 'routing.svg',
      };
      icon = mapping[type] || 'file.svg';
    }

    return `${base}/${icon}`;
  }

  // Section-based navigation for horizontal preview
  private sections = ['home', 'about', 'skills', 'projects', 'contact'];
  activeSection = computed(() => {
    const file = this.activeFile();
    return file?.path || 'home';
  });

  toggleSidebar() {
    this.isSidebarVisible.update((v: boolean) => !v);
  }

  // Request a scroll to a specific section
  requestScroll(sectionId: string) {
    this.scrollToRequest.set(sectionId);
    if (window.innerWidth <= 768) {
      this.isSidebarVisible.set(false); // Close sidebar on request only on mobile
    }
  }

  toggleViewMode() {
    this.viewMode.update((v) => (v === 'code' ? 'preview' : 'code'));
  }

  private allFiles = signal<FileEntry[]>([
    { name: 'home.sh', path: 'home', type: 'shell', folder: 'src/app/home', isOpen: true },
    { name: 'about.component.ts', path: 'about', type: 'ts', folder: 'src/app/about' },
    { name: 'skills.service.ts', path: 'skills', type: 'ts', folder: 'src/app/skills' },
    { name: 'projects.component.html', path: 'projects', type: 'html', folder: 'src/app/projects' },
    { name: 'contact.ts', path: 'contact', type: 'routing', folder: 'src/app/contact' },

    // Dummy / Root Files for aesthetics
    { name: 'curriculum.pdf', path: '', type: 'md', folder: 'src/assets' },
    { name: '.editorconfig', path: '', type: 'config', folder: 'root' },
    { name: '.gitignore', path: '', type: 'git', folder: 'root' },
    { name: 'angular.json', path: '', type: 'angular', folder: 'root' },
    { name: 'package.json', path: '', type: 'json', folder: 'root' },
    { name: 'README.md', path: '', type: 'md', folder: 'root' },
  ]);

  private activeFilePath = signal<string>('home.sh');

  readonly files = computed(() => this.allFiles());
  readonly openFiles = computed(() => this.allFiles().filter((f) => f.isOpen));
  readonly activeFile = computed(() =>
    this.allFiles().find((f) => f.name === this.activeFilePath())
  );

  openFile(fileName: string, switchView = false) {
    const targetFile = this.allFiles().find((f) => f.name === fileName);
    if (!targetFile || targetFile.folder === 'root') return;

    this.allFiles.update((files) =>
      files.map((f) => {
        // Si el archivo que estamos abriendo pertenece a una sección (about, skills, etc)
        if (targetFile.path) {
          // Cerramos cualquier otro archivo que también pertenezca a una sección
          // Esto logra el efecto de "reemplazo" que buscas
          if (f.path) {
            return { ...f, isOpen: f.name === fileName };
          }
        }

        // Comportamiento para archivos de sistema/root (opcional: podrías dejarlos coexistir)
        if (window.innerWidth <= 768) {
          return { ...f, isOpen: f.name === fileName };
        }
        return { ...f, isOpen: f.name === fileName ? true : f.isOpen };
      })
    );
    this.activeFilePath.set(fileName);
    if (targetFile.path) {
      this.router.navigate([targetFile.path]);
    }

    // Only switch to code view if explicitly requested
    if (switchView && window.innerWidth <= 768) {
      this.viewMode.set('code');
      this.isSidebarVisible.set(false);
    }
  }

  closeFile(fileName: string) {
    this.allFiles.update((files) =>
      files.map((f) => (f.name === fileName ? { ...f, isOpen: false } : f))
    );

    const remainingOpen = this.openFiles();
    if (remainingOpen.length === 0) {
      this.openFile('about.component.ts');
    } else if (this.activeFilePath() === fileName) {
      const nextFile = remainingOpen[remainingOpen.length - 1];
      this.activeFilePath.set(nextFile.name);
      if (nextFile.path) this.router.navigate([nextFile.path]);
    }
  }

  setActive(fileName: string) {
    this.activeFilePath.set(fileName);
  }

  nextSection() {
    const current = this.activeSection();
    const idx = this.sections.indexOf(current);
    if (idx < this.sections.length - 1) {
      this.goToSection(this.sections[idx + 1]);
    }
  }

  prevSection() {
    const current = this.activeSection();
    const idx = this.sections.indexOf(current);
    if (idx > 0) {
      this.goToSection(this.sections[idx - 1]);
    }
  }

  private goToSection(section: string) {
    this.allFiles.update((files) =>
      files.map((f) => {
        // Cierra archivos de otras secciones de contenido (about, skills, etc)
        // para evitar que se acumulen demasiadas pestañas
        if (f.path && f.path !== section && this.sections.includes(f.path)) {
          return { ...f, isOpen: false };
        }
        // Abre automáticamente los archivos de la sección actual
        if (f.path === section) {
          return { ...f, isOpen: true };
        }
        return f;
      })
    );

    // Activa el archivo correspondiente a la sección
    const primaryFile = this.allFiles().find((f) => f.path === section);
    if (primaryFile) {
      this.isNavigating.set(true);
      this.activeFilePath.set(primaryFile.name);
      this.router.navigate([primaryFile.path]);

      // Duration should match CSS transition
      setTimeout(() => this.isNavigating.set(false), 800);
    }
  }

  getSectionIndex() {
    return this.sections.indexOf(this.activeSection());
  }

  getTotalSections() {
    return this.sections.length;
  }
}
