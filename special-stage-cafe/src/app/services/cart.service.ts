import { Injectable, signal, computed } from '@angular/core';
import type { MenuItem } from './menu.service';

export interface CartItem extends MenuItem { quantity: number }

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'ssc_cart';
  private itemsSignal = signal<CartItem[]>(_getInitialCart());

  items = this.itemsSignal;

  total = computed(() => this.itemsSignal().reduce((sum, it) => {
    const price = Number(String(it.price).replace(/[^0-9.]/g, '')) || 0;
    return sum + price * it.quantity;
  }, 0));

  add(item: MenuItem) {
    this.itemsSignal.update(list => {
      const existing = list.find(i => i.title === item.title);
      let updated;
      if (existing) {
        updated = list.map(i => i.title === item.title ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        updated = [...list, { ...item, quantity: 1 }];
      }
      try { localStorage.setItem(this.storageKey, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }

  remove(title: string) {
    this.itemsSignal.update(list => {
      const updated = list.filter(i => i.title !== title);
      try { localStorage.setItem(this.storageKey, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }

  clear() {
    this.itemsSignal.set([]);
    try { localStorage.removeItem(this.storageKey); } catch {}
  }
}

function _getInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('ssc_cart');
    return raw ? JSON.parse(raw) as CartItem[] : [];
  } catch { return []; }
}
