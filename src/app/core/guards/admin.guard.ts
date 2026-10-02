import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {

    console.warn(
      '🔒 Accès refusé : utilisateur non connecté'
    );

    return router.createUrlTree(['/login']);
  }

  if (!authService.isAdmin()) {

    console.warn(
      '⛔ Accès refusé : rôle ADMIN requis'
    );

    authService.logout();

    return router.createUrlTree(['/login']);
  }

  return true;
};
