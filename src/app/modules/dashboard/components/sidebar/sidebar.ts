import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-dash-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  counts = { all: 0, new: 0, open: 0, pending: 0, solved: 0, unassigned: 0 };
  private sub!: Subscription;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.sub = this.ticketService.getTickets().subscribe(tickets => {
      this.counts = {
        all:        tickets.length,
        new:        tickets.filter(t => t.status === 'pending').length,
        open:       tickets.filter(t => t.status === 'in progress').length,
        pending:    tickets.filter(t => t.status === 'pending').length,
        solved:     tickets.filter(t => t.status === 'resolved').length,
        unassigned: tickets.filter(t => t.status === 'pending' && !t.userId).length
      };
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }
}
