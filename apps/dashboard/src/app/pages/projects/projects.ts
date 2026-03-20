import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatChipsModule,
    MatCardModule, MatSnackBarModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  projects = signal<any[]>([]);
  displayedColumns = ['title', 'stack', 'featured', 'actions'];
  editingId: number | null = null;
  showForm = false;

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    imageUrl: [''],
    repoUrl: [''],
    liveUrl: [''],
    stackInput: [''],
    stack: [[] as string[]],
    featured: [false],
    order: [0],
  });

  ngOnInit() { this.load(); }
  load() { this.api.getProjects().subscribe(data => setTimeout(() => this.projects.set(data))); }

  openCreate() { this.editingId = null; this.form.reset({ stack: [], featured: false, order: 0 }); this.showForm = true; }
  openEdit(p: any) { this.editingId = p.id; this.form.patchValue({ ...p, stackInput: '' }); this.showForm = true; }

  addChip() {
    const val = this.form.value.stackInput?.trim();
    if (!val) return;
    this.form.patchValue({ stack: [...(this.form.value.stack || []), val], stackInput: '' });
  }
  removeChip(chip: string) {
    this.form.patchValue({ stack: (this.form.value.stack || []).filter((s: string) => s !== chip) });
  }

  imgError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }

  save() {
    if (this.form.invalid) return;
    const { stackInput, ...data } = this.form.value;
    const obs = this.editingId ? this.api.updateProject(this.editingId, data) : this.api.createProject(data);
    obs.subscribe({ next: () => setTimeout(() => { this.load(); this.showForm = false; this.snack.open('Sauvegardé', '', { duration: 2000 }); }) });
  }

  delete(id: number) {
    this.dialog.open(ConfirmDialogComponent, { data: { message: 'Supprimer ce projet ?' } })
      .afterClosed().subscribe(ok => { if (ok) this.api.deleteProject(id).subscribe(() => this.load()); });
  }
}
