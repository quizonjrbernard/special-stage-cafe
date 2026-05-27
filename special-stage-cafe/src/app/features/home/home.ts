import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { OrdersService, Order } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  private menuService = inject(MenuService);
  menuPreview = this.menuService.menuItems.slice(0, 3);
  private ordersService = inject(OrdersService);
  // bind directly to the orders signal so the UI is reactive
  orders = this.ordersService.orders;
  auth = inject(AuthService);
  confirm = inject(ConfirmService);

  // parse price like 'AED 18' -> 18
  priceValue(p: string | number) {
    if (typeof p === 'number') return p;
    const n = Number(String(p).replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  itemSubtotal(item: any) {
    return this.priceValue(item.price) * (item.quantity || 1);
  }

  orderTotal(order: Order) {
    if (typeof order.total === 'number' && order.total > 0) return order.total;
    return order.items?.reduce((s, it) => s + this.itemSubtotal(it), 0) || 0;
  }

  async markCompleted(id: string) {
    const ok = await this.confirm.show('Mark this order as completed and notify the customer?');
    if (!ok) return;
    this.ordersService.updateOrderStatus(id, 'completed');
  }
}
