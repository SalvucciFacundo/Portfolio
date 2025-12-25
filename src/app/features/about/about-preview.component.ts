import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TerminalService } from '../../core/services/terminal.service';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-preview',
  imports: [CommonModule],
  template: `
    @if (state.profile(); as p) {
    <div class="dashboard-container">
      <!-- Left Sidebar: Profile Card -->
      <aside class="identity-sidebar">
        <div class="avatar-wrapper">
          @if (p.avatarUrl) {
          <img [src]="p.avatarUrl" [alt]="p.name" class="avatar-img" />
          } @else {
          <div class="avatar-placeholder">{{ p.name.substring(0, 2).toUpperCase() }}</div>
          }
          <div class="status-indicator" title="Open to Work"></div>
        </div>

        <div class="identity-meta">
          <h3>{{ p.name }}</h3>
          <p class="role-badge">{{ p.role }}</p>

          <div class="status-label">
            <span class="badge pulse-badge">OPEN TO WORK</span>
          </div>

          <div class="meta-info">
            <div class="info-row">
              <span class="icon">📍</span>
              <span>{{ p.location }} ({{ p.timezone || 'GMT-3' }})</span>
            </div>
            <div class="info-row">
              <span class="icon">💼</span>
              <span>{{ p.availability || 'Remote / Full-time' }}</span>
            </div>
          </div>
        </div>

        <div class="social-actions">
          @if (p.socials.github) {
          <a [href]="p.socials.github" target="_blank" class="action-btn github">
            <span class="btn-text">GITHUB</span>
          </a>
          } @if (p.socials.linkedin) {
          <a [href]="p.socials.linkedin" target="_blank" class="action-btn linkedin">
            <span class="btn-text">LINKEDIN</span>
          </a>
          }
        </div>
      </aside>

      <!-- Main Panel: Info Documentation -->
      <section class="doc-main">
        <div class="doc-body">
          <div class="readme-section">
            <h1 class="readme-title"># User Profile</h1>
            <p class="bio-text">{{ p.bio }}</p>
          </div>

          @if (p.education) {
          <div class="readme-section">
            <h2 class="readme-subtitle">## Education</h2>
            <div class="timeline-item">
              <div class="time-marker"></div>
              <div class="time-content">
                <strong>{{ p.education.degree }}</strong>
                <p>{{ p.education.university }}</p>
              </div>
            </div>
          </div>
          } @if (p.certifications && p.certifications.length) {
          <div class="readme-section">
            <h2 class="readme-subtitle">## Certifications & Courses</h2>
            <div class="cert-grid">
              @for (cert of p.certifications; track cert) {
              <div class="cert-item">
                <span class="cert-icon">📜</span>
                <span class="cert-name">{{ cert }}</span>
              </div>
              }
            </div>
          </div>
          }

          <div class="grid-sections">
            @if (p.languages && p.languages.length) {
            <div class="readme-section">
              <h2 class="readme-subtitle">## Languages</h2>
              <ul class="lang-list">
                @for (lang of p.languages; track lang.name) {
                <li>
                  <span class="lang-name">{{ lang.name }}:</span>
                  <span class="lang-level">{{ lang.level }}</span>
                </li>
                }
              </ul>
            </div>
            } @if (p.softSkills && p.softSkills.length) {
            <div class="readme-section">
              <h2 class="readme-subtitle">## Soft Skills</h2>
              <div class="badge-cloud">
                @for (skill of p.softSkills; track skill) {
                <span class="skill-badge">{{ skill }}</span>
                }
              </div>
            </div>
            }
          </div>
        </div>
      </section>
    </div>
    } @else {
    <div class="loading-dashboard">
      <div class="scanning-line"></div>
      <p>FETCHING DATA...</p>
    </div>
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center; /* Back to center but with less top padding to stay high */
        justify-content: center;
        width: 100%;
        min-height: 100%;
        padding: 20px;
        box-sizing: border-box;
      }

      .dashboard-container {
        display: flex;
        background: rgba(13, 17, 23, 0.85);
        backdrop-filter: blur(25px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        width: 100%;
        max-width: 1200px; /* Even wider to show power */
        min-height: 500px;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
        position: relative;
        margin: 20px 0;
      }

      /* Sidebar Styles */
      .identity-sidebar {
        width: 280px;
        background: rgba(22, 27, 34, 0.6);
        border-right: 1px solid rgba(255, 255, 255, 0.05);
        padding: 35px 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        flex-shrink: 0;
      }

      .avatar-wrapper {
        position: relative;
        margin-bottom: 15px;
        padding: 6px;
        border: 2px solid rgba(56, 139, 253, 0.4);
        border-radius: 50%;
      }

      .avatar-img,
      .avatar-placeholder {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        background: #0d1117;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        color: #58a6ff;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .status-indicator {
        position: absolute;
        bottom: 8px;
        right: 8px;
        width: 16px;
        height: 16px;
        background: #3fb950;
        border: 3px solid #161b22;
        border-radius: 50%;
      }

      .identity-meta h3 {
        color: white;
        margin: 5px 0 8px;
        font-size: 22px;
        font-weight: 700;
      }

      .role-badge {
        font-size: 11px;
        color: #58a6ff;
        background: rgba(56, 139, 253, 0.15);
        padding: 4px 12px;
        border-radius: 6px;
        margin-bottom: 12px;
        font-weight: 700;
        text-transform: uppercase;
        display: inline-block;
      }

      .status-label {
        margin-bottom: 15px;
      }

      .pulse-badge {
        font-size: 10px;
        font-weight: 800;
        background: #238636;
        color: rgba(255, 255, 255, 0.9);
        padding: 4px 12px;
        border-radius: 4px;
        display: inline-block;
      }

      .meta-info {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        text-align: left;
        background: rgba(255, 255, 255, 0.03);
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px;
      }

      .info-row {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        color: #c9d1d9;
      }

      .social-actions {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 10px; /* Instead of margin-top: auto */
      }

      .action-btn {
        width: 100%;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #30363d;
        background: #21262d;
        color: #c9d1d9;
        font-size: 11px;
        font-weight: 600;
        text-decoration: none;
        text-align: center;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          background: #30363d;
          border-color: #8b949e;
          transform: translateY(-2px);
          color: white;
        }
      }

      /* Main Content Styles */
      .doc-main {
        flex: 1;
        padding: 50px;
        overflow-y: visible; /* Avoid internal scroll */
      }

      .readme-title {
        font-size: 32px;
        color: white;
        margin: 0 0 25px;
        padding-bottom: 12px;
        border-bottom: 1px solid #30363d;
        font-weight: 800;
      }

      .bio-text {
        font-size: 14px;
        color: #c9d1d9;
        margin-bottom: 30px;
      }

      .readme-subtitle {
        font-size: 18px;
        color: white;
        margin: 25px 0 15px;
      }

      .timeline-item {
        padding-left: 20px;
        border-left: 2px solid #30363d;
        position: relative;
      }

      .time-marker {
        position: absolute;
        left: -6px;
        top: 0;
        width: 10px;
        height: 10px;
        background: #58a6ff;
        border-radius: 50%;
      }

      .time-content strong {
        color: white;
        font-size: 14px;
        display: block;
      }

      .time-content p {
        color: #8b949e;
        font-size: 13px;
        margin: 4px 0 0;
      }

      .grid-sections {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin-top: 20px;
      }

      .lang-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .lang-list li {
        font-size: 13px;
        margin-bottom: 8px;
      }

      .lang-name {
        color: #8b949e;
        margin-right: 5px;
      }
      .lang-level {
        color: white;
        font-weight: 500;
        font-family: monospace;
      }

      .badge-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .skill-badge {
        background: rgba(56, 139, 253, 0.15);
        color: #58a6ff;
        font-size: 11px;
        padding: 4px 10px;
        border-radius: 4px;
        border: 1px solid rgba(56, 139, 253, 0.2);
      }

      .cert-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 12px;
      }

      .cert-item {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        padding: 10px 12px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        color: #c9d1d9;

        .cert-icon {
          opacity: 0.6;
        }
      }

      .loading-dashboard {
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #58a6ff;
        font-family: monospace;
      }

      @media (max-width: 800px) {
        .dashboard-container {
          flex-direction: column;
          max-height: none;
        }
        .identity-sidebar {
          width: 100%;
          border-right: none;
          border-bottom: 1px solid #30363d;
        }
        .grid-sections {
          grid-template-columns: 1fr;
          gap: 10px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AboutPreviewComponent {
  protected state = inject(PortfolioStateService);
}
