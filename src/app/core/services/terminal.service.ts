import { Injectable, signal } from '@angular/core';

export interface TerminalLog {
  type: 'info' | 'success' | 'command' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  private logsSignal = signal<TerminalLog[]>([
    { type: 'info', message: 'All modules compiled successfully' },
    { type: 'success', message: 'Ready in 842ms' },
    { type: 'info', message: 'Hot reload enabled' },
  ]);

  readonly logs = this.logsSignal.asReadonly();

  log(message: string, type: TerminalLog['type'] = 'info') {
    this.logsSignal.update((logs) => [...logs, { type, message }]);

    // Auto-scroll logic happens in the component
  }

  clear() {
    this.logsSignal.set([]);
  }
}
