import { computed, Injectable, signal } from '@angular/core';

export interface User {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registeredUsers = signal<User[]>(_getInitialUsers());

  user = signal<User | null>(_getInitialUser());

  isAuthenticated = computed(() => !!this.user());

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

    const newUser: User = { name, email, password };
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
  try {
    const raw = localStorage.getItem('ssc_users');
    return raw ? JSON.parse(raw) as User[] : [ { name: 'Stage Guest', email: 'guest@stagecafe.com', password: 'coffee123' } ];
  } catch { return [ { name: 'Stage Guest', email: 'guest@stagecafe.com', password: 'coffee123' } ]; }
}

function _getInitialUser(): User | null {
  try {
    const raw = localStorage.getItem('ssc_user');
    return raw ? JSON.parse(raw) as User : null;
  } catch { return null; }
}
