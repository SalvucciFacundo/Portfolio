import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NavigationService, FileEntry } from '../core/services/navigation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <span>EXPLORER</span>
        <div class="header-actions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 13h6m-3-3v6m-9-9h18v14H3V4z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20m0-20l-4 4m4-4l4 4" />
          </svg>
        </div>
      </div>

      <div class="sidebar-content">
        <div class="folder open root">
          <div class="folder-header">
            <svg class="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
            <span class="folder-icon" [ngStyle]="getFolderStyle('root')"></span>
            <span>PORTFOLIO</span>
          </div>

          <div class="folder-items root-level">
            <!-- src -->
            <div class="folder open">
              <div class="folder-header">
                <svg class="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
                <span class="folder-icon" [ngStyle]="getFolderStyle('src')"></span>
                <span class="text">src</span>
              </div>

              <div class="folder-items">
                <!-- app -->
                <div class="folder open">
                  <div class="folder-header">
                    <svg class="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
                    <span class="folder-icon" [ngStyle]="getFolderStyle('app')"></span>
                    <span class="text">app</span>
                  </div>

                  <div class="folder-items">
                    @for (module of ['home', 'about', 'skills', 'projects', 'contact']; track
                    module) {
                    <div class="folder open">
                      <div class="folder-header">
                        <svg class="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
                        <span class="folder-icon" [ngStyle]="getFolderStyle(module)"></span>
                        <span class="text">{{ module }}</span>
                      </div>
                      <div class="folder-items">
                        @for (file of getFilesForFolder('src/app/' + module); track file.name) {
                        <div
                          class="file-item"
                          [class.active]="isActive(file.name)"
                          (click)="selectFile(file)"
                        >
                          <span class="file-icon" [ngStyle]="getFileIconStyle(file)"></span>
                          <span class="text">{{ file.name }}</span>
                        </div>
                        }
                      </div>
                    </div>
                    }
                  </div>
                </div>

                <!-- assets -->
                <div class="folder open">
                  <div class="folder-header">
                    <svg class="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
                    <span class="folder-icon" [ngStyle]="getFolderStyle('assets')"></span>
                    <span class="text">assets</span>
                  </div>
                  <div class="folder-items">
                    @for (file of getFilesForFolder('src/assets'); track file.name) {
                    <div class="file-item" (click)="selectFile(file)">
                      <span class="file-icon" [ngStyle]="getFileIconStyle(file)"></span>
                      <span class="text">{{ file.name }}</span>
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Root Level Files -->
            @for (file of getFilesForFolder('root'); track file.name) {
            <div class="file-item root-file">
              <span class="file-icon" [ngStyle]="getFileIconStyle(file)"></span>
              <span class="text">{{ file.name }}</span>
            </div>
            }
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: block;
        overflow: hidden;
      }
      .sidebar {
        width: 260px;
        background-color: var(--bg-sidebar);
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--border-color);
        height: 100%;
        user-select: none;
      }

      .sidebar-header {
        height: 35px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
        font-size: 11px;
        font-weight: 600;
        color: var(--fg-sidebar);
        flex-shrink: 0;
        .header-actions {
          display: flex;
          gap: 6px;
          svg {
            width: 14px;
            height: 14px;
            opacity: 0.6;
            cursor: pointer;
            &:hover {
              opacity: 1;
            }
          }
        }
      }

      .sidebar-content {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        padding-top: 5px;

        .folder {
          .folder-header {
            height: 22px;
            display: flex;
            align-items: center;
            padding-left: 20px;
            cursor: pointer;
            font-size: 13px;
            color: var(--fg-sidebar);
            position: relative;

            &:hover {
              background-color: rgba(255, 255, 255, 0.05);
            }

            .chevron {
              width: 16px;
              height: 16px;
              margin-right: 2px;
              opacity: 0.8;
              flex-shrink: 0;
              stroke: currentColor;
              stroke-width: 2;
              fill: none;
              position: absolute;
              left: 2px;
            }

            .folder-icon {
              width: 18px;
              height: 18px;
              margin-right: 6px;
              background-size: contain;
              background-repeat: no-repeat;
              flex-shrink: 0;
            }

            .text {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          &.root > .folder-header {
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
            color: #fff;
            padding-left: 20px;
            .chevron {
              left: 2px;
            }
            .folder-icon {
              width: 16px;
              height: 16px;
            }
          }

          .folder-items {
            padding-left: 12px;
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            margin-left: 10px;

            &.root-level {
              margin-left: 0;
              padding-left: 0;
              border-left: none;
            }
          }
        }

        .file-item {
          height: 22px;
          display: flex;
          align-items: center;
          padding-left: 20px;
          cursor: pointer;
          font-size: 13px;
          color: var(--fg-sidebar);
          transition: background 0.1s;

          &:hover {
            background-color: rgba(255, 255, 255, 0.05);
          }
          &.active {
            background-color: rgba(0, 122, 204, 0.15);
            color: var(--fg-active);
            box-shadow: inset 2px 0 0 var(--accent-color);
          }

          &.root-file {
            padding-left: 10px;
          }

          .file-icon {
            width: 18px;
            height: 18px;
            margin-right: 6px;
            background-size: contain;
            background-repeat: no-repeat;
            flex-shrink: 0;
          }

          .text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  protected readonly nav = inject(NavigationService);

  private readonly ICO_PATH = '/assets/material-icons';

  getFilesForFolder(folder: string) {
    return this.nav.files().filter((f) => f.folder === folder);
  }

  getFolderStyle(module: string) {
    const icons: Record<string, string> = {
      home: 'folder-hook-open.svg',
      about: 'folder-client-open.svg',
      skills: 'folder-resource-open.svg',
      projects: 'folder-project-open.svg',
      contact: 'folder-mail-open.svg',
      src: 'folder-src-open.svg',
      app: 'folder-app-open.svg',
      assets: 'folder-resource-open.svg',
      root: 'folder-root-open.svg',
    };
    const icon = icons[module] || 'folder-open.svg';
    return { 'background-image': `url("${this.ICO_PATH}/${icon}")` };
  }

  getFileIconStyle(file: FileEntry) {
    let icon = '';

    if (file.name.includes('.service.')) {
      icon = 'angular-service.clone.svg';
    } else if (file.name === 'README.md') {
      icon = 'readme.svg';
    } else if (file.name === 'package.json' || file.name === 'package-lock.json') {
      icon = 'nodejs.svg';
    } else if (file.name.includes('tsconfig')) {
      icon = 'tsconfig.svg';
    } else {
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
      icon = mapping[file.type] || 'file.svg';
    }

    return { 'background-image': `url("${this.ICO_PATH}/${icon}")` };
  }

  isActive(fileName: string) {
    return this.nav.activeFile()?.name === fileName;
  }

  selectFile(file: FileEntry) {
    if (file.folder === 'root') return;

    // Open file and update state
    this.nav.openFile(file.name, true);

    // Auto-close sidebar on mobile
    if (window.innerWidth <= 768) {
      this.nav.isSidebarVisible.set(false);
    }
  }
}
