import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './education.html',
  styleUrl: './education.scss',
})
export class EducationComponent implements OnInit {
  private portfolio = inject(PortfolioService);
  educations = signal<any[]>([]);

  ngOnInit() {
    this.portfolio.getEducations().subscribe(data => {
      this.educations.set(data.sort((a, b) => a.order - b.order));
    });
  }
}
