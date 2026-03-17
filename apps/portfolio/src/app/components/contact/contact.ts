import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent {
  private portfolio = inject(PortfolioService);

  form = signal({ name: '', email: '', subject: '', message: '', _gotcha: '' });
  status = signal<'idle' | 'sending' | 'success' | 'error'>('idle');

  update(field: string, value: string) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  submit() {
    const f = this.form();
    if (!f.name || !f.email || !f.message) return;

    this.status.set('sending');
    this.portfolio.sendMessage(f).subscribe({
      next: () => {
        this.status.set('success');
        this.form.set({ name: '', email: '', subject: '', message: '', _gotcha: '' });
        setTimeout(() => this.status.set('idle'), 4000);
      },
      error: () => {
        this.status.set('error');
        setTimeout(() => this.status.set('idle'), 4000);
      },
    });
  }
}
