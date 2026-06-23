import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat';

interface UserRecord {
  _id?: string;
  id?: string;
  name?: string;
  username: string;
  email: string;
  phone: string;
  issue: string;
  status: string;
  submittedAt?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  users: UserRecord[] = [];
  searchTerm = '';
  statusFilter = 'all';
  loading = false;

  statusOptions = ['all', 'pending', 'in progress', 'resolved'];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.chatService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.users || [];
        this.loading = false;
      },
      error: () => {
        this.users = [];
        this.loading = false;
      }
    });
  }

  get filteredUsers(): UserRecord[] {
    const term = this.searchTerm.toLowerCase();
    return this.users.filter((user) => {
      const matchesStatus = this.statusFilter === 'all' || user.status === this.statusFilter;
      const matchesSearch = !term ||
        user.username?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.issue?.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }

  get totalUsers(): number {
    return this.users.length;
  }

  get pendingUsers(): number {
    return this.users.filter((u) => u.status === 'pending').length;
  }

  get resolvedUsers(): number {
    return this.users.filter((u) => u.status === 'resolved').length;
  }

  updateStatus(user: UserRecord, status: string): void {
    const id = user._id || user.id;
    if (!id) return;

    this.chatService.updateUserStatus(id, status).subscribe({
      next: () => {
        user.status = status;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'resolved':
        return 'badge resolved';
      case 'in progress':
        return 'badge in-progress';
      default:
        return 'badge pending';
    }
  }

  formatDate(date?: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }
}
