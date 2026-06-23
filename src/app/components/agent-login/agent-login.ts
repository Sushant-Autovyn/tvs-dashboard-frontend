import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Hardcoded credentials — replace with backend auth later
const AGENT_EMAIL = 'admin@tvs.com';
const AGENT_PASSWORD = 'admin123';

@Component({
  selector: 'app-agent-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-login.html',
  styleUrl: './agent-login.css'
})
export class AgentLoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private router: Router) {}

  login(): void {
    this.error = '';
    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Please enter your email and password.';
      return;
    }
    this.loading = true;
    // Simulate small delay then validate
    setTimeout(() => {
      this.loading = false;
      if (this.email.trim().toLowerCase() === AGENT_EMAIL && this.password === AGENT_PASSWORD) {
        localStorage.setItem('agent_auth', JSON.stringify({ email: AGENT_EMAIL, at: Date.now() }));
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Invalid credentials.';
      }
    }, 250);
  }
}
