import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent implements OnInit {
  private portfolio = inject(PortfolioService);
  projects = signal<any[]>([]);
  showAll = signal(false);

  get displayed() {
    const all = this.projects();
    return this.showAll() ? all : all.slice(0, 6);
  }

  ngOnInit() {
    this.portfolio.getProjects().subscribe(data => {
      this.projects.set(data.sort((a, b) => a.order - b.order));
    });
  }
}
