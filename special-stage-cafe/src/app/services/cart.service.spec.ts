import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

const sampleItem = { title: 'Latte', description: 'Milk coffee', price: 'AED 25', tags: ['drink', 'coffee'] };

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [CartService] });
    service = TestBed.inject(CartService);
  });

  it('should start with an empty cart', () => {
    expect(service.items()).toEqual([]);
    expect(service.total()).toBe(0);
  });

  it('should add items and compute total', () => {
    service.add(sampleItem);
    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(1);
    expect(service.total()).toBe(25);

    service.add(sampleItem);
    expect(service.items()[0].quantity).toBe(2);
    expect(service.total()).toBe(50);
  });

  it('should remove items and clear cart', () => {
    service.add(sampleItem);
    service.remove(sampleItem.title);
    expect(service.items()).toEqual([]);
    expect(localStorage.getItem('ssc_cart')).toBe('[]');

    service.add(sampleItem);
    service.clear();
    expect(service.items()).toEqual([]);
    expect(localStorage.getItem('ssc_cart')).toBeNull();
  });
});