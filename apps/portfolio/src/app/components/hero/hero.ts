import { Component, OnInit, OnDestroy, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent implements OnInit, OnDestroy {
  readonly roles = ['Développeur Java', 'Backend Developer', 'Spring Boot Expert', 'API REST Designer'];
  currentRole = signal('');
  private roleIndex = 0;
  private charIndex = 0;
  private deleting = false;
  private timer: any;

  ngOnInit() {
    this.type();
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  private type() {
    const role = this.roles[this.roleIndex];

    if (!this.deleting) {
      this.currentRole.set(role.substring(0, this.charIndex + 1));
      this.charIndex++;
      if (this.charIndex === role.length) {
        this.deleting = true;
        this.timer = setTimeout(() => this.type(), 2000);
        return;
      }
    } else {
      this.currentRole.set(role.substring(0, this.charIndex - 1));
      this.charIndex--;
      if (this.charIndex === 0) {
        this.deleting = false;
        this.roleIndex = (this.roleIndex + 1) % this.roles.length;
      }
    }

    this.timer = setTimeout(() => this.type(), this.deleting ? 60 : 100);
  }
}
