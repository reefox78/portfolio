import { Component, OnInit, HostListener, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav';
import { HeroComponent } from './components/hero/hero';
import { SkillsComponent } from './components/skills/skills';
import { ProjectsComponent } from './components/projects/projects';
import { ExperienceComponent } from './components/experience/experience';
import { EducationComponent } from './components/education/education';
import { ContactComponent } from './components/contact/contact';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NavComponent,
    HeroComponent,
    SkillsComponent,
    ProjectsComponent,
    ExperienceComponent,
    EducationComponent,
    ContactComponent,
    FooterComponent,
  ],
  template: `
    <app-nav />
    <main>
      <app-hero />
      <app-skills />
      <app-projects />
      <app-experience />
      <app-education />
      <app-contact />
    </main>
    <app-footer />

    <button
      class="scroll-top"
      [class.visible]="showScrollTop()"
      (click)="scrollToTop()"
      title="Retour en haut"
      aria-label="Retour en haut">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  `,
  styles: [`
    .scroll-top {
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--accent);
      color: #fff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(248, 152, 32, 0.4);
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: none;
      z-index: 999;
    }
    .scroll-top.visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    .scroll-top:hover {
      background: var(--accent-dark);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(248, 152, 32, 0.5);
    }
    @media (max-width: 600px) {
      .scroll-top { bottom: 20px; right: 20px; }
    }
  `],
})
export class App implements OnInit {
  showScrollTop = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.showScrollTop.set(window.scrollY > 400);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    this.initScrollObserver();
  }

  private initScrollObserver() {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 100);
  }
}
