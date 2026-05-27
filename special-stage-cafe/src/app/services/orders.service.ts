import { Injectable, signal, inject } from '@angular/core';
import type { CartItem } from './cart.service';
import { NotificationService } from './notification.service';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  name?: string;
  email?: string;
  note?: string;
  status?: 'pending' | 'completed';
}

const STORAGE_KEY = 'ssc_orders';

function _getInitialOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as Order[] : [];
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private ordersSignal = signal<Order[]>(_getInitialOrders());

  orders = this.ordersSignal;
  private notificationService = inject(NotificationService);

  // optional realtime connection
  private ws: WebSocket | null = null;

  constructor() {
    // lazy connect only in browser
    try {
      if (typeof window !== 'undefined') {
        const url = localStorage.getItem('ssc_ws_orders') || undefined;
        if (url) this.connectRealtime(url);
      }
    } catch {}
  }

  placeOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>) {
    const o: Order = {
      ...order,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    this.ordersSignal.update(list => {
      const updated = [o, ...list];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      try {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'order:new', payload: o }));
        }
      } catch {}
      return updated;
    });

    return o;
  }

  updateOrderStatus(id: string, status: 'pending' | 'completed') {
    this.ordersSignal.update(list => {
      const old = list.find(o => o.id === id);
      const updated = list.map(o => o.id === id ? { ...o, status } : o);
      const changedOrder = updated.find(o => o.id === id);
      if (old && old.status !== status && status === 'completed' && changedOrder) {
        try {
          this.notificationService.push({
            orderId: changedOrder.id,
            email: changedOrder.email,
            message: `Your order #${changedOrder.id} has been marked completed.`,
          });
        } catch {}
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}

      // broadcast update to websocket server if connected
      try {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'order:updated', payload: changedOrder }));
        }
      } catch {}
      return updated;
    });
  }

  getOrders(): Order[] {
    return this.ordersSignal();
  }

  connectRealtime(url: string) {
    try {
      if (this.ws) this.ws.close();
      // only run in browser
      if (typeof WebSocket === 'undefined') return;
      this.ws = new WebSocket(url);
      this.ws.addEventListener('open', () => {
        // optionally request initial state
        try { this.ws?.send(JSON.stringify({ type: 'orders:subscribe' })); } catch {}
      });
      this.ws.addEventListener('message', (ev) => {
        try {
          const data = JSON.parse(ev.data as string);
          if (data?.type === 'orders:state' && Array.isArray(data.payload)) {
            this.ordersSignal.set(data.payload as Order[]);
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data.payload)); } catch {}
          } else if (data?.type === 'order:updated' && data.payload) {
            const incoming = data.payload as Order;
            this.ordersSignal.update(list => {
              const updated = list.map(o => o.id === incoming.id ? incoming : o);
              try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
              return updated;
            });
          } else if (data?.type === 'order:new' && data.payload) {
            const incoming = data.payload as Order;
            this.ordersSignal.update(list => {
              const updated = [incoming, ...list];
              try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
              return updated;
            });
          }
        } catch {}
      });
      this.ws.addEventListener('close', () => { this.ws = null; });
      this.ws.addEventListener('error', () => { /* ignore */ });
    } catch {}
  }
}
