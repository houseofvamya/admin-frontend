export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'admin' | 'manager' | 'support';
  status: 'active' | 'invited' | 'suspended';
  lastLoginAt: string;
  createdAt: string;
}
