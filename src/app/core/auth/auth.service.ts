import { Injectable, inject, signal } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  // Signal for the current user
  currentUser = signal(this.auth.currentUser);

  constructor() {
    // Keep the signal in sync with Firebase Auth state
    user(this.auth).subscribe((usr) => {
      this.currentUser.set(usr);
    });
  }

  async login(email: string, pass: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, pass);
      this.router.navigate(['/admin']);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error.code);
      return { success: false, error: error.code };
    }
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!this.currentUser();
  }
}
