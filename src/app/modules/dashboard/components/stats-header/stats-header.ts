import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/ticket.model';

interface Stat {
  label: string;
  value: number;
  change: string;
  icon: string;
  bg: string;
}

@Component({
  selector: 'app-stats-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-header.html',
  styleUrl: './stats-header.css'
})
export class StatsHeaderComponent {
  @Input() tickets: Ticket[] = [];
  @Input() loading = false;

  get stats(): Stat[] {
    const all       = this.tickets.length;
    const newT      = this.tickets.filter(t => t.status === 'pending').length;
    const pending   = this.tickets.filter(t => t.status === 'pending').length;
    const solved    = this.tickets.filter(t => t.status === 'resolved').length;
    const unassigned = this.tickets.filter(t => t.status === 'pending' && !t.userId).length;

    return [
      { label: 'Total Tickets',  value: all,        change: '↑ 12% from yesterday', icon: '&#128203;', bg: '#eff6ff' },
      { label: 'New Tickets',    value: newT,       change: '↑ 15% from yesterday', icon: '&#128196;', bg: '#fefce8' },
      { label: 'Pending Tic...', value: pending,    change: '↑ 5% from yesterday',  icon: '&#9203;',   bg: '#fff7ed' },
      { label: 'Solved (24h)',   value: solved,     change: '↑ 20% from yesterday', icon: '&#10003;',  bg: '#f5f3ff' },
      { label: 'Unassigned',     value: unassigned, change: '↓ 10% from yesterday', icon: '&#128101;', bg: '#fdf2f8' },
    ];
  }
}
