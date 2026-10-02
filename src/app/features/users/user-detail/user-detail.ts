import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  AdminUserService
} from '../../../core/services/admin-user.service';

import {
  AdminUser,
  UserStatus
} from '../../../core/models/admin-user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css'
})
export class UserDetail {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly userService =
    inject(AdminUserService);

  private readonly backendUrl =
    'http://localhost:8089';

  // ==============================
  // DONNÉES
  // ==============================

  changingStatus = signal(false);

  successMessage = signal('');

  user = signal<AdminUser | null>(null);

  loading = signal(true);

  errorMessage = signal('');

  // ==============================
  // CONSTRUCTEUR
  // ==============================

  constructor() {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {

      this.errorMessage.set(
        'Identifiant utilisateur invalide.'
      );

      this.loading.set(false);

      return;
    }

    this.loadUser(id);
  }

  // ==============================
  // CHARGER UTILISATEUR
  // ==============================

  loadUser(idUser: string): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.userService
      .getUserById(idUser)
      .subscribe({

        next: user => {

          console.log(
            '👤 Détail utilisateur Admin :',
            user
          );

          this.user.set(user);

          this.loading.set(false);
        },

        error: error => {

          console.error(
            '❌ Erreur détail utilisateur :',
            error
          );

          this.loading.set(false);

          if (error.status === 404) {

            this.errorMessage.set(
              'Utilisateur introuvable.'
            );

          } else if (error.status === 401) {

            this.errorMessage.set(
              'Votre session a expiré.'
            );

          } else if (error.status === 403) {

            this.errorMessage.set(
              'Accès administrateur refusé.'
            );

          } else {

            this.errorMessage.set(
              'Impossible de récupérer cet utilisateur.'
            );
          }
        }
      });
  }

  changeStatus(
    status: UserStatus
  ): void {

    const currentUser = this.user();

    if (!currentUser) {
      return;
    }

    if (currentUser.statusUser === status) {
      return;
    }

    const statusLabels: Record<UserStatus, string> = {
      ACTIF: 'activer',
      SUSPENDUE: 'suspendre',
      BLOQUER: 'bloquer'
    };

    const action =
      statusLabels[status];

    const confirmed = window.confirm(
      `Voulez-vous vraiment ${action} le compte de ${currentUser.prenom} ${currentUser.nom} ?`
    );

    if (!confirmed) {
      return;
    }

    this.changingStatus.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.userService
      .changeStatus(
        currentUser.idUser,
        status
      )
      .subscribe({

        next: updatedUser => {

          console.log(
            '✅ Statut utilisateur modifié :',
            updatedUser
          );

          this.user.set(
            updatedUser
          );

          this.changingStatus.set(false);

          this.successMessage.set(
            `Le compte a été ${action} avec succès.`
          );

          // Faire disparaître le message après quelques secondes
          setTimeout(() => {
            this.successMessage.set('');
          }, 4000);
        },

        error: error => {

          console.error(
            '❌ Erreur modification statut :',
            error
          );

          this.changingStatus.set(false);

          if (error.status === 401) {

            this.errorMessage.set(
              'Votre session a expiré.'
            );

          } else if (error.status === 403) {

            this.errorMessage.set(
              "Vous n'avez pas les droits nécessaires."
          );

          } else if (error.status === 404) {

            this.errorMessage.set(
              'Utilisateur introuvable.'
            );

          } else {

            this.errorMessage.set(
              'Impossible de modifier le statut de cet utilisateur.'
            );
          }
        }
      });
  }

  // ==============================
  // PHOTO
  // ==============================

  getPhotoUrl(
    photoUrl: string | null | undefined
  ): string | null {

    if (
      !photoUrl ||
      photoUrl.trim() === ''
    ) {
      return null;
    }

    const url =
      photoUrl.trim();

    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('data:')
    ) {

      return url;
    }

    if (url.startsWith('/')) {

      return `${this.backendUrl}${url}`;
    }

    return `${this.backendUrl}/${url}`;
  }

  // ==============================
  // INITIALES
  // ==============================

  getInitials(
    user: AdminUser
  ): string {

    const first =
      user.prenom?.charAt(0) ?? '';

    const last =
      user.nom?.charAt(0) ?? '';

    return (
      first + last
    ).toUpperCase();
  }

  // ==============================
  // LABEL RÔLE
  // ==============================

  getRoleLabel(
    role: AdminUser['role']
  ): string {

    switch (role) {

      case 'PASSAGER':
        return 'Passager';

      case 'CHAUFFEUR':
        return 'Chauffeur';

      case 'ADMIN':
        return 'Administrateur';

      default:
        return role;
    }
  }

  // ==============================
  // LABEL STATUT
  // ==============================

  getStatusLabel(
    status: AdminUser['statusUser']
  ): string {

    switch (status) {

      case 'ACTIF':
        return 'Actif';

      case 'SUSPENDUE':
        return 'Suspendu';

      case 'BLOQUER':
        return 'Bloqué';

      default:
        return status;
    }
  }

  // ==============================
  // RETOUR
  // ==============================

  goBack(): void {

    this.router.navigate([
      '/admin/users'
    ]);
  }
}
