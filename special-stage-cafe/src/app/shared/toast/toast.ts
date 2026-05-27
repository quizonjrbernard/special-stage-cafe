import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed right-6 bottom-6 z-50 space-y-2">
      <div *ngFor="let t of ns.toastQueue()" class="w-80">
        <div class="rounded-lg bg-slate-900 text-white p-3 shadow-lg">
          <div class="font-semibold">Notification</div>
          <div class="text-sm mt-1">{{ t.message }}</div>
        </div>
      </div>
    </div>
  `,
})
export class ToastComponent {
  ns = inject(NotificationService);
}
