import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
@Component({
  selector: 'app-home-preview',
  template: `
    <div class="home-hero">
      <div class="glass-card">
        <div class="welcome-badge">Available for projects</div>
        <h1>Facundo Salvucci</h1>
        <p class="subtitle">Full Stack Developer & Angular Architect</p>

        <div class="cta-group">
          <button class="primary-btn" (click)="scrollTo('about')">Explore Profile</button>
          <button class="secondary-btn" (click)="scrollTo('projects')">View Projects</button>
        </div>

        <div class="tech-rings">
          <div class="ring angular"><span>A</span></div>
          <div class="ring ts"><span>TS</span></div>
          <div class="ring firebase"><span>🔥</span></div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .home-hero {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle at top right, rgba(0, 122, 204, 0.1), transparent),
          radial-gradient(circle at bottom left, rgba(142, 36, 170, 0.1), transparent);
        padding: 20px;
      }

      .glass-card {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 40px;
        padding: 60px;
        text-align: center;
        max-width: 600px;
        width: 100%;
        box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
      }

      .welcome-badge {
        display: inline-block;
        padding: 6px 16px;
        background: rgba(0, 122, 204, 0.1);
        color: #74b9ff;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 24px;
        border: 1px solid rgba(0, 122, 204, 0.2);
      }

      h1 {
        font-size: clamp(2.5rem, 5vw, 4rem);
        margin: 0;
        background: linear-gradient(135deg, #fff 0%, #aaa 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -2px;
      }

      .subtitle {
        font-size: 1.25rem;
        color: rgba(255, 255, 255, 0.6);
        margin: 16px 0 32px;
      }

      .cta-group {
        display: flex;
        gap: 16px;
        justify-content: center;
        margin-bottom: 40px;
      }

      button {
        padding: 14px 28px;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 15px;
      }

      .primary-btn {
        background: #fff;
        color: #000;
        border: none;
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
        }
      }

      .secondary-btn {
        background: transparent;
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.1);
        &:hover {
          background: rgba(255, 255, 255, 0.05);
        }
      }

      .tech-rings {
        display: flex;
        justify-content: center;
        gap: 24px;
        margin-top: 20px;
      }

      .ring {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.02);
        color: rgba(255, 255, 255, 0.4);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePreviewComponent {
  private nav = inject(NavigationService);

  scrollTo(section: string) {
    this.nav.requestScroll(section);
  }
}
