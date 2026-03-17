import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class SkillsComponent implements OnInit {
  private portfolio = inject(PortfolioService);
  skillsByCategory = signal<Record<string, any[]>>({});
  categories = signal<string[]>([]);

  ngOnInit() {
    this.portfolio.getSkills().subscribe(skills => {
      const grouped: Record<string, any[]> = {};
      skills.sort((a, b) => a.order - b.order).forEach(s => {
        if (!grouped[s.category]) grouped[s.category] = [];
        grouped[s.category].push(s);
      });
      this.skillsByCategory.set(grouped);
      this.categories.set(Object.keys(grouped));
    });
  }

  levelLabel(level: number): string {
    const labels = ['', 'Débutant', 'Basique', 'Intermédiaire', 'Avancé', 'Expert'];
    return labels[level] ?? '';
  }

  levelWidth(level: number): string {
    return `${(level / 5) * 100}%`;
  }
}
