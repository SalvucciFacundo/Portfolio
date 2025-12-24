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

      <!-- Edit Skills -->
      @if (type === 'edit-skills') {
      <div class="form-group">
        <p class="hint">// Manage your skill categories and specific items</p>
        <div class="skills-management-list">
          @for (group of state.skills(); track group.id) {
          <div class="skill-group-card">
            <div class="skill-group-header">
              <input [(ngModel)]="group.category" placeholder="Category Name" />
              <button class="icon-danger-btn" (click)="deleteSkillGroup(group.id!)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  />
                </svg>
              </button>
            </div>

            <div class="skill-items-grid">
              @for (item of group.items; track $index) {
              <div class="skill-pill-edit">
                <span>{{ item }}</span>
                <button (click)="removeItemFromGroup(group, $index)">×</button>
              </div>
              }
            </div>

            <div class="add-item-row">
              <input
                #newItemInput
                placeholder="Add skill..."
                (keyup.enter)="addItemToGroup(group, newItemInput.value); newItemInput.value = ''"
              />
              <button class="save-icon-btn" (click)="saveSkillGroup(group)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              </button>
            </div>
          </div>
          }
        </div>
        <button class="add-btn" (click)="addNewSkillGroup()">+ New Category</button>
      </div>
      }

      <!-- Edit Projects -->
      @if (type === 'edit-projects') {
      <div class="form-group">
        <button class="add-btn" (click)="addNewProject()">+ Create New Project</button>
        <div class="projects-scroll">
          @for (p of state.projects(); track p.id) {
          <div class="project-item-card complex">
            <div class="card-header">
              <input class="title-input" [(ngModel)]="p.title" placeholder="Project Title" />
              <button class="icon-danger-btn" (click)="deleteProject(p.id!)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  />
                </svg>
              </button>
            </div>

            <textarea [(ngModel)]="p.description" placeholder="Description"></textarea>

            <div class="input-grid">
              <div>
                <label>Image URL</label>
                <input [(ngModel)]="p.imageUrl" placeholder="https://..." />
              </div>
              <div>
                <label>Tags (comma separated)</label>
                <input
                  [ngModel]="p.tags.join(', ')"
                  (ngModelChange)="updateProjectTags(p, $event)"
                  placeholder="Angular, TS..."
                />
              </div>
            </div>

            <div class="input-grid">
              <div>
                <label>GitHub Link</label>
                <input [(ngModel)]="p.links.github!" placeholder="https://github.com/..." />
              </div>
              <div>
                <label>Live Demo</label>
                <input [(ngModel)]="p.links.live!" placeholder="https://..." />
              </div>
            </div>

            <div class="footer-row">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="p.featured" /> Featured
              </label>
              <div class="order-input">
                <label>Order</label>
                <input type="number" [(ngModel)]="p.order" />
              </div>
              <button class="save-btn-small" (click)="saveProject(p)">Update Project</button>
            </div>
          </div>
          }
        </div>
      </div>
      }

      <!-- Edit Contact -->
      @if (type === 'edit-contact') {
      <div class="form-group">
        <label>Section Title</label>
        <input [(ngModel)]="contactBuffer().title" placeholder="¡Hablemos!" />

        <label>Message</label>
        <textarea
          [(ngModel)]="contactBuffer().message"
          placeholder="Si tienes una propuesta..."
        ></textarea>

        <p class="hint">// Social links are synced with your Profile</p>

        <button class="primary-btn" (click)="saveContact()">Save Contact Text</button>
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
      .skills-management-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-height: 400px;
        overflow-y: auto;
        padding-right: 5px;
      }

      .skill-group-card {
        padding: 12px;
        background: #2d2d2d;
        border-radius: 6px;
        border-left: 3px solid #007acc;
      }

      .skill-group-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        input {
          font-weight: bold;
          flex: 1;
          margin-right: 10px;
        }
      }

      .skill-pill-edit {
        display: inline-flex;
        align-items: center;
        background: #3c3c3c;
        padding: 2px 8px;
        border-radius: 4px;
        margin: 2px;
        font-size: 11px;
        button {
          background: none;
          border: none;
          color: #ff5555;
          margin-left: 5px;
          cursor: pointer;
          font-weight: bold;
        }
      }

      .skill-items-grid {
        margin-bottom: 10px;
      }

      .add-item-row {
        display: flex;
        gap: 8px;
        input {
          flex: 1;
        }
      }

      .skills-management-list::-webkit-scrollbar {
        width: 6px;
      }
      .skills-management-list::-webkit-scrollbar-thumb {
        background: #3e3e3e;
        border-radius: 3px;
      }

      .project-item-card.complex {
        padding: 15px;
        border: 1px solid #3c3c3c;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .title-input {
        font-size: 16px;
        font-weight: bold;
        flex: 1;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
      }

      .input-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 10px;
        label {
          margin-bottom: 4px;
          display: block;
        }
      }

      .footer-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #3c3c3c;
        padding-top: 10px;
        margin-top: 5px;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        input {
          width: auto;
        }
      }

      .order-input {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        input {
          width: 60px;
        }
      }

      .icon-danger-btn {
        background: none;
        border: none;
        color: #ff5555;
        cursor: pointer;
        opacity: 0.6;
        &:hover {
          opacity: 1;
        }
        svg {
          width: 14px;
          height: 14px;
        }
      }

      .projects-scroll {
        max-height: 500px;
        overflow-y: auto;
        padding-right: 5px;
      }
      .projects-scroll::-webkit-scrollbar {
        width: 6px;
      }
      .projects-scroll::-webkit-scrollbar-thumb {
        background: #3e3e3e;
        border-radius: 3px;
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

  // Local buffer for profile
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

  // Local buffer for contact
  contactBuffer = signal({
    title: '¡Hablemos!',
    message: 'Si tienes una propuesta o quieres colaborar, no dudes en escribirme.',
  });

  constructor() {
    // Sincronizar buffers cuando el estado global cambia
    effect(() => {
      const p = this.state.profile();
      if (p) {
        this.profileBuffer.set({ ...p });
      }

      const c = this.state.contact();
      if (c) {
        this.contactBuffer.set({ ...c });
      }
    });
  }

  getModalTitle(type: string): string {
    const titles: Record<string, string> = {
      login: 'Autenticación de Administrador',
      'edit-profile': 'Editar Perfil Profesional',
      'edit-skills': 'Gestionar Habilidades',
      'edit-projects': 'Administrar Proyectos',
      'edit-contact': 'Configurar Sección de Contacto',
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
    if (!p.name?.trim()) {
      this.terminal.log(`> [VALIDACIÓN] El nombre es obligatorio`, 'error');
      return;
    }
    try {
      await this.dataService.save('about', 'profile', p);
      this.terminal.log(`> [COMPILADO] Información de perfil actualizada en Firestore`, 'success');
      this.modal.close();
    } catch (e: any) {
      this.terminal.log(`> [ERROR] Error al guardar perfil: ${e.message || e}`, 'error');
    }
  }

  async saveContact() {
    if (!this.contactBuffer().title?.trim()) {
      this.terminal.log(`> [VALIDACIÓN] El título de contacto es obligatorio`, 'error');
      return;
    }
    try {
      await this.dataService.save('about', 'contact', this.contactBuffer());
      this.terminal.log(`> [SYNC] Información de contacto actualizada`, 'success');
      this.modal.close();
    } catch (e: any) {
      this.terminal.log(`> [ERROR] Error al guardar contacto: ${e.message || e}`, 'error');
    }
  }

  async saveSkillGroup(group: any) {
    if (!group || !group.id) return;
    try {
      await this.dataService.update('skills', group.id, group);
      this.terminal.log(`> [SYNC] Categoría "${group.category}" sincronizada`, 'info');
    } catch (e) {
      this.terminal.log(`> [ERROR] Error al sincronizar skills`, 'error');
    }
  }

  addItemToGroup(group: any, value: string) {
    if (!value.trim()) return;
    group.items = [...group.items, value.trim()];
  }

  removeItemFromGroup(group: any, index: number) {
    group.items.splice(index, 1);
  }

  async deleteSkillGroup(id: string) {
    if (!confirm('¿Seguro que quieres eliminar esta categoría de habilidades?')) return;
    try {
      await this.dataService.delete('skills', id);
      this.terminal.log(`> [FS] Categoría eliminada: ${id}`, 'success');
    } catch (e) {
      this.terminal.log(`> [ERROR] Error al eliminar categoría`, 'error');
    }
  }

  async saveProject(p: any) {
    if (!p || !p.id) return;
    try {
      await this.dataService.update('projects', p.id, p);
      this.terminal.log(`> [DEPLOY] Proyecto "${p.title}" actualizado con éxito`, 'success');
    } catch (e) {
      this.terminal.log(`> [ERROR] Error al actualizar proyecto`, 'error');
    }
  }

  updateProjectTags(p: any, value: string) {
    p.tags = value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => !!t);
  }

  async deleteProject(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este proyecto?')) return;
    try {
      await this.dataService.delete('projects', id);
      this.terminal.log(`> [FS] Proyecto eliminado: ${id}`, 'success');
    } catch (e) {
      this.terminal.log(`> [ERROR] Error al eliminar proyecto`, 'error');
    }
  }

  async addNewProject() {
    const newP = {
      title: 'Nuevo Proyecto',
      description: 'Descripción pendiente...',
      imageUrl: '',
      tags: ['Angular'],
      links: { github: '', live: '' },
      order: 99,
      featured: false,
    };
    const id = Date.now().toString();
    try {
      await this.dataService.save('projects', id, newP);
      this.terminal.log(`> [FS] Creado nuevo registro de proyecto: ${id}`, 'success');
    } catch (e) {
      this.terminal.log(`> [ERROR] Error al crear proyecto`, 'error');
    }
  }

  async addNewSkillGroup() {
    const newGroup = {
      category: 'Nueva Categoría',
      items: [],
    };
    const id = Date.now().toString();
    try {
      await this.dataService.save('skills', id, newGroup);
      this.terminal.log(`> [FS] Nueva sección de habilidades creada: ${id}`, 'success');
    } catch (e) {
      this.terminal.log(`> [ERROR] Error al crear categoría`, 'error');
    }
  }
}
