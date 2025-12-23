import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../core/services/modal.service';
import { PortfolioStateService } from '../core/services/portfolio-state.service';
import { TerminalService } from '../core/services/terminal.service';
import { DataService } from '../core/data/data.service';
import { AuthService } from '../core/auth/auth.service';
import { ModalComponent } from '../shared/components/modal.component';
import { Profile } from '../core/models/portfolio.model';

@Component({
  selector: 'app-modal-container',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    @if (modal.activeModal(); as type) {
    <app-modal [title]="getModalTitle(type)" (close)="modal.close()">
      <!-- Login Modal -->
      @if (type === 'login') {
      <div class="form-group">
        <label>Email</label>
        <input type="email" [(ngModel)]="loginEmail" placeholder="admin@portfolio.com" />
        <label>Password</label>
        <input type="password" [(ngModel)]="loginPass" />
        <button class="primary-btn" (click)="doLogin()">Sign In</button>
      </div>
      }

      <!-- Edit Profile -->
      @if (type === 'edit-profile') {
      <div class="form-group">
        @let p = state.profile();
        <label>Name</label>
        <input [(ngModel)]="profileBuffer().name" placeholder="Tu Nombre" />

        <label>Role</label>
        <input [(ngModel)]="profileBuffer().role" placeholder="Tu Rol" />

        <label>Motto</label>
        <input [(ngModel)]="profileBuffer().motto" placeholder="Tu Lema" />

        <label>Location</label>
        <input [(ngModel)]="profileBuffer().location" placeholder="Ciudad, País" />

        <label>Bio</label>
        <textarea
          [(ngModel)]="profileBuffer().bio"
          placeholder="Breve biografía profesional"
        ></textarea>

        <div class="socials-grid">
          <div>
            <label>GitHub</label>
            <input
              [(ngModel)]="profileBuffer().socials.github"
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label>LinkedIn</label>
            <input
              [(ngModel)]="profileBuffer().socials.linkedin"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label>Twitter</label>
            <input
              [(ngModel)]="profileBuffer().socials.twitter"
              placeholder="https://twitter.com/..."
            />
          </div>
          <div>
            <label>Email</label>
            <input [(ngModel)]="profileBuffer().socials.email" placeholder="email@ejemplo.com" />
          </div>
        </div>

        <button class="primary-btn" (click)="saveProfile(profileBuffer())">
          {{ p ? 'Actualizar Perfil' : 'Crear Perfil' }}
        </button>
      </div>
      }

      <!-- Edit Skills (Simplified) -->
      @if (type === 'edit-skills') {
      <div class="form-group">
        <p class="hint">// Edit your skills categories</p>
        @for (group of state.skills(); track group.category) {
        <div class="item-row">
          <input [(ngModel)]="group.category" />
          <span class="count">{{ group.items.length }} items</span>
          <button class="save-icon-btn" (click)="saveSkillGroup(group)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          </button>
        </div>
        }
        <button class="add-btn" (click)="addNewSkillGroup()">+ Add Category</button>
      </div>
      }

      <!-- Edit Projects -->
      @if (type === 'edit-projects') {
      <div class="form-group">
        <button class="add-btn" (click)="addNewProject()">+ Create New Project</button>
        <div class="projects-scroll">
          @for (p of state.projects(); track p.id) {
          <div class="project-item-card">
            <input [(ngModel)]="p.title" placeholder="Project Title" />
            <textarea [(ngModel)]="p.description" placeholder="Short description"></textarea>
            <button class="save-btn-small" (click)="saveProject(p)">Update</button>
          </div>
          }
        </div>
      </div>
      }
    </app-modal>
    }
  `,
  styles: [
    `
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      label {
        font-size: 11px;
        color: #888;
        text-transform: uppercase;
      }
      input,
      textarea {
        background: #252526;
        border: 1px solid #3c3c3c;
        color: #fff;
        padding: 8px 10px;
        border-radius: 4px;
        font-size: 13px;
        &:focus {
          border-color: #007acc;
          outline: none;
        }
      }
      textarea {
        height: 60px;
        resize: vertical;
      }

      .primary-btn {
        background: #007acc;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 10px;
        &:hover {
          background: #0062a3;
        }
      }

      .item-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
      }
      .count {
        font-size: 10px;
        color: #666;
        width: 60px;
      }

      .project-item-card {
        padding: 12px;
        background: #2d2d2d;
        border-radius: 6px;
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .save-btn-small {
        align-self: flex-end;
        background: transparent;
        color: #007acc;
        border: 1px solid #007acc;
        font-size: 11px;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
      }

      .add-btn {
        background: #28a745;
        color: white;
        border: none;
        padding: 8px;
        border-radius: 4px;
        font-size: 12px;
        margin-bottom: 15px;
        cursor: pointer;
      }

      .hint {
        font-size: 11px;
        color: #6a9955;
        font-family: var(--font-mono);
        margin-bottom: 10px;
      }

      .save-icon-btn {
        background: none;
        border: none;
        color: #007acc;
        cursor: pointer;
        svg {
          width: 14px;
          height: 14px;
        }
        &:hover {
          color: #fff;
        }
      }

      .socials-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalContainerComponent {
  protected modal = inject(ModalService);
  protected state = inject(PortfolioStateService);
  private terminal = inject(TerminalService);
  private dataService = inject(DataService);
  private auth = inject(AuthService);

  loginEmail = '';
  loginPass = '';

  // Local buffer for profile to allow editing empty or existing data
  profileBuffer = signal<Profile>({
    name: '',
    role: '',
    motto: '',
    location: '',
    bio: '',
    socials: {
      github: '',
      linkedin: '',
      twitter: '',
      email: '',
    },
  });

  constructor() {
    // Sync buffer when state profile changes
    effect(() => {
      const p = this.state.profile();
      if (p) {
        this.profileBuffer.set({ ...p });
      }
    });
  }

  getModalTitle(type: string): string {
    const titles: Record<string, string> = {
      login: 'Auntenticación de Administrador',
      'edit-profile': 'Editar Perfil Profesional',
      'edit-skills': 'Gestionar Habilidades',
      'edit-projects': 'Administrar Proyectos',
    };
    return titles[type] || 'Dialog';
  }

  async doLogin() {
    try {
      await this.auth.login(this.loginEmail, this.loginPass);
      this.terminal.log(`> Login successful for: ${this.loginEmail}`, 'success');
      this.modal.close();
    } catch (e) {
      this.terminal.log(`> Login failed: Invalid credentials`, 'error');
    }
  }

  async saveProfile(p: any) {
    if (!p) return;
    try {
      await this.dataService.save('about', 'profile', p);
      this.terminal.log(`> [COMPILADO] Información de perfil actualizada en Firestore`, 'success');
      this.modal.close();
    } catch (e: any) {
      this.terminal.log(`> [ERROR] Error al guardar perfil: ${e.message || e}`, 'error');
    }
  }

  async saveSkillGroup(group: any) {
    if (!group || !group.id) return;
    await this.dataService.update('skills', group.id, group);
    this.terminal.log(`> [SYNC] Categoría "${group.category}" sincronizada en la nube`, 'info');
  }

  async saveProject(p: any) {
    if (!p || !p.id) return;
    await this.dataService.update('projects', p.id, p);
    this.terminal.log(`> [DEPLOY] Proyecto "${p.title}" actualizado con éxito`, 'success');
  }

  async addNewProject() {
    const newP = {
      title: 'Nuevo Proyecto',
      description: 'Descripción pendiente...',
      tags: ['Angular'],
      order: 99,
      featured: false,
    };
    const id = Date.now().toString();
    await this.dataService.save('projects', id, newP);
    this.terminal.log(`> [FS] Creado nuevo registro de proyecto: ${id}`, 'success');
  }

  async addNewSkillGroup() {
    const newGroup = {
      category: 'Nueva Categoría',
      items: ['Puntero 1', 'Puntero 2'],
    };
    const id = Date.now().toString();
    await this.dataService.save('skills', id, newGroup);
    this.terminal.log(`> [FS] Nueva sección de habilidades creada: ${id}`, 'success');
  }
}
