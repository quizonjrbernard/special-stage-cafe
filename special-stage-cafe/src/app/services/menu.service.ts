import { Injectable } from '@angular/core';

export interface MenuItem {
  title: string;
  description: string;
  price: string;
  tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private STORAGE_KEY = 'ssc_menu_items';

  menuItems: MenuItem[] = this._getInitialMenu();

  private _getInitialMenu(): MenuItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw) as MenuItem[];
    } catch {}

    const seed: MenuItem[] = [
    {
      title: 'Cappuccino',
      description: 'Espresso with steamed milk and a rich foam cap.',
      price: 'AED 18',
      tags: ['espresso', 'milk', 'comfort']
    },
    {
      title: 'Caramel Latte',
      description: 'Smooth espresso, steamed milk, and caramel drizzle.',
      price: 'AED 22',
      tags: ['sweet', 'latte', 'classic']
    },
    {
      title: 'Cold Brew',
      description: 'Slow-steeped coffee served over ice for a crisp finish.',
      price: 'AED 20',
      tags: ['refreshing', 'iced', 'smooth']
    },
    {
      title: 'Flat White',
      description: 'Creamy microfoam poured over a velvety espresso shot.',
      price: 'AED 19',
      tags: ['silky', 'espresso', 'australian']
    },
    {
      title: 'Matcha Chai',
      description: 'Green tea matcha blended with warming spices.',
      price: 'AED 21',
      tags: ['tea', 'spiced', 'wellness']
    }
    ];

    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(seed)); } catch {}
    return seed;
  }

  private _persist(items: MenuItem[]) {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items)); } catch {}
  }

  addItem(item: MenuItem) {
    this.menuItems = [item, ...this.menuItems];
    this._persist(this.menuItems);
  }

  updateItem(title: string, updated: Partial<MenuItem>) {
    this.menuItems = this.menuItems.map(i => i.title === title ? { ...i, ...updated } : i);
    this._persist(this.menuItems);
  }

  deleteItem(title: string) {
    this.menuItems = this.menuItems.filter(i => i.title !== title);
    this._persist(this.menuItems);
  }
}
