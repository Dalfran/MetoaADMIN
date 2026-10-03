import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  AdminTrajetService
} from '../../core/services/admin-trajet.service';

import {
  AdminTrajet,
  AdminTrajetSearchRequest,
  TrajetStatus
} from '../../core/models/admin-trajet.model';

@Component({
  selector: 'app-trajets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './trajets.html',
  styleUrl: './trajets.css'
})
export class Trajets {

  private readonly trajetService =
    inject(AdminTrajetService);

  private readonly router =
    inject(Router);

  // =====================================================
  // DONNÉES
  // =====================================================

  trajets = signal<AdminTrajet[]>([]);

  loading = signal(true);

  errorMessage = signal('');

  // =====================================================
  // PAGINATION
  // =====================================================

  currentPage = signal(0);

  pageSize = signal(20);

  totalElements = signal(0);

  totalPages = signal(0);

  // =====================================================
  // FILTRES
  // =====================================================

  villeDepart = '';

  villeDestination = '';

  chauffeurId = '';

  statut: TrajetStatus | '' = '';

  dateDepart = '';

  // =====================================================
  // STATUTS
  // =====================================================

  readonly statuts: {
    value: TrajetStatus;
    label: string;
  }[] = [
    {
      value: 'PLANIFIE',
      label: 'Planifié'
    },
    {
      value: 'EN_COURS',
      label: 'En cours'
    },
    {
      value: 'TERMINE',
      label: 'Terminé'
    },
    {
      value: 'ANNULE',
      label: 'Annulé'
    }
  ];

  constructor() {
    this.loadTrajets();
  }

  // =====================================================
  // CHARGEMENT
  // =====================================================

  loadTrajets(): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.trajetService
      .getTrajets(
        this.currentPage(),
        this.pageSize()
      )
      .subscribe({

        next: response => {

          console.log(
            '🛣️ Trajets Admin :',
            response
          );

          this.trajets.set(
            response.content
          );

          this.totalElements.set(
            response.page.totalElements
          );

          this.totalPages.set(
            response.page.totalPages
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            '❌ Erreur chargement trajets :',
            error
          );

          this.errorMessage.set(
            'Impossible de charger les trajets.'
          );

          this.loading.set(false);
        }
      });
  }

  // =====================================================
  // RECHERCHE
  // =====================================================

  search(): void {

    this.currentPage.set(0);

    const searchRequest:
      AdminTrajetSearchRequest = {

      villeDepart:
        this.villeDepart.trim() || null,

      villeDestination:
        this.villeDestination.trim() || null,

      chauffeurId:
        this.chauffeurId.trim() || null,

      statut:
        this.statut || null,

      dateDepart:
        this.dateDepart || null
    };

    const hasFilters =
      Object.values(searchRequest)
        .some(value =>
          value !== null &&
          value !== undefined &&
          value !== ''
        );

    if (!hasFilters) {
      this.loadTrajets();
      return;
    }

    this.loading.set(true);

    this.errorMessage.set('');

    this.trajetService
      .searchTrajets(
        searchRequest,
        this.currentPage(),
        this.pageSize()
      )
      .subscribe({

        next: response => {

          console.log(
            '🔎 Résultat recherche trajets :',
            response
          );

          this.trajets.set(
            response.content
          );

          this.totalElements.set(
            response.page.totalElements
          );

          this.totalPages.set(
            response.page.totalPages
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            '❌ Erreur recherche trajets :',
            error
          );

          this.errorMessage.set(
            'Impossible d’effectuer la recherche.'
          );

          this.loading.set(false);
        }
      });
  }

  // =====================================================
  // RÉINITIALISATION
  // =====================================================

  resetFilters(): void {

    this.villeDepart = '';

    this.villeDestination = '';

    this.chauffeurId = '';

    this.statut = '';

    this.dateDepart = '';

    this.currentPage.set(0);

    this.loadTrajets();
  }

  // =====================================================
  // PAGINATION
  // =====================================================

  goToPage(page: number): void {

    if (
      page < 0 ||
      page >= this.totalPages()
    ) {
      return;
    }

    this.currentPage.set(page);

    this.loadCurrentPage();
  }

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

    if (this.currentPage() > 0) {

      this.currentPage.update(
        page => page - 1
      );

      this.loadCurrentPage();
    }
  }

  loadCurrentPage(): void {

    const hasFilters =
      this.villeDepart.trim() !== '' ||
      this.villeDestination.trim() !== '' ||
      this.chauffeurId.trim() !== '' ||
      this.statut !== '' ||
      this.dateDepart !== '';

    if (hasFilters) {

      const searchRequest:
        AdminTrajetSearchRequest = {

        villeDepart:
          this.villeDepart.trim() || null,

        villeDestination:
          this.villeDestination.trim() || null,

        chauffeurId:
          this.chauffeurId.trim() || null,

        statut:
          this.statut || null,

        dateDepart:
          this.dateDepart || null
      };

      this.loading.set(true);

      this.trajetService
        .searchTrajets(
          searchRequest,
          this.currentPage(),
          this.pageSize()
        )
        .subscribe({

          next: response => {

            this.trajets.set(
              response.content
            );

            this.totalElements.set(
              response.page.totalElements
            );

            this.totalPages.set(
              response.page.totalPages
            );

            this.loading.set(false);
          },

          error: error => {

            console.error(
              '❌ Erreur pagination recherche :',
              error
            );

            this.errorMessage.set(
              'Impossible de charger les trajets.'
            );

            this.loading.set(false);
          }
        });

    } else {

      this.loadTrajets();
    }
  }

  // =====================================================
  // DÉTAIL
  // =====================================================

  viewTrajet(
    trajet: AdminTrajet
  ): void {

    this.router.navigate([
      '/admin/trajets',
      trajet.idTrajet
    ]);
  }

  // =====================================================
  // AFFICHAGE
  // =====================================================

  getStatusLabel(
    status: TrajetStatus
  ): string {

    switch (status) {

      case 'PLANIFIE':
        return 'Planifié';

      case 'EN_COURS':
        return 'En cours';

      case 'TERMINE':
        return 'Terminé';

      case 'ANNULE':
        return 'Annulé';

      default:
        return status;
    }
  }

  getStatusClass(
    status: TrajetStatus
  ): string {

    switch (status) {

      case 'PLANIFIE':
        return 'planned';

      case 'EN_COURS':
        return 'ongoing';

      case 'TERMINE':
        return 'completed';

      case 'ANNULE':
        return 'cancelled';

      default:
        return '';
    }
  }

  getDriverInitials(
    trajet: AdminTrajet
  ): string {

    const prenom =
      trajet.chauffeurPrenom?.charAt(0) ?? '';

    const nom =
      trajet.chauffeurNom?.charAt(0) ?? '';

    return (
      prenom + nom
    ).toUpperCase();
  }

  getDriverPhotoUrl(
    photoUrl?: string | null
  ): string | null {

    if (!photoUrl) {
      return null;
    }

    if (
      photoUrl.startsWith('http://') ||
      photoUrl.startsWith('https://') ||
      photoUrl.startsWith('data:')
    ) {
      return photoUrl;
    }

    if (photoUrl.startsWith('/')) {
      return `http://localhost:8089${photoUrl}`;
    }

    return `http://localhost:8089/${photoUrl}`;
  }

  formatPrice(
    price: number
  ): string {

    return new Intl.NumberFormat(
      'fr-FR',
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }
    ).format(price);
  }

  formatDate(
    date: string
  ): string {

    if (!date) {
      return '—';
    }

    const parts =
      date.split('-');

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  formatTime(
    time: string
  ): string {

    if (!time) {
      return '—';
    }

    return time.substring(0, 5);
  }

  getPaginationPages(): number[] {

    const total =
      this.totalPages();

    const current =
      this.currentPage();

    if (total <= 7) {
      return Array.from(
        { length: total },
        (_, index) => index
      );
    }

    if (current <= 3) {
      return [
        0,
        1,
        2,
        3,
        4,
        -1,
        total - 1
      ];
    }

    if (current >= total - 4) {
      return [
        0,
        -1,
        total - 5,
        total - 4,
        total - 3,
        total - 2,
        total - 1
      ];
    }

    return [
      0,
      -1,
      current - 1,
      current,
      current + 1,
      -1,
      total - 1
    ];
  }
}
