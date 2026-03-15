import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-experiences',
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatCardModule, MatSnackBarModule],
  templateUrl: './experiences.html',
  styleUrl: './experiences.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperiencesComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  experiences = signal<any[]>([]);
  displayedColumns = ['jobTitle', 'company', 'period', 'actions'];
  editingId: number | null = null;
  showForm = false;

  form = this.fb.group({
    jobTitle: ['', Validators.required],
    company: ['', Validators.required],
    location: ['', Validators.required],
    startMonth: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
    startYear: [new Date().getFullYear(), Validators.required],
    endMonth: [null as number | null],
    endYear: [null as number | null],
    skillInput: [''],
    skills: [[] as string[]],
    order: [0],
    projects: this.fb.array([]),
  });

  get projectsArray(): FormArray { return this.form.get('projects') as FormArray; }

  ngOnInit() { this.load(); }
  load() { this.api.getExperiences().subscribe(data => setTimeout(() => this.experiences.set(data))); }

  addProject() {
    this.projectsArray.push(this.fb.group({ name: ['', Validators.required], description: ['', Validators.required], order: [0] }));
  }
  removeProject(i: number) { this.projectsArray.removeAt(i); }

  openCreate() {
    this.editingId = null;
    this.projectsArray.clear();
    this.form.reset({ skills: [], startMonth: 1, startYear: new Date().getFullYear(), order: 0 });
    this.showForm = true;
  }

  openEdit(exp: any) {
    this.editingId = exp.id;
    this.projectsArray.clear();
    exp.projects?.forEach((p: any) => this.projectsArray.push(this.fb.group({ name: [p.name, Validators.required], description: [p.description, Validators.required], order: [p.order] })));
    this.form.patchValue({ ...exp, skillInput: '' });
    this.showForm = true;
  }

  addChip() {
    const val = this.form.value.skillInput?.trim();
    if (!val) return;
    this.form.patchValue({ skills: [...(this.form.value.skills || []), val], skillInput: '' });
  }
  removeChip(chip: string) {
    this.form.patchValue({ skills: (this.form.value.skills || []).filter((s: string) => s !== chip) });
  }

  save() {
    if (this.form.invalid) return;
    const { skillInput, ...data } = this.form.value;
    const obs = this.editingId ? this.api.updateExperience(this.editingId, data) : this.api.createExperience(data);
    obs.subscribe({ next: () => setTimeout(() => { this.load(); this.showForm = false; this.snack.open('Sauvegardé', '', { duration: 2000 }); }) });
  }

  delete(id: number) {
    this.dialog.open(ConfirmDialogComponent, { data: { message: 'Supprimer cette expérience ?' } })
      .afterClosed().subscribe(ok => { if (ok) this.api.deleteExperience(id).subscribe(() => this.load()); });
  }

  period(exp: any): string {
    const end = exp.endYear ? `${exp.endMonth}/${exp.endYear}` : 'Présent';
    return `${exp.startMonth}/${exp.startYear} → ${end}`;
  }
}
