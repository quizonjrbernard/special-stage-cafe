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
  menuItems: MenuItem[] = [
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
}
