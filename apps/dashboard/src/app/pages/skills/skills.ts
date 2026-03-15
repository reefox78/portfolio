import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-skills',
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, MatSnackBarModule],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  skills = signal<any[]>([]);
  displayedColumns = ['name', 'category', 'level', 'actions'];
  editingId: number | null = null;
  showForm = false;

  form = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    level: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    order: [0],
  });

  ngOnInit() { this.load(); }
  load() { this.api.getSkills().subscribe(data => setTimeout(() => this.skills.set(data))); }

  openCreate() { this.editingId = null; this.form.reset({ level: 3, order: 0 }); this.showForm = true; }
  openEdit(s: any) { this.editingId = s.id; this.form.patchValue(s); this.showForm = true; }

  save() {
    if (this.form.invalid) return;
    const obs = this.editingId ? this.api.updateSkill(this.editingId, this.form.value) : this.api.createSkill(this.form.value);
    obs.subscribe({ next: () => setTimeout(() => { this.load(); this.showForm = false; this.snack.open('Sauvegardé', '', { duration: 2000 }); }) });
  }

  delete(id: number) {
    this.dialog.open(ConfirmDialogComponent, { data: { message: 'Supprimer cette skill ?' } })
      .afterClosed().subscribe(ok => { if (ok) this.api.deleteSkill(id).subscribe(() => this.load()); });
  }

  stars(level: number): string { return '★'.repeat(level) + '☆'.repeat(5 - level); }
}
