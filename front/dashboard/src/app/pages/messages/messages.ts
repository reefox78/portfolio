import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-messages',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatCardModule, MatSnackBarModule],
  templateUrl: './messages.html',
  styleUrl: './messages.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnInit {
  private api = inject(ApiService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  messages = signal<any[]>([]);
  displayedColumns = ['name', 'email', 'subject', 'date', 'actions'];
  expanded: number | null = null;

  ngOnInit() { this.load(); }
  load() { this.api.getMessages().subscribe(data => setTimeout(() => this.messages.set(data))); }

  toggle(id: number) { this.expanded = this.expanded === id ? null : id; }

  delete(id: number) {
    this.dialog.open(ConfirmDialogComponent, { data: { message: 'Supprimer ce message ?' } })
      .afterClosed().subscribe(ok => { if (ok) this.api.deleteMessage(id).subscribe(() => { this.load(); setTimeout(() => this.snack.open('Message supprimé', '', { duration: 2000 })); }); });
  }

  unreadCount(): number { return this.messages().filter(m => !m.read).length; }
}
