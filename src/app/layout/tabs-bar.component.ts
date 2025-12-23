import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NavigationService, FileEntry } from '../core/services/navigation.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs-bar',
  imports: [CommonModule],
  template: `
    <nav class="tabs-bar">
      @for (file of nav.openFiles(); track file.name) {
      <div
        class="tab"
        [class.active]="nav.activeFile()?.name === file.name"
        (click)="selectFile(file)"
      >
        <span class="file-icon" [ngStyle]="getFileIconStyle(file)"></span>
        <span class="file-name">{{ file.name }}</span>
        <span class="close-icon" (click)="closeFile($event, file.name)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </span>
      </div>
      }
    </nav>
  `,
  styles: [
    `
      .tabs-bar {
        height: 35px;
        display: flex;
        background-color: var(--bg-tabs);
        overflow-x: auto;
        border-bottom: 1px solid var(--border-color);
        scrollbar-width: none;
        &::-webkit-scrollbar {
          display: none;
        }
      }

      .tab {
        height: 100%;
        min-width: 140px;
        max-width: 220px;
        display: flex;
        align-items: center;
        padding: 0 12px;
        background-color: var(--bg-tab-inactive);
        border-right: 1px solid var(--border-color);
        cursor: pointer;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.5);
        position: relative;
        transition: background 0.1s;

        &:hover {
          background-color: #2d2d2d;
          color: #fff;
        }

        &.active {
          background-color: var(--bg-tab-active);
          color: var(--fg-active);
          &::after {
            content: '';
            position: absolute;
            top: -1px;
            left: 0;
            right: 0;
            height: 1px;
            background-color: var(--accent-color);
          }
        }

        .file-icon {
          width: 18px;
          height: 18px;
          margin-right: 8px;
          flex-shrink: 0;
          background-size: contain;
          background-repeat: no-repeat;
        }

        .file-name {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .close-icon {
          width: 18px;
          height: 18px;
          margin-left: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.1s;
          svg {
            width: 12px;
            height: 12px;
          }
          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }
        }

        &:hover .close-icon,
        &.active .close-icon {
          opacity: 1;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TabsBarComponent {
  protected readonly nav = inject(NavigationService);
  private router = inject(Router);

  private readonly ICO_PATH = '/assets/material-icons';

  getFileIconStyle(file: FileEntry) {
    let icon = '';

    if (file.name.includes('.service.')) {
      icon = 'angular-service.clone.svg';
    } else {
      const mapping: Record<string, string> = {
        ts: 'typescript.svg',
        html: 'html.svg',
        scss: 'sass.svg',
        md: 'markdown.svg',
      };
      icon = mapping[file.type] || 'file.svg';
    }

    return { 'background-image': `url("${this.ICO_PATH}/${icon}")` };
  }

  selectFile(file: FileEntry) {
    this.nav.setActive(file.name);
    this.router.navigate([file.path]);
  }

  closeFile(event: Event, fileName: string) {
    event.stopPropagation();
    this.nav.closeFile(fileName);
    const active = this.nav.activeFile();
    if (active) {
      this.router.navigate([active.path]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
