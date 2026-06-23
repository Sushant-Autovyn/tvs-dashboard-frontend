import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { adminRoutes } from './admin.routes';
import { AdminShellComponent } from './components/admin-shell/admin-shell';
import { TicketManagementComponent } from './components/ticket-management/ticket-management';
import { KnowledgeBaseComponent } from './components/knowledge-base/knowledge-base';
import { ReportsComponent } from './components/reports/reports';
import { SettingsComponent } from './components/settings/settings';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(adminRoutes),
    AdminShellComponent,
    TicketManagementComponent,
    KnowledgeBaseComponent,
    ReportsComponent,
    SettingsComponent
  ],
  declarations: []
})
export class AdminModule {}
