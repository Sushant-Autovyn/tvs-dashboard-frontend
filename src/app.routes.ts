import { Routes } from '@angular/router';
import { AgentLoginComponent } from './app/components/agent-login/agent-login';
import { agentAuthGuard, agentLoginRedirect } from './app/guards/agent-auth.guard';

export const dashboardRoutes: Routes = [
  { path: '', component: AgentLoginComponent, pathMatch: 'full', canActivate: [agentLoginRedirect] },
  {
    path: 'dashboard',
    canActivate: [agentAuthGuard],
    loadChildren: () =>
      import('./app/modules/dashboard/dashboard.routes').then((m) => m.dashboardRoutes)
  },
  {
    path: 'admin',
    canActivate: [agentAuthGuard],
    loadChildren: () =>
      import('./app/modules/admin/admin.module').then((m) => m.AdminModule)
  },
  { path: '**', redirectTo: '' }
];
