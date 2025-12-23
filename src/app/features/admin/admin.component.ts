import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
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
        <button class="logout-btn" (click)="auth.logout()">Cerrar Sesión</button>
      </header>

      <main class="admin-grid">
        <!-- Profile Section -->
        <section class="admin-card">
          <h3>Sobre Mí (Bio)</h3>
          @if (profile$ | async; as profile) {
          <div class="edit-form">
            <input [(ngModel)]="profile.name" placeholder="Nombre" />
            <input [(ngModel)]="profile.role" placeholder="Rol" />
            <input [(ngModel)]="profile.location" placeholder="Ubicación" />
            <input [(ngModel)]="profile.motto" placeholder="Lema/Motto" />
            <button class="save-btn" (click)="saveProfile(profile)">Guardar Perfil</button>
          </div>
          }
        </section>

        <!-- Projects Section -->
        <section class="admin-card full-width">
          <h3>Gestión de Proyectos</h3>
          <div class="projects-list">
            @for (p of projects$ | async; track p.id) {
            <div class="project-item">
              <input [(ngModel)]="p.title" placeholder="Título" />
              <textarea [(ngModel)]="p.description" placeholder="Descripción"></textarea>
              <div class="actions">
                <button class="save-btn small" (click)="saveProject(p)">Actualizar</button>
              </div>
            </div>
            }
          </div>

          <div class="add-project">
            <h4>Añadir Nuevo Proyecto</h4>
            <input [(ngModel)]="newProject.title" placeholder="Nuevo Título" />
            <textarea
              [(ngModel)]="newProject.description"
              placeholder="Nueva Descripción"
            ></textarea>
            <button class="add-btn" (click)="addProject()">Crear Proyecto</button>
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
      .user-email {
        font-size: 14px;
        color: #858585;
        display: block;
      }
      .admin-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
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
        h3 {
          margin-bottom: 20px;
          color: #007acc;
        }
      }
      .edit-form,
      .project-item,
      .add-project {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .project-item {
        border-bottom: 1px solid #3c3c3c;
        padding-bottom: 20px;
        margin-bottom: 20px;
      }
      input,
      textarea {
        padding: 10px;
        background-color: #1e1e1e;
        border: 1px solid #3c3c3c;
        color: #fff;
        border-radius: 4px;
        &:focus {
          border-color: #007acc;
          outline: none;
        }
      }
      textarea {
        height: 80px;
        resize: vertical;
      }
      .save-btn,
      .add-btn {
        padding: 10px;
        background-color: #007acc;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        &:hover {
          background-color: #0062a3;
        }
      }
      .save-btn.small {
        width: 120px;
        align-self: flex-end;
      }
      .logout-btn {
        padding: 8px 16px;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .add-project {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 2px dashed #3c3c3c;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdminComponent {
  protected auth = inject(AuthService);
  private dataService = inject(DataService);

  profile$ = this.dataService.getDoc<any>('about', 'profile');
  projects$ = this.dataService.getCollection<any>('projects');

  newProject = { title: '', description: '' };

  async saveProfile(data: any) {
    await this.dataService.save('about', 'profile', data);
    alert('Perfil actualizado!');
  }

  async saveProject(project: any) {
    await this.dataService.update('projects', project.id, project);
    alert('Proyecto actualizado!');
  }

  async addProject() {
    if (!this.newProject.title) return;
    const id = Date.now().toString();
    await this.dataService.save('projects', id, this.newProject);
    this.newProject = { title: '', description: '' };
    alert('Proyecto creado!');
  }
}
