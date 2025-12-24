import { Injectable, signal } from '@angular/core';

export type ModalType =
  | 'login'
  | 'edit-profile'
  | 'edit-skills'
  | 'edit-projects'
  | 'edit-contact'
  | null;

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private activeModalSignal = signal<ModalType>(null);
  readonly activeModal = this.activeModalSignal.asReadonly();

  open(type: ModalType) {
    this.activeModalSignal.set(type);
  }

  close() {
    this.activeModalSignal.set(null);
  }
}
