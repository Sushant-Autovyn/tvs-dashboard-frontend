import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.css'
})
export class AdminShellComponent {
  navItems = [
    { label: 'Tickets', route: '/admin/tickets' },
    { label: 'Knowledge Base', route: '/admin/knowledge-base' },
    { label: 'Reports', route: '/admin/reports' },
    { label: 'Settings', route: '/admin/settings' }
  ];
}
