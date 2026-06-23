import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TicketService } from '../../services/ticket.service';
import { TicketTableComponent } from '../ticket-table/ticket-table';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-unassigned-tickets',
  standalone: true,
  imports: [CommonModule, TicketTableComponent],
  templateUrl: './unassigned-tickets.html',
  styleUrl: './unassigned-tickets.css'
})
export class UnassignedTicketsComponent implements OnInit, OnDestroy {
  tickets: Ticket[] = [];
  loading = true;
  private sub!: Subscription;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void { this.fetch(); }

  fetch(): void {
    this.loading = true;
    this.sub = this.ticketService.getTickets().subscribe({
      next: (data) => { this.tickets = data.filter(t => t.status === 'pending' && !t.userId); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  load(): void {
    this.loading = true;
    this.sub = this.ticketService.refresh().subscribe({
      next: (data) => { this.tickets = data.filter(t => t.status === 'pending' && !t.userId); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onStatusChange(event: { id: string; status: string }): void {
    this.ticketService.updateStatus(event.id, event.status)
      .subscribe({ next: () => this.load() });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }
}
