import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="svc.modal()" class="fixed inset-0 z-60 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="relative z-70 w-full max-w-md rounded-lg bg-white p-6">
        <h3 class="text-lg font-semibold">Confirm</h3>
        <p class="mt-3 text-sm text-slate-700">{{ svc.modal()?.message }}</p>
        <div class="mt-5 flex justify-end gap-3">
          <button (click)="svc.cancel()" class="px-4 py-2 rounded bg-slate-200">Cancel</button>
          <button (click)="svc.accept()" class="px-4 py-2 rounded bg-emerald-600 text-white">Confirm</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `:host { display: block; }`
  ]
})
export class ConfirmModalComponent {
  svc = inject(ConfirmService);
}
