import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrdersService, Order } from '../../services/orders.service';
import { NotificationService } from '../../services/notification.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  auth = inject(AuthService);
  ordersService = inject(OrdersService);

  orders = computed<Order[]>(() => {
    const allOrders = this.ordersService.getOrders();
    if (this.auth.isAdmin()) {
      return allOrders;
    }
    const email = this.auth.user()?.email;
    return allOrders.filter((order) => order.email === email);
  });

  notificationService = inject(NotificationService);
  notifications = computed(() => this.notificationService.getForUser(this.auth.user()?.email));

  logout() { this.auth.logout(); }
}
