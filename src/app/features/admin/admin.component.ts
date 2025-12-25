import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { ModalService } from '../../core/services/modal.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <header>
        <div class="header-main">
          <h1>Admin Dashboard</h1>
          <span class="user-email">{{ auth.currentUser()?.email }}</span>
        </div>
        <div class="header-actions">
          <button class="secondary-btn" (click)="modal.open('edit-profile')">
            Edit Pro Identity
          </button>
          <button class="logout-btn" (click)="auth.logout()">Cerrar Sesión</button>
        </div>
      </header>

      <main class="admin-grid">
        <!-- Quick Stats / Status -->
        <section class="admin-card">
          <h3>System Overview</h3>
          <div class="status-list">
            @if (profile$ | async; as p) {
            <div class="status-item">
              <span class="label">Operator:</span>
              <span class="value">{{ p.name }}</span>
            </div>
            <div class="status-item">
              <span class="label">Role:</span>
              <span class="value">{{ p.role }}</span>
            </div>
            <div class="status-item">
              <span class="label">Status:</span>
              <span class="value badge">{{ p.status }}</span>
            </div>
            }
          </div>
          <button class="save-btn" (click)="modal.open('edit-profile')">
            Open Management Console
          </button>
        </section>

        <!-- Projects Section -->
        <section class="admin-card full-width">
          <div class="card-header">
            <h3>Projects Management</h3>
            <button class="add-btn small" (click)="modal.open('edit-projects')">
              Manage Projects
            </button>
          </div>

          <div class="projects-preview-grid">
            @for (p of projects$ | async; track p.id) {
            <div class="project-mini-card">
              <strong>{{ p.title }}</strong>
              <p>{{ p.description }}</p>
              <div class="tags">
                @for (tag of p.tags; track tag) {
                <span class="tag">{{ tag }}</span>
                }
              </div>
            </div>
            }
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [
    `
      .admin-container {
        padding: 40px;
        background-color: #1e1e1e;
        color: #fff;
        min-height: 100vh;
      }
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        border-bottom: 1px solid #3c3c3c;
        padding-bottom: 20px;
      }
      .header-actions {
        display: flex;
        gap: 12px;
      }
      .admin-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 30px;
      }
      .full-width {
        grid-column: 1 / -1;
      }
      .admin-card {
        background-color: #252526;
        padding: 24px;
        border-radius: 8px;
        border: 1px solid #3c3c3c;
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        h3 {
          margin: 0;
          color: #007acc;
          font-size: 18px;
        }
      }

      .status-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 25px;
      }
      .status-item {
        display: flex;
        justify-content: space-between;
        font-family: var(--font-mono);
        font-size: 14px;
        .label {
          color: #858585;
        }
        .value {
          color: #fff;
        }
        .value.badge {
          background: rgba(0, 122, 204, 0.2);
          color: #4fc1ff;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
        }
      }

      .projects-preview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
      }
      .project-mini-card {
        background: #1e1e1e;
        padding: 15px;
        border-radius: 6px;
        border: 1px solid #333;
        strong {
          display: block;
          margin-bottom: 8px;
          color: #4fc1ff;
        }
        p {
          font-size: 13px;
          color: #aaa;
          margin: 0 0 12px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
      .tags {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      .tag {
        font-size: 10px;
        background: #333;
        color: #888;
        padding: 2px 6px;
        border-radius: 3px;
      }

      .save-btn,
      .add-btn,
      .secondary-btn,
      .logout-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        font-size: 13px;
        transition: all 0.2s;
      }

      .save-btn,
      .add-btn {
        background: #007acc;
        color: #fff;
        width: 100%;
        &:hover {
          background: #0062a3;
        }
      }
      .add-btn.small {
        width: auto;
      }
      .secondary-btn {
        background: #3c3c3c;
        color: #fff;
        &:hover {
          background: #4a4a4a;
        }
      }
      .logout-btn {
        background: #f44336;
        color: white;
        &:hover {
          background: #d32f2f;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdminComponent {
  protected auth = inject(AuthService);
  private dataService = inject(DataService);
  protected modal = inject(ModalService);

  profile$ = this.dataService.getDoc<any>('about', 'profile');
  projects$ = this.dataService.getCollection<any>('projects');
}
