import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrdersService, Order } from '../../services/orders.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent {
  cart = inject(CartService);
  orders = inject(OrdersService);
  router = inject(Router);

  name = signal('');
  email = signal('');
  note = signal('');
  placing = signal(false);
  success = signal<Order | null>(null);

  placeOrder() {
    if (this.cart.items().length === 0) return;
    this.placing.set(true);

    const order = this.orders.placeOrder({
      items: this.cart.items(),
      total: this.cart.total(),
      name: this.name(),
      email: this.email(),
      note: this.note()
    });

    this.cart.clear();
    this.success.set(order);
    this.placing.set(false);
    setTimeout(() => this.router.navigate(['/profile']), 1200);
  }
}

