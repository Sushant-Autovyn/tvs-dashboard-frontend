import { Routes } from '@angular/router';
import { DashboardShellComponent } from './components/dashboard-shell/dashboard-shell';
import { AllTicketsComponent } from './components/all-tickets/all-tickets';
import { NewTicketsComponent } from './components/new-tickets/new-tickets';
import { UnassignedTicketsComponent } from './components/unassigned-tickets/unassigned-tickets';
import { SolvedTicketsComponent } from './components/solved-tickets/solved-tickets';
import { PendingTicketsComponent } from './components/pending-tickets/pending-tickets';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardShellComponent,
    children: [
      { path: '',          redirectTo: 'all', pathMatch: 'full' },
      { path: 'all',        component: AllTicketsComponent },
      { path: 'new',        component: NewTicketsComponent },
      { path: 'pending',    component: PendingTicketsComponent },
      { path: 'unassigned', component: UnassignedTicketsComponent },
      { path: 'solved',     component: SolvedTicketsComponent }
    ]
  }
];
