import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService, MenuItem } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

export type TagInput = string | string[];

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
})
export class MenuComponent {
  menuService = inject(MenuService);
  menuItems = this.menuService.menuItems;
  cart = inject(CartService);
  auth = inject(AuthService);

  // admin form model
  newItem: { title: string; description: string; price: string; tags: TagInput } = { title: '', description: '', price: 'AED 0', tags: [] };

  editing: (MenuItem & { tags: TagInput }) | null = null;

  addToCart(item: any) {
    this.cart.add(item);
  }

  decreaseQuantity(item: any) {
    this.cart.decrement(item.title);
  }

  quantity(item: any) {
    return this.cart.items().find((cartItem) => cartItem.title === item.title)?.quantity || 0;
  }

  addItem() {
    if (!this.newItem.title) return;
    const tags = this.parseTags(this.newItem.tags);
    const item: MenuItem = {
      title: this.newItem.title || 'Untitled',
      description: this.newItem.description || '',
      price: this.newItem.price || 'AED 0',
      tags: tags
    };
    this.menuService.addItem(item);
    this.menuItems = this.menuService.menuItems;
    this.newItem = { title: '', description: '', price: 'AED 0', tags: [] };
  }

  startEdit(item: MenuItem) {
    this.editing = { ...item };
  }

  saveEdit() {
    if (!this.editing) return;
    const tags = this.parseTags(this.editing.tags);
    this.menuService.updateItem(this.editing.title, { description: this.editing.description, price: this.editing.price, tags });
    this.menuItems = this.menuService.menuItems;
    this.editing = null;
  }

  private parseTags(tags: TagInput | undefined): string[] {
    if (typeof tags === 'string') {
      return tags.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return tags || [];
  }

  cancelEdit() {
    this.editing = null;
  }

  deleteItem(item: MenuItem) {
    this.menuService.deleteItem(item.title);
    this.menuItems = this.menuService.menuItems;
  }
}
