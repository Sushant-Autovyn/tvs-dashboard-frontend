import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { TicketService, TicketFilters } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';

interface ChatMessage { text: string; sender: 'user' | 'admin'; timestamp: string; }

@Component({
  selector: 'app-all-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-tickets.html',
  styleUrl: './all-tickets.css'
})
export class AllTicketsComponent implements OnInit, OnDestroy {
  tickets: Ticket[] = [];
  private allTickets: Ticket[] = [];
  private filters: TicketFilters = { search: '', priority: 'all' };
  selected: Ticket | null = null;
  loading = true;
  private sub!: Subscription;

  chatMessages: ChatMessage[] = [];
  adminReply = '';
  sendingReply = false;
  private chatPoll: any;

  constructor(private ticketService: TicketService, private http: HttpClient) {}

  ngOnInit(): void { this.fetch(); }

  fetch(): void {
    this.loading = true;
    this.sub = combineLatest([
      this.ticketService.getTickets(),
      this.ticketService.filters$
    ]).subscribe({
      next: ([data, filters]) => {
        this.allTickets = data;
        this.filters = filters;
        this.applyFilters();
        this.loading = false;
        if (this.tickets.length > 0 && (!this.selected || !this.tickets.find(t => t._id === this.selected?._id))) {
          this.select(this.tickets[0]);
        } else if (this.tickets.length === 0) {
          this.selected = null;
        }
      },
      error: () => { this.loading = false; }
    });
  }

  private applyFilters(): void {
    const term = (this.filters.search || '').trim().toLowerCase();
    const pri  = this.filters.priority;

    this.tickets = this.allTickets.filter(t => {
      // search match
      if (term) {
        const haystack = [
          t._id, t.username, t.email, t.phone, t.issue
        ].map(v => (v || '').toString().toLowerCase()).join(' ');
        if (!haystack.includes(term)) return false;
      }
      // priority match (mapped from status, since tickets don't carry a priority field)
      if (pri !== 'all') {
        const mapped = this.priorityFor(t);
        if (mapped !== pri) return false;
      }
      return true;
    });
  }

  private priorityFor(t: Ticket): 'high' | 'medium' | 'low' {
    if (t.status === 'pending')     return 'high';
    if (t.status === 'in progress') return 'medium';
    return 'low';
  }

  load(): void {
    this.loading = true;
    this.ticketService.refresh().subscribe({
      next: () => { this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  select(t: Ticket): void {
    this.selected = t;
    this.chatMessages = [];
    this.adminReply = '';
    clearInterval(this.chatPoll);
    this.loadChatMessages();
    this.chatPoll = setInterval(() => this.loadChatMessages(), 5000);
  }

  loadChatMessages(): void {
    if (!this.selected) return;
    this.http.get<any>(`${environment.apiUrl}/api/support/${this.selected._id}/messages`)
      .subscribe({ next: (res) => { this.chatMessages = res.messages; } });
  }

  sendAdminReply(): void {
    const text = this.adminReply.trim();
    if (!text || !this.selected || this.sendingReply) return;
    this.sendingReply = true;
    this.http.post<any>(`${environment.apiUrl}/api/support/${this.selected._id}/messages`, { text, sender: 'admin' })
      .subscribe({
        next: (res) => { this.chatMessages = res.messages; this.adminReply = ''; this.sendingReply = false; },
        error: () => { this.sendingReply = false; }
      });
  }

  onStatusChange(ticket: Ticket, status: string): void {
    this.ticketService.updateStatus(ticket._id, status)
      .subscribe({ next: () => { ticket.status = status as any; this.load(); } });
  }

  statusLabel(s: string): string {
    if (s === 'in progress') return 'Open';
    if (s === 'resolved') return 'Solved';
    return 'New';
  }

  statusClass(s: string): string {
    if (s === 'in progress') return 'status-badge status-open';
    if (s === 'resolved') return 'status-badge status-solved';
    return 'status-badge status-new';
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); clearInterval(this.chatPoll); }
}
