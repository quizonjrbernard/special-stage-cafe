import { TestBed } from '@angular/core/testing';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [OrdersService] });
    service = TestBed.inject(OrdersService);
  });

  it('should place an order and persist it', () => {
    const order = service.placeOrder({ items: [], total: 0, name: 'Test', email: 'test@example.com' });

    expect(order.id).toBeTruthy();
    expect(order.createdAt).toBeTruthy();
    expect(order.name).toBe('Test');

    const stored = service.getOrders();
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe(order.id);
  });

  it('should return an empty order list when none exist', () => {
    expect(service.getOrders()).toEqual([]);
  });
});