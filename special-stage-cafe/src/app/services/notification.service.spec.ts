import { TestBed } from '@angular/core/testing';
import { NotificationService, NotificationItem } from './notification.service';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [NotificationService] });
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('push adds a notification and persists', () => {
    const n = service.push({ message: 'hello', email: 'a@b.com' });
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].message).toBe('hello');
    const stored = JSON.parse(localStorage.getItem('ssc_notifications') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].email).toBe('a@b.com');
  });

  it('getForUser filters by email', () => {
    service.push({ message: 'm1', email: 'x@x.com' });
    service.push({ message: 'm2', email: 'y@y.com' });
    const results = service.getForUser('x@x.com');
    expect(results.length).toBe(1);
    expect(results[0].message).toBe('m1');
  });

  it('markRead marks an item read', () => {
    const n = service.push({ message: 'to read', email: 'r@r.com' });
    expect(service.notifications()[0].read).toBe(false);
    service.markRead(n.id);
    expect(service.notifications()[0].read).toBe(true);
  });

  it('clearForUser removes that user notifications', () => {
    service.push({ message: 'u1', email: 'a@a.com' });
    service.push({ message: 'u2', email: 'b@b.com' });
    service.clearForUser('a@a.com');
    expect(service.notifications().some(n => n.email === 'a@a.com')).toBe(false);
    expect(service.notifications().some(n => n.email === 'b@b.com')).toBe(true);
  });

  it('pushToast enqueues and removes after duration (fake timers)', () => {
    vi.useFakeTimers();
    const t = service.pushToast('toast-msg', undefined, undefined, 1000);
    expect(service.toastQueue().length).toBe(1);
    vi.advanceTimersByTime(1001);
    expect(service.toastQueue().length).toBe(0);
    vi.useRealTimers();
  });

  it('sendExternal posts to webhook when set', async () => {
    const fakeFetch = vi.fn().mockResolvedValue({ ok: true });
    // @ts-ignore
    global.fetch = fakeFetch;
    localStorage.setItem('ssc_notifications_webhook', 'http://localhost:4002/notify');
    const n: NotificationItem = {
      id: '1',
      message: 'ext',
      createdAt: new Date().toISOString(),
      read: false,
    };
    const ok = await service.sendExternal(n);
    expect(ok).toBe(true);
    expect(fakeFetch).toHaveBeenCalled();
  });
});
