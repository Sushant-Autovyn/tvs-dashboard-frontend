import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarComponent } from '../sidebar/sidebar';
import { StatsHeaderComponent } from '../stats-header/stats-header';
import { TicketService, PriorityFilter } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { clearAgentAuth } from '../../../../guards/agent-auth.guard';

interface PriorityOption { value: PriorityFilter; label: string; }

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent, StatsHeaderComponent],
  templateUrl: './dashboard-shell.html',
  styleUrl: './dashboard-shell.css'
})
export class DashboardShellComponent implements OnInit, OnDestroy {
  allTickets: Ticket[] = [];
  statsLoading = true;
  sidebarCollapsed = false;

  searchTerm = '';
  priority: PriorityFilter = 'all';
  priorityOpen = false;
  readonly priorityOptions: PriorityOption[] = [
    { value: 'all',    label: 'All priorities' },
    { value: 'high',   label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low',    label: 'Low' }
  ];

  private sub!: Subscription;

  constructor(private ticketService: TicketService, private router: Router) {}

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    clearAgentAuth();
    this.router.navigate(['/']);
  }

  onSearchChange(): void {
    this.ticketService.setFilters({ search: this.searchTerm });
  }

  togglePriority(): void {
    this.priorityOpen = !this.priorityOpen;
  }

  selectPriority(opt: PriorityOption): void {
    this.priority = opt.value;
    this.priorityOpen = false;
    this.ticketService.setFilters({ priority: opt.value });
  }

  get priorityLabel(): string {
    return this.priorityOptions.find(o => o.value === this.priority)?.label ?? 'All priorities';
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!this.priorityOpen) return;
    const t = e.target as HTMLElement;
    if (!t.closest('.priority-filter')) this.priorityOpen = false;
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.statsLoading = true;
    this.sub = this.ticketService.getTickets().subscribe({
      next: (data) => { this.allTickets = data; this.statsLoading = false; },
      error: () => { this.statsLoading = false; }
    });
  }

  refresh(): void {
    this.statsLoading = true;
    this.sub = this.ticketService.refresh().subscribe({
      next: (data) => { this.allTickets = data; this.statsLoading = false; },
      error: () => { this.statsLoading = false; }
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }
}
