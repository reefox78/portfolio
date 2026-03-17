import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
  `,
})
export class App implements OnInit {
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
