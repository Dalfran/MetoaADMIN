import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import {
  AdminReservationService
} from '../../core/services/admin-reservation.service';

import {
  AdminReservation,
  AdminReservationSearchRequest,
  ReservationStatus
} from '../../core/models/admin-reservation.model';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css'
})
export class Reservations implements OnInit {

  private readonly reservationService =
    inject(AdminReservationService);

  private readonly router =
    inject(Router);

  // ==========================================================
  // DONNEES
  // ==========================================================

  reservations =
    signal<AdminReservation[]>([]);

  loading =
    signal<boolean>(false);

  errorMessage =
    signal<string | null>(null);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  currentPage =
    signal<number>(0);

  pageSize =
    signal<number>(20);

  totalElements =
    signal<number>(0);

  totalPages =
    signal<number>(0);

  // ==========================================================
  // FILTRES
  // ==========================================================

  passagerId = '';

  trajetId = '';

  chauffeurId = '';

  statut: ReservationStatus | '' = '';

  dateCreation = '';

  dateDepart = '';

  // ==========================================================
  // OPTIONS STATUT
  // ==========================================================

  readonly statusOptions: ReservationStatus[] = [
    'EN_ATTENTE',
    'CONFIRMEE',
    'ANNULEE',
    'TERMINEE'
  ];

  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {
    this.loadReservations();
  }

  // ==========================================================
  // CHARGEMENT
  // ==========================================================

  loadReservations(): void {

    this.loading.set(true);
    this.errorMessage.set(null);

    this.reservationService
      .getReservations(
        this.currentPage(),
        this.pageSize()
      )
      .subscribe({

        next: response => {

          this.reservations.set(
            response.content ?? []
          );

          this.totalElements.set(
            response.page?.totalElements ?? 0
          );

          this.totalPages.set(
            response.page?.totalPages ?? 0
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            '❌ Erreur chargement réservations :',
            error
          );

          this.errorMessage.set(
            'Impossible de charger les réservations.'
          );

          this.loading.set(false);
        }

      });
  }

  // ==========================================================
  // RECHERCHE
  // ==========================================================

  search(): void {

    const searchRequest:
      AdminReservationSearchRequest = {

      passagerId:
        this.passagerId.trim() || null,

      trajetId:
        this.trajetId.trim() || null,

      chauffeurId:
        this.chauffeurId.trim() || null,

      statut:
        this.statut || null,

      dateCreation:
        this.dateCreation || null,

      dateDepart:
        this.dateDepart || null
    };

    const hasFilter =
      !!searchRequest.passagerId ||
      !!searchRequest.trajetId ||
      !!searchRequest.chauffeurId ||
      !!searchRequest.statut ||
      !!searchRequest.dateCreation ||
      !!searchRequest.dateDepart;

    if (!hasFilter) {

      this.currentPage.set(0);

      this.loadReservations();

      return;
    }

    this.currentPage.set(0);

    this.loading.set(true);
    this.errorMessage.set(null);

    this.reservationService
      .searchReservations(
        searchRequest,
        0,
        this.pageSize()
      )
      .subscribe({

        next: response => {

          this.reservations.set(
            response.content ?? []
          );

          this.totalElements.set(
            response.page?.totalElements ?? 0
          );

          this.totalPages.set(
            response.page?.totalPages ?? 0
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            '❌ Erreur recherche réservations :',
            error
          );

          this.errorMessage.set(
            'Erreur lors de la recherche des réservations.'
          );

          this.loading.set(false);
        }

      });
  }

  // ==========================================================
  // REINITIALISATION
  // ==========================================================

  resetFilters(): void {

    this.passagerId = '';

    this.trajetId = '';

    this.chauffeurId = '';

    this.statut = '';

    this.dateCreation = '';

    this.dateDepart = '';

    this.currentPage.set(0);

    this.loadReservations();
  }

  // ==========================================================
  // PAGINATION
  // ==========================================================

  previousPage(): void {

    if (this.currentPage() <= 0) {
      return;
    }

    this.currentPage.update(
      page => page - 1
    );

    this.loadCurrentPage();
  }

  nextPage(): void {

    if (
      this.currentPage() >=
      this.totalPages() - 1
    ) {
      return;
    }

    this.currentPage.update(
      page => page + 1
    );

    this.loadCurrentPage();
  }

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

  private loadCurrentPage(): void {

    const hasFilter =
      !!this.passagerId.trim() ||
      !!this.trajetId.trim() ||
      !!this.chauffeurId.trim() ||
      !!this.statut ||
      !!this.dateCreation ||
      !!this.dateDepart;

    if (hasFilter) {

      const searchRequest:
        AdminReservationSearchRequest = {

        passagerId:
          this.passagerId.trim() || null,

        trajetId:
          this.trajetId.trim() || null,

        chauffeurId:
          this.chauffeurId.trim() || null,

        statut:
          this.statut || null,

        dateCreation:
          this.dateCreation || null,

        dateDepart:
          this.dateDepart || null
      };

      this.loading.set(true);

      this.reservationService
        .searchReservations(
          searchRequest,
          this.currentPage(),
          this.pageSize()
        )
        .subscribe({

          next: response => {

            this.reservations.set(
              response.content ?? []
            );

            this.totalElements.set(
              response.page?.totalElements ?? 0
            );

            this.totalPages.set(
              response.page?.totalPages ?? 0
            );

            this.loading.set(false);
          },

          error: error => {

            console.error(
              '❌ Erreur chargement réservations :',
              error
            );

            this.errorMessage.set(
              'Erreur lors du chargement des réservations.'
            );

            this.loading.set(false);
          }

        });

      return;
    }

    this.loadReservations();
  }

  // ==========================================================
  // DETAIL
  // ==========================================================

  viewReservation(
    reservation: AdminReservation
  ): void {

    this.router.navigate([
      '/admin/reservations',
      reservation.idReservation
    ]);
  }

  // ==========================================================
  // URL PHOTO UTILISATEUR
  // ==========================================================

  getPhotoUrl(
    photoUrl?: string | null
  ): string | null {

    if (!photoUrl) {
      return null;
    }

    /*
     * URL déjà complète.
     */
    if (
      photoUrl.startsWith('http://') ||
      photoUrl.startsWith('https://') ||
      photoUrl.startsWith('data:')
    ) {
      return photoUrl;
    }

    /*
     * Chemin relatif commençant par /.
     *
     * Exemple :
     * /files/users/photo.jpg
     *
     * devient :
     * http://localhost:8089/files/users/photo.jpg
     */
    if (photoUrl.startsWith('/')) {
      return `http://localhost:8089${photoUrl}`;
  }

/*
 * Chemin relatif sans /.
 *
 * Exemple :
 * files/users/photo.jpg
 */
return `http://localhost:8089/${photoUrl}`;
}

// ==========================================================
// STATUT
// ==========================================================

getStatusLabel(
  statut: ReservationStatus
): string {

  switch (statut) {

    case 'EN_ATTENTE':
      return 'En attente';

    case 'CONFIRMEE':
      return 'Confirmée';

    case 'ANNULEE':
      return 'Annulée';

    case 'TERMINEE':
      return 'Terminée';

    default:
      return statut;
  }
}

getStatusClass(
  statut: ReservationStatus
): string {

  switch (statut) {

    case 'EN_ATTENTE':
      return 'status-pending';

    case 'CONFIRMEE':
      return 'status-confirmed';

    case 'ANNULEE':
      return 'status-cancelled';

    case 'TERMINEE':
      return 'status-completed';

    default:
      return '';
  }
}

// ==========================================================
// UTILITAIRES
// ==========================================================

getPassengerInitials(
  reservation: AdminReservation
): string {

  const prenom =
    reservation.passagerPrenom?.trim() ?? '';

  const nom =
    reservation.passagerNom?.trim() ?? '';

  const first =
    prenom.charAt(0);

  const second =
    nom.charAt(0);

  return (
    `${first}${second}`.toUpperCase() ||
    '?'
  );
}

getDriverInitials(
  reservation: AdminReservation
): string {

  const prenom =
    reservation.chauffeurPrenom?.trim() ?? '';

  const nom =
    reservation.chauffeurNom?.trim() ?? '';

  const first =
    prenom.charAt(0);

  const second =
    nom.charAt(0);

  return (
    `${first}${second}`.toUpperCase() ||
    '?'
  );
}

formatDate(
  date: string | null | undefined
): string {

  if (!date) {
    return '-';
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return new Intl.DateTimeFormat(
    'fr-FR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }
  ).format(parsedDate);
}

formatDateTime(
  date: string | null | undefined
): string {

  if (!date) {
    return '-';
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return new Intl.DateTimeFormat(
    'fr-FR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  ).format(parsedDate);
}

formatPrice(
  price: number | null | undefined
): string {

  if (
    price === null ||
    price === undefined
  ) {
    return '-';
  }

  return new Intl.NumberFormat(
    'fr-FR',
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  ).format(price) + ' FCFA';
}

formatTime(
  time: string | null | undefined
): string {

  if (!time) {
    return '-';
  }

  return time.substring(0, 5);
}

getPages(): number[] {

  const total =
    this.totalPages();

  return Array.from(
    { length: total },
    (_, index) => index
  );
}
}
