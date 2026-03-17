import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <span class="footer-logo">&lt;Mickael /&gt;</span>
          <p class="footer-copy">© {{ year }} Mickael. Fait avec ☕ et Java.</p>
          <a href="#hero" class="back-top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            Retour en haut
          </a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      padding: 32px 0;
      border-top: 1px solid var(--border);
      background: var(--bg-secondary);
    }
    .footer-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .footer-logo {
      font-family: 'Fira Code', monospace;
      font-weight: 700;
      color: var(--accent);
      font-size: 1rem;
    }
    .footer-copy {
      font-size: 0.825rem;
      color: var(--text-muted);
    }
    .back-top {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--text-muted);
      padding: 8px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      transition: all 0.2s ease;
      &:hover { color: var(--accent); border-color: var(--accent); background: var(--accent-bg); }
    }
    @media (max-width: 600px) {
      .footer-content { justify-content: center; text-align: center; }
    }
  `],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
