import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

const STORAGE_KEY = 'agent_auth';

export function isAgentAuthed(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(STORAGE_KEY);
}

export function clearAgentAuth(): void {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

/** Block access to /dashboard and /admin if not logged in. */
export const agentAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (isAgentAuthed()) return true;
  router.navigate(['/']);
  return false;
};

/** Redirect already-logged-in agents away from the login page. */
export const agentLoginRedirect: CanActivateFn = () => {
  const router = inject(Router);
  if (isAgentAuthed()) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
