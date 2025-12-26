import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../core/services/modal.service';
import { PortfolioStateService } from '../core/services/portfolio-state.service';
import { TerminalService } from '../core/services/terminal.service';
import { DataService } from '../core/data/data.service';
import { AuthService } from '../core/auth/auth.service';
import { ModalComponent } from '../shared/components/modal.component';
import { Profile, Project } from '../core/models/portfolio.model';
import { ToastService } from '../core/services/toast.service';

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

      <!-- Edit Home (New) -->
      @if (type === 'edit-home') {
      <div class="form-group">
        <p class="hint">// Modify terminal identity</p>
        <label>Operator Name</label>
        <input [(ngModel)]="profileBuffer().name" placeholder="Tu Nombre" />

        <label>Operator Role</label>
        <input [(ngModel)]="profileBuffer().role" placeholder="Tu Rol" />

        <button class="primary-btn" (click)="saveProfile(profileBuffer())">Update Identity</button>
      </div>
      }

      <!-- Edit Profile -->
      @if (type === 'edit-profile') {
      <div class="form-group modal-scrollable">
        @let p = state.profile();

        <div class="modal-section preview-compact">
          <h4><span class="ln">#</span> Visual & Location</h4>
          <div class="avatar-edit-layout">
            <div class="avatar-preview-box">
              @if (profileBuffer().avatarUrl) {
              <img [src]="profileBuffer().avatarUrl" alt="Preview" class="preview-img" />
              } @else {
              <div class="preview-placeholder">
                {{ (profileBuffer().name || 'FA').substring(0, 2).toUpperCase() }}
              </div>
              }
              <div class="status-dot"></div>
            </div>

            <div class="avatar-upload-field">
              <div class="field">
                <label>Avatar Image</label>
                <div class="upload-controls">
                  <input
                    type="file"
                    #fileInput
                    (change)="handleAvatarUpload($event)"
                    accept="image/*"
                    hidden
                  />
                  <button
                    class="secondary-btn upload-btn"
                    [disabled]="isUploadingAvatar()"
                    (click)="fileInput.click()"
                  >
                    {{ isUploadingAvatar() ? 'UPLOADING...' : 'CHANGE PHOTO' }}
                  </button>
                  @if (profileBuffer().avatarUrl) {
                  <button class="icon-danger-btn small" (click)="profileBuffer().avatarUrl = ''">
                    CLEAR
                  </button>
                  }
                </div>
                <p class="hint small">Upload to Firebase Storage or leave empty for default</p>
              </div>
            </div>
          </div>

          <div class="input-row">
            <div class="field">
              <label>Location</label>
              <input [(ngModel)]="profileBuffer().location" placeholder="Ciudad, País" />
            </div>
            <div class="field">
              <label>Timezone</label>
              <input [(ngModel)]="profileBuffer().timezone" placeholder="Ej: GMT-3" />
            </div>
          </div>
          <label>Availability</label>
          <input [(ngModel)]="profileBuffer().availability" placeholder="Ej: Remote / Full-time" />
          <label>Professional Status (Badge)</label>
          <input [(ngModel)]="profileBuffer().status" placeholder="Ej: Open to Work" />
        </div>

        <div class="modal-section background-details">
          <h4><span class="ln">#</span> Professional Background</h4>

          <div class="field-stack">
            <label>Main Education (University)</label>
            <div class="education-grid">
              <input
                [(ngModel)]="profileBuffer().education!.degree"
                placeholder="Degree (Ej: Tecnicatura en Programación)"
              />
              <input
                [(ngModel)]="profileBuffer().education!.university"
                placeholder="University (Ej: UTN)"
              />
            </div>
          </div>

          <div class="field-stack">
            <label>Additional Certifications & Courses (One per line)</label>
            <textarea
              [ngModel]="
                profileBuffer().certifications?.join(
                  '
'
                )
              "
              (ngModelChange)="updateCertifications($event)"
              placeholder="Google UX Design Certificate&#10;Fullstack BootCamp..."
              rows="4"
            ></textarea>
          </div>

          <div class="field-stack">
            <label>Languages (Format: Name:Level, one per line)</label>
            <textarea
              [ngModel]="formatLanguages(profileBuffer().languages)"
              (ngModelChange)="updateLanguages($event)"
              placeholder="Spanish: Native&#10;English: B2"
              rows="3"
            ></textarea>
          </div>

          <div class="field-stack">
            <label>Soft Skills (Comma separated)</label>
            <input
              [ngModel]="profileBuffer().softSkills?.join(', ')"
              (ngModelChange)="updateSoftSkills($event)"
              placeholder="Autogestión, Comunicación, Liderazgo..."
            />
          </div>

          <div class="field-stack">
            <label>Bio (About you)</label>
            <textarea
              [(ngModel)]="profileBuffer().bio"
              placeholder="Cuéntanos un poco sobre ti y tu trayectoria..."
              rows="6"
            ></textarea>
          </div>
        </div>

        <div class="modal-section social-links">
          <h4><span class="ln">#</span> Social Connect</h4>
          <div class="socials-grid">
            <div class="field">
              <label>LinkedIn</label>
              <input [(ngModel)]="profileBuffer().socials.linkedin" placeholder="LinkedIn URL" />
            </div>
            <div class="field">
              <label>GitHub</label>
              <input [(ngModel)]="profileBuffer().socials.github" placeholder="GitHub URL" />
            </div>
            <div class="field">
              <label>Email</label>
              <input [(ngModel)]="profileBuffer().socials.email" placeholder="email@ejemplo.com" />
            </div>
            <div class="field">
              <label>Twitter/X</label>
              <input [(ngModel)]="profileBuffer().socials.twitter" placeholder="Twitter URL" />
            </div>
          </div>
        </div>

        <button class="primary-btn save-btn" (click)="saveProfile(profileBuffer())">
          {{ p ? 'Save Changes' : 'Initialize Profile' }}
        </button>
      </div>
      }

      <!-- Edit Skills -->
      @if (type === 'edit-skills') {
      <div class="form-group modal-scrollable">
        <p class="hint">// Orchestrate your technical arsenal</p>

        <div class="skills-management-list">
          @for (group of state.skills(); track group.id) {
          <div class="skill-group-section">
            <div class="skill-group-header">
              <div class="field-stack">
                <label>Category Label</label>
                <div class="header-inputs">
                  <input [(ngModel)]="group.category" placeholder="Ej: Frontend" />
                  <button
                    class="icon-danger-btn"
                    (click)="deleteSkillGroup(group.id!)"
                    title="Destroy Category"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path
                        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <label>Active Modules (Skills)</label>
            <div class="skill-pills-container">
              @for (item of group.items; track $index) {
              <div class="skill-pill-edit">
                <i [class]="getIconClass(item)"></i>
                <span>{{ item }}</span>
                <button (click)="removeItemFromGroup(group, $index)" title="Remove">×</button>
              </div>
              } @empty {
              <p class="hint small">No skills in this category</p>
              }
            </div>

            <div class="add-item-row">
              <input
                #newItemInput
                placeholder="New module name (Ej: Angular)..."
                (keyup.enter)="addItemToGroup(group, newItemInput.value); newItemInput.value = ''"
              />
              <button
                class="secondary-btn small-btn"
                (click)="addItemToGroup(group, newItemInput.value); newItemInput.value = ''"
              >
                ADD
              </button>
              <button
                class="save-icon-btn action-btn-blue"
                (click)="saveSkillGroup(group)"
                title="Sync with Firestore"
              >
                SAVE CATEGORY
              </button>
            </div>
          </div>
          }
        </div>

        <button class="add-btn primary-btn" (click)="addNewSkillGroup()">
          + INITIALIZE NEW CATEGORY
        </button>
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
              <div class="field-stack flex-grow">
                <label>Project Technical Title</label>
                <input class="title-input" [(ngModel)]="p.title" placeholder="Project Title" />
              </div>
              <div class="field-stack title-extra">
                <label>EXE Name</label>
                <input [(ngModel)]="p.exeName" placeholder="project_v1.exe" />
              </div>
              <button class="icon-danger-btn" (click)="deleteProject(p.id!)" title="Destroy Record">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  />
                </svg>
              </button>
            </div>

            <textarea [(ngModel)]="p.description" placeholder="Description"></textarea>

            <div class="input-grid">
              <div class="image-upload-zone">
                <label>Project Screenshot</label>
                <div class="upload-controls">
                  @if (p.imageUrl) {
                  <div class="project-preview-box">
                    <img [src]="p.imageUrl" alt="Preview" />
                  </div>
                  } @else {
                  <div class="project-preview-placeholder">NO_IMAGE_DATA</div>
                  }
                  <div class="upload-actions">
                    <input
                      #projectImgInput
                      type="file"
                      hidden
                      accept="image/*"
                      (change)="handleProjectImageUpload($event, p)"
                    />
                    <button
                      class="secondary-btn small-btn"
                      (click)="projectImgInput.click()"
                      [disabled]="uploadingProjects().get(p.id!)"
                    >
                      {{ uploadingProjects().get(p.id!) ? 'UPLOADING...' : 'UPLOAD NEW' }}
                    </button>
                    <input class="url-hint" [(ngModel)]="p.imageUrl" placeholder="Manual URL..." />
                  </div>
                </div>
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

            <div class="input-grid">
              <div>
                <label>Operator Role</label>
                <input [(ngModel)]="p.role" placeholder="Ej: Lead Developer" />
              </div>
              <div>
                <label>Deployment Host</label>
                <input [(ngModel)]="p.host" placeholder="Ej: Vercel, Firebase..." />
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
      <div class="form-group modal-scrollable">
        <div class="modal-section">
          <h4><span class="ln">#</span> Títulos y Textos</h4>
          <label>Título de la Sección</label>
          <input [(ngModel)]="contactBuffer().title" placeholder="¡Hablemos!" />

          <label>Mensaje de Invitación</label>
          <textarea
            [(ngModel)]="contactBuffer().message"
            placeholder="Si tienes una propuesta..."
            rows="3"
          ></textarea>
        </div>

        <div class="modal-section social-links">
          <h4><span class="ln">#</span> Redes y Correo</h4>
          <p class="hint small">Esta información se sincroniza con tu perfil general.</p>
          <div class="socials-grid">
            <div class="field">
              <label>LinkedIn</label>
              <input [(ngModel)]="profileBuffer().socials.linkedin" placeholder="LinkedIn URL" />
            </div>
            <div class="field">
              <label>GitHub</label>
              <input [(ngModel)]="profileBuffer().socials.github" placeholder="GitHub URL" />
            </div>
            <div class="field">
              <label>Email Directo</label>
              <input [(ngModel)]="profileBuffer().socials.email" placeholder="email@ejemplo.com" />
            </div>
          </div>
        </div>

        <button class="primary-btn save-btn" (click)="saveContact()">Guardar Cambios</button>
      </div>
      }

      <!-- Custom Confirm Dialog -->
      @if (type === 'confirm') {

      <div class="confirm-modal">
        @let c = modal.confirmData(); @if (c) {
        <p class="confirm-message">{{ c.message }}</p>
        <div class="confirm-actions">
          <button class="secondary-btn" (click)="modal.close()">
            {{ c.cancelText || 'CANCEL' }}
          </button>
          <button class="primary-btn danger-btn" (click)="c.onConfirm(); modal.close()">
            {{ c.confirmText || 'EXECUTE' }}
          </button>
        </div>
        }
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
        gap: 20px;
        max-height: 500px;
        overflow-y: auto;
        padding-right: 10px;
      }

      .skill-group-section {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 15px;

        label {
          font-size: 10px;
          text-transform: uppercase;
          color: #58a6ff;
          letter-spacing: 1px;
          margin-bottom: 8px;
          display: block;
        }
      }

      .header-inputs {
        display: flex;
        gap: 10px;
        input {
          flex: 1;
          font-weight: bold;
          font-size: 14px;
        }
      }

      .skill-pills-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 15px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
      }

      .skill-pill-edit {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #1e1e1e;
        border: 1px solid #333;
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 11px;
        color: #c9d1d9;
        transition: all 0.2s;

        i {
          font-size: 14px;
        }

        button {
          background: none;
          border: none;
          color: #f85149;
          cursor: pointer;
          font-size: 16px;
          padding: 0;
          line-height: 1;
          &:hover {
            color: #ff7b72;
          }
        }

        &:hover {
          border-color: #58a6ff;
          background: rgba(88, 166, 255, 0.05);
        }
      }

      .add-item-row {
        display: flex;
        gap: 8px;
        input {
          flex: 1;
          background: #0d1117;
        }
      }

      .action-btn-blue {
        padding: 0 15px;
        background: #238636;
        color: white;
        border-radius: 6px;
        font-size: 10px;
        font-weight: bold;
        &:hover {
          background: #2ea043;
        }
      }

      .small-btn {
        padding: 0 10px;
        height: 32px;
        font-size: 10px;
        border-radius: 4px;
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

      .title-extra {
        width: 140px;
        margin-right: 10px;
        input {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #58a6ff;
        }
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

      .avatar-edit-layout {
        display: flex;
        gap: 20px;
        align-items: center;
        background: rgba(255, 255, 255, 0.02);
        padding: 15px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.03);
      }

      .avatar-preview-box {
        position: relative;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        padding: 4px;
        border: 2px solid #007acc;
        flex-shrink: 0;

        .preview-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .preview-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #1e1e1e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #007acc;
          font-weight: bold;
        }

        .status-dot {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 12px;
          height: 12px;
          background: #3fb950;
          border: 2px solid #1e1e1e;
          border-radius: 50%;
        }
      }

      .avatar-upload-field {
        flex: 1;
      }

      .upload-controls {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-top: 5px;
        .upload-btn {
          flex: 1;
          font-size: 11px;
          padding: 8px;
          text-transform: uppercase;
        }
        .icon-danger-btn.small {
          padding: 8px;
          font-size: 10px;
          color: #ff5555;
        }
      }

      .confirm-modal {
        text-align: center;
        padding: 20px 10px;
        .confirm-message {
          font-size: 14px;
          color: #8b949e;
          margin-bottom: 25px;
          line-height: 1.6;
        }
        .confirm-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          button {
            padding: 10px 20px;
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
        }
      }

      .danger-btn {
        background: #da3633 !important;
        color: white;
        border-color: #f85149 !important;
        &:hover {
          background: #f85149 !important;
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

      .socials-grid,
      .education-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .modal-section {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;

        h4 {
          margin: 0 0 5px 0;
          font-size: 13px;
          color: #007acc;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          display: flex;
          align-items: center;
          gap: 10px;

          .ln {
            color: rgba(255, 255, 255, 0.15);
            font-family: var(--font-mono);
          }
        }
      }

      .field-stack {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }

      .input-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }

      .hint.small {
        font-size: 10px;
        color: #666;
        margin-top: 4px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .modal-scrollable {
        max-height: 75vh;
        overflow-y: auto;
        padding-right: 15px;
        display: flex;
        flex-direction: column;
        gap: 0;

        &::-webkit-scrollbar {
          width: 5px;
        }
        &::-webkit-scrollbar-thumb {
          background: rgba(0, 122, 204, 0.4);
          border-radius: 10px;
        }
      }

      .save-btn {
        margin-top: 20px;
        position: sticky;
        bottom: 0;
        z-index: 10;
        box-shadow: 0 -15px 30px rgba(0, 0, 0, 0.8);
      }
      .image-upload-zone {
        grid-column: span 2;
        background: rgba(255, 255, 255, 0.03);
        padding: 10px;
        border-radius: 4px;
        border: 1px dashed rgba(255, 255, 255, 0.1);
      }

      .upload-controls {
        display: flex;
        gap: 15px;
        align-items: center;
        margin-top: 5px;
      }

      .project-preview-box,
      .project-preview-placeholder {
        width: 120px;
        height: 70px;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
        flex-shrink: 0;
      }

      .project-preview-placeholder {
        font-family: var(--font-mono);
        font-size: 10px;
        color: rgba(255, 255, 255, 0.3);
      }

      .project-preview-box img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .upload-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex-grow: 1;
      }

      .url-hint {
        font-size: 11px !important;
        opacity: 0.6;
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
  private toast = inject(ToastService);

  loginEmail = '';
  loginPass = '';
  isUploadingAvatar = signal(false);
  uploadingProjects = signal<Map<string, boolean>>(new Map());

  // Local buffer for profile
  profileBuffer = signal<Profile>({
    name: '',
    role: '',
    status: 'Open to Work',
    location: '',
    timezone: 'GMT-3',
    availability: 'Remote / Full-time',
    bio: '',
    education: {
      degree: '',
      university: '',
    },
    avatarUrl: '',
    certifications: [],
    languages: [],
    softSkills: [],
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
        // Asegurar que education y socials siempre tengan objetos base para el binding
        const safeProfile: Profile = {
          ...p,
          education: p.education || { degree: '', university: '' },
          socials: p.socials || { github: '', linkedin: '', twitter: '', email: '' },
          languages: p.languages || [],
          softSkills: p.softSkills || [],
        };
        this.profileBuffer.set(safeProfile);
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
      'edit-home': 'Identidad del Sistema (Home)',
      'edit-skills': 'Gestionar Habilidades',
      'edit-projects': 'Administrar Proyectos',
      'edit-contact': 'Configurar Sección de Contacto',
      confirm: 'Confirmar Acción',
    };
    return titles[type] || 'Dialog';
  }

  async doLogin() {
    try {
      await this.auth.login(this.loginEmail, this.loginPass);
      this.toast.show('Bienvenido, Facundo', 'success');
      this.terminal.log(`> Login successful for: ${this.loginEmail}`, 'success');
      this.modal.close();
    } catch (e) {
      this.toast.show('Credenciales inválidas', 'error');
      this.terminal.log(`> Login failed: Invalid credentials`, 'error');
    }
  }

  async saveProfile(p: any) {
    if (!p) return;
    if (!p.name?.trim()) {
      this.toast.show('El nombre es obligatorio', 'error');
      this.terminal.log(`> [VALIDACIÓN] El nombre es obligatorio`, 'error');
      return;
    }
    try {
      await this.dataService.save('about', 'profile', p);
      this.toast.show('Perfil actualizado', 'success');
      this.terminal.log(`> [COMPILADO] Información de perfil actualizada en Firestore`, 'success');
      this.modal.close();
    } catch (e: any) {
      this.toast.show('Error al guardar perfil', 'error');
      this.terminal.log(`> [ERROR] Error al guardar perfil: ${e.message || e}`, 'error');
    }
  }

  async saveContact() {
    if (!this.contactBuffer().title?.trim()) {
      this.toast.show('El título es obligatorio', 'error');
      this.terminal.log(`> [VALIDACIÓN] El título de contacto es obligatorio`, 'error');
      return;
    }
    try {
      // Guardar textos de contacto
      await this.dataService.save('about', 'contact', this.contactBuffer());

      // También guardar los socials del perfil buffer si estamos en este modo
      await this.dataService.save('about', 'profile', this.profileBuffer());

      this.toast.show('Información de contacto actualizada', 'success');
      this.terminal.log(`> [SYNC] Textos y redes sociales actualizadas`, 'success');
      this.modal.close();
    } catch (e: any) {
      this.toast.show('Error al guardar cambios', 'error');
      this.terminal.log(`> [ERROR] Error al guardar contacto/redes: ${e.message || e}`, 'error');
    }
  }

  async saveSkillGroup(group: any) {
    if (!group || !group.id) return;
    try {
      await this.dataService.update('skills', group.id, group);
      this.toast.show(`Categoría "${group.category}" sincronizada`, 'success');
      this.terminal.log(`> [SYNC] Categoría "${group.category}" sincronizada`, 'info');
    } catch (e) {
      this.toast.show('Error al sincronizar skills', 'error');
      this.terminal.log(`> [ERROR] Error al sincronizar skills`, 'error');
    }
  }

  addItemToGroup(group: any, value: string) {
    if (!value.trim()) return;
    group.items = [...group.items, value.trim()];
    this.toast.show(`Skill "${value}" agregado localmente`, 'info');
  }

  removeItemFromGroup(group: any, index: number) {
    const removedItem = group.items[index];
    group.items = group.items.filter((_: any, i: number) => i !== index);
    this.toast.show(`Removed "${removedItem}"`, 'info');
  }

  deleteSkillGroup(id: string) {
    this.modal.confirm({
      title: 'Eliminar Categoría',
      message:
        '¿Estás seguro de que deseas eliminar esta categoría de habilidades? Se perderán todos los datos contenidos.',
      confirmText: 'SÍ, ELIMINAR',
      onConfirm: async () => {
        try {
          await this.dataService.delete('skills', id);
          this.toast.show('Categoría eliminada', 'info');
          this.terminal.log(`> [FS] Categoría eliminada: ${id}`, 'success');
        } catch (e: any) {
          this.toast.show('Error al eliminar', 'error');
          this.terminal.log(`> [ERROR] Error al eliminar categoría: ${e.message}`, 'error');
        }
      },
    });
  }

  async saveProject(p: any) {
    if (!p || !p.id) return;
    try {
      await this.dataService.update('projects', p.id, p);
      this.toast.show(`Proyecto "${p.title}" actualizado`, 'success');
      this.terminal.log(`> [DEPLOY] Proyecto "${p.title}" actualizado con éxito`, 'success');
    } catch (e) {
      this.toast.show('Error al actualizar proyecto', 'error');
      this.terminal.log(`> [ERROR] Error al actualizar proyecto`, 'error');
    }
  }

  updateProjectTags(p: any, value: string) {
    p.tags = value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => !!t);
  }

  deleteProject(id: string) {
    this.modal.confirm({
      title: 'Destruir Registro',
      message: '¿Estás seguro de eliminar este proyecto del sistema? Esta acción es irreversible.',
      confirmText: 'DESTRUIR PROYECTO',
      onConfirm: async () => {
        try {
          await this.dataService.delete('projects', id);
          this.toast.show('Proyecto eliminado', 'info');
          this.terminal.log(`> [FS] Proyecto eliminado: ${id}`, 'success');
        } catch (e) {
          this.toast.show('Error al eliminar', 'error');
          this.terminal.log(`> [ERROR] Error al eliminar proyecto`, 'error');
        }
      },
    });
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
      role: 'Fullstack Developer',
      host: 'Vercel',
      exeName: `project_${Date.now().toString().substring(0, 5)}.exe`,
    };
    const id = Date.now().toString();
    try {
      await this.dataService.save('projects', id, newP);
      this.toast.show('Proyecto creado', 'success');
      this.terminal.log(`> [FS] Creado nuevo registro de proyecto: ${id}`, 'success');
    } catch (e) {
      this.toast.show('Error al crear proyecto', 'error');
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
      this.toast.show('Nueva categoría creada', 'success');
      this.terminal.log(`> [FS] Nueva sección de habilidades creada: ${id}`, 'success');
    } catch (e) {
      this.toast.show('Error al crear categoría', 'error');
      this.terminal.log(`> [ERROR] Error al crear categoría`, 'error');
    }
  }

  formatLanguages(langs?: { name: string; level: string }[]): string {
    if (!langs) return '';
    return langs.map((l) => `${l.name}:${l.level}`).join('\n');
  }

  updateLanguages(value: string) {
    const lines = value.split('\n').filter((l) => l.includes(':'));
    this.profileBuffer.update((p) => ({
      ...p,
      languages: lines.map((line) => {
        const [name, level] = line.split(':');
        return { name: name.trim(), level: level.trim() };
      }),
    }));
  }

  updateSoftSkills(value: string) {
    const skills = value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => !!s);
    this.profileBuffer.update((p) => ({
      ...p,
      softSkills: skills,
    }));
  }

  updateCertifications(value: string) {
    const certs = value
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => !!c);
    this.profileBuffer.update((p) => ({
      ...p,
      certifications: certs,
    }));
  }

  async handleProjectImageUpload(event: Event, project: Project) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !project.id) return;

    try {
      this.uploadingProjects.update((map) => {
        const newMap = new Map(map);
        newMap.set(project.id!, true);
        return newMap;
      });

      this.terminal.log(`Starting secure upload for project: ${project.title}...`, 'info');

      const path = `projects/${project.id}/${file.name}`;
      const url = await this.dataService.uploadFile(path, file);

      project.imageUrl = url;
      this.toast.show('Project image uploaded successfully', 'success');
      this.terminal.log('Project asset synchronized with Storage.', 'success');
    } catch (error) {
      console.error('Project image upload error:', error);
      this.toast.show('Failed to upload project image', 'error');
      this.terminal.log('Project upload aborted due to network error.', 'error');
    } finally {
      this.uploadingProjects.update((map) => {
        const newMap = new Map(map);
        newMap.delete(project.id!);
        return newMap;
      });
    }
  }

  async handleAvatarUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.isUploadingAvatar.set(true);
    this.terminal.log(`> [STORAGE] Iniciando subida de avatar: ${file.name}...`, 'info');

    try {
      const path = `profiles/avatar_${Date.now()}_${file.name}`;
      const url = await this.dataService.uploadFile(path, file);

      this.profileBuffer.update((p) => ({ ...p, avatarUrl: url }));
      this.terminal.log(`> [STORAGE] Avatar subido correctamente.`, 'success');
    } catch (e: any) {
      this.terminal.log(`> [ERROR] Fallo al subir imagen: ${e.message || e}`, 'error');
    } finally {
      this.isUploadingAvatar.set(false);
      input.value = ''; // Reset input
    }
  }

  getIconClass(name: string): string {
    const n = name.toLowerCase();
    const base = 'colored ';
    if (n.includes('angular')) return base + 'devicon-angularjs-plain';
    if (n.includes('react')) return base + 'devicon-react-original';
    if (n.includes('typescript')) return base + 'devicon-typescript-plain';
    if (n.includes('javascript')) return base + 'devicon-javascript-plain';
    if (n.includes('firebase')) return base + 'devicon-firebase-plain';
    if (n.includes('node')) return base + 'devicon-nodejs-plain';
    if (n.includes('css')) return base + 'devicon-css3-plain';
    if (n.includes('html')) return base + 'devicon-html5-plain';
    if (n.includes('sass') || n.includes('scss')) return base + 'devicon-sass-original';
    if (n.includes('git')) return base + 'devicon-git-plain';
    if (n.includes('docker')) return base + 'devicon-docker-plain';
    if (n.includes('python')) return base + 'devicon-python-plain';
    if (n.includes('java') && !n.includes('script')) return base + 'devicon-java-plain';
    if (n.includes('c#')) return base + 'devicon-csharp-plain';
    if (n.includes('linux')) return base + 'devicon-linux-plain';
    if (n.includes('tailwind')) return base + 'devicon-tailwindcss-original';
    if (n.includes('figma')) return base + 'devicon-figma-plain';
    if (n.includes('photoshop')) return base + 'devicon-photoshop-plain';
    if (n.includes('mongo')) return base + 'devicon-mongodb-plain';
    if (n.includes('sql')) return base + 'devicon-sqlite-plain';
    if (n.includes('unity')) return base + 'devicon-unity-original';
    return base + 'devicon-code-plain';
  }
}
