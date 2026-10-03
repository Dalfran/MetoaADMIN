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
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  AdminReservationService
} from '../../../core/services/admin-reservation.service';

import {
  AdminReservation,
  ReservationStatus
} from '../../../core/models/admin-reservation.model';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './reservation-detail.html',
  styleUrl: './reservation-detail.css'
})
export class ReservationDetail implements OnInit {

  private readonly reservationService =
    inject(AdminReservationService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  // ==========================================================
  // DONNEES
  // ==========================================================

  reservation =
    signal<AdminReservation | null>(null);

  loading =
    signal<boolean>(true);

  errorMessage =
    signal<string | null>(null);

  // ==========================================================
  // INITIALISATION
  // ==========================================================

  ngOnInit(): void {

    const idReservation =
      this.route.snapshot.paramMap.get('id');

    if (!idReservation) {

      this.errorMessage.set(
        'Identifiant de réservation introuvable.'
      );

      this.loading.set(false);

      return;
    }

    this.loadReservation(idReservation);
  }

  // ==========================================================
  // CHARGEMENT
  // ==========================================================

  private loadReservation(
    idReservation: string
  ): void {

    this.loading.set(true);
    this.errorMessage.set(null);

    this.reservationService
      .getReservationById(idReservation)
      .subscribe({

        next: response => {

          console.log(
            '✅ Réservation récupérée :',
            response
          );

          console.log(
            '👤 Photo passager :',
            response.passagerPhotoUrl
          );

          console.log(
            '🚗 Photo chauffeur :',
            response.chauffeurPhotoUrl
          );

          console.log(
            '🖼️ URL passager résolue :',
            this.getPhotoUrl(
              response.passagerPhotoUrl
            )
          );

          console.log(
            '🖼️ URL chauffeur résolue :',
            this.getPhotoUrl(
              response.chauffeurPhotoUrl
            )
          );

          this.reservation.set(response);

          this.loading.set(false);
        },

        error: error => {

          console.error(
            '❌ Erreur chargement réservation :',
            error
          );

          this.errorMessage.set(
            'Impossible de charger les informations de cette réservation.'
          );

          this.loading.set(false);
        }

      });
  }

  // ==========================================================
  // RETOUR
  // ==========================================================

  goBack(): void {

    this.router.navigate([
      '/admin/reservations'
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
     * URL déjà complète :
     * http://...
     * https://...
     * data:...
     */
    if (
      photoUrl.startsWith('http://') ||
      photoUrl.startsWith('https://') ||
      photoUrl.startsWith('data:')
    ) {
      return photoUrl;
    }

    /*
     * URL relative commençant par /
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
 * Chemin relatif sans /
 *
 * Exemple :
 * files/users/photo.jpg
 *
 * devient :
 * http://localhost:8089/files/users/photo.jpg
 */
return `http://localhost:8089/${photoUrl}`;
}

// ==========================================================
// INITIALES PASSAGER
// ==========================================================

getPassengerInitials(): string {

  const current =
    this.reservation();

  if (!current) {
    return '?';
  }

  const prenom =
    current.passagerPrenom?.trim() ?? '';

  const nom =
    current.passagerNom?.trim() ?? '';

  return (
    `${prenom.charAt(0)}${nom.charAt(0)}`
      .toUpperCase() || '?'
  );
}

// ==========================================================
// INITIALES CHAUFFEUR
// ==========================================================

getDriverInitials(): string {

  const current =
    this.reservation();

  if (!current) {
    return '?';
  }

  const prenom =
    current.chauffeurPrenom?.trim() ?? '';

  const nom =
    current.chauffeurNom?.trim() ?? '';

  return (
    `${prenom.charAt(0)}${nom.charAt(0)}`
      .toUpperCase() || '?'
  );
}

// ==========================================================
// FORMATAGE DATE
// ==========================================================

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
      month: 'long',
      year: 'numeric'
    }
  ).format(parsedDate);
}

// ==========================================================
// FORMATAGE DATE + HEURE
// ==========================================================

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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  ).format(parsedDate);
}

// ==========================================================
// FORMATAGE PRIX
// ==========================================================

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

// ==========================================================
// FORMATAGE HEURE
// ==========================================================

formatTime(
  time: string | null | undefined
): string {

  if (!time) {
    return '-';
  }

  return time.substring(0, 5);
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

// ==========================================================
// CLASSE CSS STATUT
// ==========================================================

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
}
