import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, map, tap } from 'rxjs';
import { Ticket } from '../models/ticket.model';
import { environment } from '../../../../environments/environment';

export type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

export interface TicketFilters {
  search: string;
  priority: PriorityFilter;
}

@Injectable({ providedIn: 'root' })
export class TicketService implements OnDestroy {
  private base = `${environment.apiUrl}/api/users`;

  // Multicast store: every subscriber — present or future — receives the
  // latest tickets list synchronously after the first fetch completes.
  // Using ReplaySubject(1) instead of shareReplay() avoids the lazy-route
  // race where a late <router-outlet> subscriber misses the first emission.
  private ticketsSubject = new ReplaySubject<Ticket[]>(1);
  private fetched = false;
  private inFlight = false;

  // Shared filter state used by header controls + the ticket list.
  private filtersSubject = new BehaviorSubject<TicketFilters>({ search: '', priority: 'all' });
  readonly filters$ = this.filtersSubject.asObservable();

  // Auto-refresh: re-fetch tickets every 10 s so the dashboard stays in
  // sync with new messages / status changes without a manual reload.
  private readonly POLL_MS = 10_000;
  private pollTimer: any = null;

  constructor(private http: HttpClient) {}

  /** Returns the shared tickets stream. Triggers the initial fetch + polling once. */
  getTickets(): Observable<Ticket[]> {
    if (!this.fetched && !this.inFlight) {
      this.fetch();
    }
    this.startPolling();
    return this.ticketsSubject.asObservable();
  }

  /** Force a re-fetch; pushes the new list to every active subscriber. */
  refresh(): Observable<Ticket[]> {
    this.fetch();
    return this.ticketsSubject.asObservable();
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http
      .patch(`${this.base}/${id}/status`, { status })
      .pipe(tap(() => this.fetch()));
  }

  /** Update the current filter state (merge-style). */
  setFilters(patch: Partial<TicketFilters>): void {
    this.filtersSubject.next({ ...this.filtersSubject.value, ...patch });
  }

  get currentFilters(): TicketFilters {
    return this.filtersSubject.value;
  }

  private fetch(): void {
    if (this.inFlight) return;
    this.inFlight = true;
    this.http
      .get<{ users: Ticket[] }>(this.base)
      .pipe(map((r) => r.users ?? []))
      .subscribe({
        next: (data) => {
          this.ticketsSubject.next(data);
          this.fetched = true;
          this.inFlight = false;
        },
        error: () => {
          this.inFlight = false;
        }
      });
  }

  private startPolling(): void {
    if (this.pollTimer) return;
    this.pollTimer = setInterval(() => this.fetch(), this.POLL_MS);
  }

  ngOnDestroy(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
}
