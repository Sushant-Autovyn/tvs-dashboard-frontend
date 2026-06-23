import { Routes } from '@angular/router';
import { AdminShellComponent } from './components/admin-shell/admin-shell';
import { TicketManagementComponent } from './components/ticket-management/ticket-management';
import { KnowledgeBaseComponent } from './components/knowledge-base/knowledge-base';
import { ReportsComponent } from './components/reports/reports';
import { SettingsComponent } from './components/settings/settings';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      { path: '', redirectTo: 'tickets', pathMatch: 'full' },
      { path: 'tickets', component: TicketManagementComponent },
      { path: 'knowledge-base', component: KnowledgeBaseComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];
