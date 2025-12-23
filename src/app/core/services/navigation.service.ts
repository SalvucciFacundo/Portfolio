import { Injectable, signal, computed } from '@angular/core';

export interface FileEntry {
  name: string;
  path: string; // The route/preview path
  type: 'ts' | 'scss' | 'md' | 'json' | 'html' | 'config' | 'git' | 'angular';
  folder: string;
  isOpen?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private allFiles = signal<FileEntry[]>([
    // About Module
    {
      name: 'about.component.ts',
      path: 'about',
      type: 'ts',
      folder: 'src/app/about',
      isOpen: true,
    },
    { name: 'about.component.html', path: 'about', type: 'html', folder: 'src/app/about' },
    { name: 'about.service.ts', path: 'about', type: 'ts', folder: 'src/app/about' },

    // Skills Module
    { name: 'skills.component.ts', path: 'skills', type: 'ts', folder: 'src/app/skills' },
    { name: 'skills.component.html', path: 'skills', type: 'html', folder: 'src/app/skills' },
    { name: 'skills.service.ts', path: 'skills', type: 'ts', folder: 'src/app/skills' },

    // Projects Module
    { name: 'projects.component.ts', path: 'projects', type: 'ts', folder: 'src/app/projects' },
    { name: 'projects.component.html', path: 'projects', type: 'html', folder: 'src/app/projects' },
    { name: 'projects.service.ts', path: 'projects', type: 'ts', folder: 'src/app/projects' },

    // Contact Module
    { name: 'contact.component.ts', path: 'contact', type: 'ts', folder: 'src/app/contact' },
    { name: 'contact.component.html', path: 'contact', type: 'html', folder: 'src/app/contact' },
    { name: 'contact.service.ts', path: 'contact', type: 'ts', folder: 'src/app/contact' },

    // Dummy / Root Files for aesthetics
    { name: 'curriculum.pdf', path: '', type: 'md', folder: 'src/assets' },
    { name: '.editorconfig', path: '', type: 'config', folder: 'root' },
    { name: '.gitignore', path: '', type: 'git', folder: 'root' },
    { name: 'angular.json', path: '', type: 'angular', folder: 'root' },
    { name: 'package-lock.json', path: '', type: 'json', folder: 'root' },
    { name: 'package.json', path: '', type: 'json', folder: 'root' },
    { name: 'README.md', path: '', type: 'md', folder: 'root' },
    { name: 'tsconfig.app.json', path: '', type: 'json', folder: 'root' },
    { name: 'tsconfig.json', path: '', type: 'json', folder: 'root' },
    { name: 'tsconfig.spec.json', path: '', type: 'json', folder: 'root' },
  ]);

  private activeFilePath = signal<string>('about.component.ts');

  readonly files = computed(() => this.allFiles());
  readonly openFiles = computed(() => this.allFiles().filter((f) => f.isOpen));
  readonly activeFile = computed(() =>
    this.allFiles().find((f) => f.name === this.activeFilePath())
  );

  openFile(fileName: string) {
    const targetFile = this.allFiles().find((f) => f.name === fileName);
    if (!targetFile || targetFile.folder === 'root') return;

    this.allFiles.update((files) =>
      files.map((f) => ({
        ...f,
        isOpen: f.name === fileName,
      }))
    );
    this.activeFilePath.set(fileName);
  }

  closeFile(fileName: string) {
    this.allFiles.update((files) =>
      files.map((f) => (f.name === fileName ? { ...f, isOpen: false } : f))
    );

    const remainingOpen = this.openFiles();
    if (remainingOpen.length === 0) {
      this.openFile('about.component.ts');
    } else if (this.activeFilePath() === fileName) {
      this.activeFilePath.set(remainingOpen[remainingOpen.length - 1].name);
    }
  }

  setActive(fileName: string) {
    this.activeFilePath.set(fileName);
  }
}
