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
  selector: 'app-educations',
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatCardModule, MatSnackBarModule],
  templateUrl: './educations.html',
  styleUrl: './educations.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationsComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  educations = signal<any[]>([]);
  displayedColumns = ['degree', 'school', 'graduationYear', 'actions'];
  editingId: number | null = null;
  showForm = false;

  form = this.fb.group({
    degree: ['', Validators.required],
    school: ['', Validators.required],
    location: ['', Validators.required],
    graduationYear: [new Date().getFullYear(), Validators.required],
    skillInput: [''],
    skills: [[] as string[]],
    order: [0],
    projects: this.fb.array([]),
  });

  get projectsArray(): FormArray { return this.form.get('projects') as FormArray; }

  ngOnInit() { this.load(); }
  load() { this.api.getEducations().subscribe(data => setTimeout(() => this.educations.set(data))); }

  addProject() {
    this.projectsArray.push(this.fb.group({ name: ['', Validators.required], description: ['', Validators.required], order: [0] }));
  }
  removeProject(i: number) { this.projectsArray.removeAt(i); }

  openCreate() {
    this.editingId = null;
    this.projectsArray.clear();
    this.form.reset({ skills: [], graduationYear: new Date().getFullYear(), order: 0 });
    this.showForm = true;
  }

  openEdit(edu: any) {
    this.editingId = edu.id;
    this.projectsArray.clear();
    edu.projects?.forEach((p: any) => this.projectsArray.push(this.fb.group({ name: [p.name, Validators.required], description: [p.description, Validators.required], order: [p.order] })));
    this.form.patchValue({ ...edu, skillInput: '' });
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
    const obs = this.editingId ? this.api.updateEducation(this.editingId, data) : this.api.createEducation(data);
    obs.subscribe({ next: () => setTimeout(() => { this.load(); this.showForm = false; this.snack.open('Sauvegardé', '', { duration: 2000 }); }) });
  }

  delete(id: number) {
    this.dialog.open(ConfirmDialogComponent, { data: { message: 'Supprimer cette formation ?' } })
      .afterClosed().subscribe(ok => { if (ok) this.api.deleteEducation(id).subscribe(() => this.load()); });
  }
}
