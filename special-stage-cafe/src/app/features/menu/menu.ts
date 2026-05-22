import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class MenuComponent {
  menuItems = inject(MenuService).menuItems;
  cart = inject(CartService);
  addToCart(item: any) { this.cart.add(item); }
}
