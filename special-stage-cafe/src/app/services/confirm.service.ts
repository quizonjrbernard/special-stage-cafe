import { Injectable, signal } from '@angular/core';

export interface ConfirmState {
  message: string;
  resolve?: (ok: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private modalSignal = signal<ConfirmState | null>(null);
  modal = this.modalSignal;

  show(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modalSignal.set({ message, resolve });
    });
  }

  accept() {
    const s = this.modalSignal();
    if (s?.resolve) s.resolve(true);
    this.modalSignal.set(null);
  }

  cancel() {
    const s = this.modalSignal();
    if (s?.resolve) s.resolve(false);
    this.modalSignal.set(null);
  }
}
