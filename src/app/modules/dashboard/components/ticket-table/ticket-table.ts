import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-table.html',
  styleUrl: './ticket-table.css'
})
export class TicketTableComponent {
  @Input() tickets: Ticket[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No tickets found.';
  @Output() statusChange = new EventEmitter<{ id: string; status: string }>();

  statusOptions = ['pending', 'in progress', 'resolved'];

  onStatusChange(ticket: Ticket, status: string) {
    this.statusChange.emit({ id: ticket._id, status });
  }

  badgeClass(status: string): string {
    if (status === 'resolved') return 'badge badge--resolved';
    if (status === 'in progress') return 'badge badge--progress';
    return 'badge badge--pending';
  }

  formatDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleString();
  }
}
