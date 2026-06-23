export interface Ticket {
  _id: string;
  username: string;
  email: string;
  phone: string;
  issue: string;
  status: 'pending' | 'in progress' | 'resolved';
  submittedAt?: string;
  userId?: string;
}
