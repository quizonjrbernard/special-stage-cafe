import { computed, Injectable, signal } from '@angular/core';

export interface User {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registeredUsers = signal<User[]>(_getInitialUsers());

  user = signal<User | null>(_getInitialUser());

  isAuthenticated = computed(() => !!this.user());
  isAdmin = computed(() => this.user()?.role === 'admin');

  login(email: string, password: string): boolean {
    const found = this.registeredUsers().find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );

    if (!found) {
      return false;
    }

    this.user.set({ ...found, password: '' });
    try { localStorage.setItem('ssc_user', JSON.stringify(this.user())); } catch {}
    return true;
  }

  register(name: string, email: string, password: string): { success: boolean; message: string } {
    if (!name || !email || !password) {
      return { success: false, message: 'Please complete all fields.' };
    }

    if (this.registeredUsers().some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'This email is already registered.' };
    }

    const newUser: User = { name, email, password, role: 'user' };
    this.registeredUsers.update((list) => {
      const updated = [...list, newUser];
      try { localStorage.setItem('ssc_users', JSON.stringify(updated)); } catch {}
      return updated;
    });
    this.user.set({ ...newUser, password: '' });
    try { localStorage.setItem('ssc_user', JSON.stringify(this.user())); } catch {}

    return { success: true, message: 'Registration successful.' };
  }

  logout(): void {
    this.user.set(null);
    try { localStorage.removeItem('ssc_user'); } catch {}
  }
}

function _getInitialUsers(): User[] {
  const defaultAdmin: User = { name: 'Admin', email: 'admin@stagecafe.com', password: 'admin123', role: 'admin' };
  const defaultGuest: User = { name: 'Stage Guest', email: 'guest@stagecafe.com', password: 'coffee123', role: 'user' };

  try {
    const raw = localStorage.getItem('ssc_users');
    if (!raw) {
      const list = [defaultAdmin, defaultGuest];
      try { localStorage.setItem('ssc_users', JSON.stringify(list)); } catch {}
      return list;
    }

    const parsed = JSON.parse(raw) as User[];
    const hasAdmin = parsed.some(u => u.email.toLowerCase() === defaultAdmin.email.toLowerCase());
    if (!hasAdmin) {
      const updated = [defaultAdmin, ...parsed];
      try { localStorage.setItem('ssc_users', JSON.stringify(updated)); } catch {}
      return updated;
    }

    return parsed;
  } catch {
    return [defaultGuest];
  }
}

function _getInitialUser(): User | null {
  try {
    const raw = localStorage.getItem('ssc_user');
    return raw ? JSON.parse(raw) as User : null;
  } catch { return null; }
}
