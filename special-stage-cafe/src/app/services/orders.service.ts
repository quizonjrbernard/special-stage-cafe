import { Injectable } from '@angular/core';
import type { CartItem } from './cart.service';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  name?: string;
  email?: string;
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private storageKey = 'ssc_orders';

  placeOrder(order: Omit<Order, 'id' | 'createdAt'>) {
    const o: Order = {
      ...order,
      id: String(Date.now()),
      createdAt: new Date().toISOString()
    };

    try {
      const raw = localStorage.getItem(this.storageKey);
      const list = raw ? JSON.parse(raw) as Order[] : [];
      list.unshift(o);
      localStorage.setItem(this.storageKey, JSON.stringify(list));
    } catch {}

    return o;
  }

  getOrders(): Order[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) as Order[] : [];
    } catch { return []; }
  }
}
