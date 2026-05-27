import { Injectable, signal } from '@angular/core';

export interface NotificationItem {
  id: string;
  message: string;
  orderId?: string;
  email?: string;
  read?: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'ssc_notifications';

function _getInitialNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as NotificationItem[] : [];
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSignal = signal<NotificationItem[]>(_getInitialNotifications());

  notifications = this.notificationsSignal;

  private toastSignal = signal<NotificationItem | null>(null);

  toast = this.toastSignal;
  // queue of transient toasts
  private toastQueueSignal = signal<NotificationItem[]>([]);
  toastQueue = this.toastQueueSignal;

  push(notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) {
    const n: NotificationItem = {
      ...notification,
      id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
      createdAt: new Date().toISOString(),
      read: false,
    };

    this.notificationsSignal.update(list => {
      const updated = [n, ...list];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });

    return n;
  }

  getForUser(email?: string) {
    if (!email) return [] as NotificationItem[];
    return this.notificationsSignal().filter(n => n.email === email);
  }

  markRead(id: string) {
    this.notificationsSignal.update(list => {
      const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }

  clearForUser(email?: string) {
    if (!email) return;
    this.notificationsSignal.update(list => {
      const updated = list.filter(n => n.email !== email);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }

  pushToast(message: string, orderId?: string, email?: string, duration = 4000) {
    const n: NotificationItem = {
      id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
      message,
      orderId,
      email,
      read: true,
      createdAt: new Date().toISOString(),
    };

    // persist as a notification if an email is present
    if (email) {
      this.push({ message, orderId, email });
    }

    // enqueue toast
    this.toastQueueSignal.update(q => [n, ...q].slice(0, 5));
    // schedule removal
    setTimeout(() => {
      this.toastQueueSignal.update(q => q.filter(t => t.id !== n.id));
    }, duration);

    // also set the single toast signal for backward compatibility
    this.toastSignal.set(n);
    setTimeout(() => this.toastSignal.set(null), duration);

    return n;
  }

  async sendExternal(notification: NotificationItem, webhookUrl?: string) {
    // Stub: attempt to POST to a webhook URL if provided. Failures are swallowed.
    const url = webhookUrl || localStorage.getItem('ssc_notifications_webhook') || undefined;
    if (!url) return false;
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });
      return true;
    } catch {
      return false;
    }
  }
}
