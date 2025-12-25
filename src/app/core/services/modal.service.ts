import { Injectable, signal } from '@angular/core';

export type ModalType =
  | 'login'
  | 'edit-profile'
  | 'edit-home'
  | 'edit-skills'
  | 'edit-projects'
  | 'edit-contact'
  | 'confirm'
  | null;

export interface ConfirmData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private activeModalSignal = signal<ModalType>(null);
  readonly activeModal = this.activeModalSignal.asReadonly();

  confirmData = signal<ConfirmData | null>(null);

  open(type: ModalType) {
    this.activeModalSignal.set(type);
  }

  confirm(data: ConfirmData) {
    this.confirmData.set(data);
    this.open('confirm');
  }

  close() {
    this.activeModalSignal.set(null);
    this.confirmData.set(null);
  }
}
