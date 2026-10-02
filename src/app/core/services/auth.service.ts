import {
  Injectable,
  inject,
  PLATFORM_ID
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  tap
} from 'rxjs';

import {
  LoginRequest,
  LoginResponse,
  AdminAuthUser
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly platformId = inject(PLATFORM_ID);

  private readonly apiUrl =
    'http://localhost:8089/api/auth';

  private readonly TOKEN_KEY =
    'metoa_token';

  private readonly USER_KEY =
    'metoa_user';

  /**
   * Vérifie si l'application s'exécute
   * dans le navigateur.
   */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Connexion.
   */
  login(
    credentials: LoginRequest
  ): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        credentials
      )
      .pipe(

        tap(response => {

          if (!this.isBrowser()) {
            return;
          }

          if (response.token) {

            localStorage.setItem(
              this.TOKEN_KEY,
              response.token
            );
          }

          if (response.user) {

            localStorage.setItem(
              this.USER_KEY,
              JSON.stringify(response.user)
            );
          }

          console.log(
            '✅ Connexion Admin réussie'
          );
        })
      );
  }

  /**
   * Déconnexion.
   */
  logout(): void {

    if (!this.isBrowser()) {
      return;
    }

    localStorage.removeItem(
      this.TOKEN_KEY
    );

    localStorage.removeItem(
      this.USER_KEY
    );

    console.log(
      '🔐 Déconnexion Admin'
    );
  }

  /**
   * Récupération du JWT.
   */
  getToken(): string | null {

    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(
      this.TOKEN_KEY
    );
  }

  /**
   * Récupération de l'utilisateur
   * enregistré dans localStorage.
   */
  getStoredUser(): AdminAuthUser | null {

    if (!this.isBrowser()) {
      return null;
    }

    const user =
      localStorage.getItem(
        this.USER_KEY
      );

    if (!user) {
      return null;
    }

    try {

      return JSON.parse(
        user
      ) as AdminAuthUser;

    } catch {

      return null;
    }
  }

  /**
   * Vérifie si un JWT existe.
   */
  isAuthenticated(): boolean {

    return !!this.getToken();
  }

  /**
   * Vérifie que l'utilisateur connecté
   * possède le rôle ADMIN.
   */
  isAdmin(): boolean {

    if (!this.isBrowser()) {
      return false;
    }

    const user =
      this.getStoredUser();

    if (user?.role) {

      return user.role === 'ADMIN';
    }

    const token =
      this.getToken();

    if (!token) {
      return false;
    }

    try {

      const parts =
        token.split('.');

      if (parts.length !== 3) {
        return false;
      }

      const payload =
        JSON.parse(
          atob(parts[1])
        );

      return payload.role === 'ADMIN';

    } catch {

      return false;
    }
  }
}
