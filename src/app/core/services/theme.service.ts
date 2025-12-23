import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDark = signal(true);

  toggleTheme() {
    this.isDark.update(v => !v);
  }
}
