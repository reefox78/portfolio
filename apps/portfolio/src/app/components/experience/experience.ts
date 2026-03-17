import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class ExperienceComponent implements OnInit {
  private portfolio = inject(PortfolioService);
  experiences = signal<any[]>([]);
  expanded = signal<Set<number>>(new Set());

  private readonly months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  ngOnInit() {
    this.portfolio.getExperiences().subscribe(data => {
      this.experiences.set(data.sort((a, b) => a.order - b.order));
    });
  }

  formatDate(month: number | null, year: number | null): string {
    if (!month || !year) return 'Aujourd\'hui';
    return `${this.months[month - 1]} ${year}`;
  }

  toggle(id: number) {
    const s = new Set(this.expanded());
    if (s.has(id)) s.delete(id); else s.add(id);
    this.expanded.set(s);
  }

  isExpanded(id: number): boolean {
    return this.expanded().has(id);
  }
}
