import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule
} from '@angular/forms';

import {
  AdminUserService
} from '../../core/services/admin-user.service';

import {
  AdminUser,
  AdminUserSearchRequest,
  UserRole,
  UserStatus
} from '../../core/models/admin-user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {

  private readonly userService =
    inject(AdminUserService);

  private readonly fb =
    inject(FormBuilder);

  private readonly backendUrl =
    'http://localhost:8089';

  // ==============================
  // DONNÉES
  // ==============================

  users = signal<AdminUser[]>([]);

  loading = signal(true);

  errorMessage = signal('');

  currentPage = signal(0);

  pageSize = signal(10);

  totalElements = signal(0);

  totalPages = signal(0);

  // Indique si une recherche est actuellement active
  searchActive = signal(false);

  // ==============================
  // FORMULAIRE DE RECHERCHE
  // ==============================

  searchForm = this.fb.nonNullable.group({
    nom: [''],
    prenom: [''],
    email: [''],
    ville: [''],
    role: ['' as UserRole | ''],
    statusUser: ['' as UserStatus | '']
  });

  // ==============================
  // CONSTRUCTEUR
  // ==============================

  constructor() {
    this.loadUsers();
  }

  // ==============================
  // CHARGER TOUS LES UTILISATEURS
  // ==============================

  loadUsers(): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.userService
      .getUsers(
        this.currentPage(),
        this.pageSize()
      )
      .subscribe({

        next: response => {

          console.log(
            '👥 Utilisateurs Admin :',
            response
          );

          this.users.set(
            response.content
          );

          this.totalElements.set(
            response.page.totalElements
          );

          this.totalPages.set(
            response.page.totalPages
          );

          this.currentPage.set(
            response.page.number
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            '❌ Erreur utilisateurs Admin :',
            error
          );

          this.loading.set(false);

          if (error.status === 401) {

            this.errorMessage.set(
              'Votre session a expiré.'
            );

          } else if (error.status === 403) {

            this.errorMessage.set(
              'Accès administrateur refusé.'
            );

          } else {

            this.errorMessage.set(
              'Impossible de récupérer les utilisateurs.'
            );
          }
        }
      });
  }

  // ==============================
  // RECHERCHER
  // ==============================

  searchUsers(): void {

    const formValue =
      this.searchForm.getRawValue();

    const search: AdminUserSearchRequest = {

      nom:
        formValue.nom.trim() || null,

      prenom:
        formValue.prenom.trim() || null,

      email:
        formValue.email.trim() || null,

      ville:
        formValue.ville.trim() || null,

      role:
        formValue.role || null,

      statusUser:
        formValue.statusUser || null
    };

    // Vérifier si au moins un filtre est utilisé
    const hasSearchCriteria =
      Object.values(search).some(
        value =>
          value !== null &&
          value !== undefined &&
          value !== ''
      );

    // Aucun critère
    if (!hasSearchCriteria) {

      this.resetSearch();

      return;
    }

    console.log(
      '🔎 Recherche utilisateurs :',
      search
    );

    this.searchActive.set(true);

    // Une nouvelle recherche recommence à la première page
    this.currentPage.set(0);

    this.loading.set(true);

    this.errorMessage.set('');

    this.userService
      .searchUsers(
        search,
        0,
        this.pageSize()
      )
      .subscribe({

        next: response => {

          console.log(
            '🔎 Résultats recherche :',
            response
          );

          this.users.set(
            response.content
          );

          this.totalElements.set(
            response.page.totalElements
          );

          this.totalPages.set(
            response.page.totalPages
          );

          this.currentPage.set(
            response.page.number
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            '❌ Erreur recherche utilisateurs :',
            error
          );

          this.loading.set(false);

          if (error.status === 401) {

            this.errorMessage.set(
              'Votre session a expiré.'
            );

          } else if (error.status === 403) {

            this.errorMessage.set(
              'Accès administrateur refusé.'
            );

          } else {

            this.errorMessage.set(
              'Impossible d effectuer la recherche.'
          );
          }
        }
      });
  }

  // ==============================
  // RÉINITIALISER LA RECHERCHE
  // ==============================

  resetSearch(): void {

    console.log(
      '🔄 Réinitialisation de la recherche'
    );

    this.searchForm.reset({
      nom: '',
      prenom: '',
      email: '',
      ville: '',
      role: '',
      statusUser: ''
    });

    this.searchActive.set(false);

    this.currentPage.set(0);

    this.loadUsers();
  }

  // ==============================
  // PAGINATION
  // ==============================

  nextPage(): void {

    if (
      this.currentPage() <
      this.totalPages() - 1
    ) {

      this.currentPage.update(
        page => page + 1
      );

      this.loadCurrentPage();
    }
  }

  previousPage(): void {

    if (
      this.currentPage() > 0
    ) {

      this.currentPage.update(
        page => page - 1
      );

      this.loadCurrentPage();
    }
  }

  goToPage(page: number): void {

    if (
      page >= 0 &&
      page < this.totalPages()
    ) {

      this.currentPage.set(page);

      this.loadCurrentPage();
    }
  }

  // ==============================
  // CHARGER LA PAGE COURANTE
  // ==============================

  private loadCurrentPage(): void {

    if (this.searchActive()) {

      const formValue =
        this.searchForm.getRawValue();

      const search: AdminUserSearchRequest = {

        nom:
          formValue.nom.trim() || null,

        prenom:
          formValue.prenom.trim() || null,

        email:
          formValue.email.trim() || null,

        ville:
          formValue.ville.trim() || null,

        role:
          formValue.role || null,

        statusUser:
          formValue.statusUser || null
      };

      this.loading.set(true);

      this.userService
        .searchUsers(
          search,
          this.currentPage(),
          this.pageSize()
        )
        .subscribe({

          next: response => {

            this.users.set(
              response.content
            );

            this.totalElements.set(
              response.page.totalElements
            );

            this.totalPages.set(
              response.page.totalPages
            );

            this.currentPage.set(
              response.page.number
            );

            this.loading.set(false);
          },

          error: error => {

            console.error(
              '❌ Erreur pagination recherche :',
              error
            );

            this.loading.set(false);

            this.errorMessage.set(
              'Impossible de charger les résultats.'
            );
          }
        });

    } else {

      this.loadUsers();
    }
  }

  // ==============================
  // AFFICHAGE PHOTO
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
  // LIBELLÉ STATUT
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
  // LIBELLÉ RÔLE
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
}
