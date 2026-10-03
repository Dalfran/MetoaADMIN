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
  Router
} from '@angular/router';

import {
  AdminTrajetService
} from '../../../core/services/admin-trajet.service';

import {
  AdminTrajet,
  TrajetStatus
} from '../../../core/models/admin-trajet.model';

@Component({
  selector: 'app-trajet-detail',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './trajet-detail.html',
  styleUrl: './trajet-detail.css'
})
export class TrajetDetail {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly trajetService =
    inject(AdminTrajetService);

  trajet = signal<AdminTrajet | null>(null);

  loading = signal(true);

  errorMessage = signal('');

  constructor() {

    const idTrajet =
      this.route.snapshot.paramMap.get('id');

    if (!idTrajet) {

      this.errorMessage.set(
        'Identifiant du trajet introuvable.'
      );

      this.loading.set(false);

      return;
    }

    this.loadTrajet(idTrajet);
  }

  // =====================================================
  // CHARGEMENT
  // =====================================================

  loadTrajet(idTrajet: string): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.trajetService
      .getTrajetById(idTrajet)
      .subscribe({

        next: trajet => {

          console.log(
            '✅ Trajet récupéré :',
            trajet
          );

          this.trajet.set(trajet);

          this.loading.set(false);
        },

        error: error => {

          console.error(
            '❌ Erreur récupération trajet :',
            error
          );

          if (error?.status === 404) {

            this.errorMessage.set(
              'Le trajet demandé est introuvable.'
            );

          } else {

            this.errorMessage.set(
              'Impossible de charger les informations du trajet.'
            );
          }

          this.loading.set(false);
        }
      });
  }

  // =====================================================
  // NAVIGATION
  // =====================================================

  goBack(): void {

    this.router.navigate([
      '/admin/trajets'
    ]);
  }

  // =====================================================
  // STATUT
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

  // =====================================================
  // CHAUFFEUR
  // =====================================================

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

  // =====================================================
  // FORMATAGE
  // =====================================================

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
    date?: string | null
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
    time?: string | null
  ): string {

    if (!time) {
      return '—';
    }

    return time.substring(0, 5);
  }

  formatDateTime(
    dateTime?: string | null
  ): string {

    if (!dateTime) {
      return '—';
    }

    const datePart =
      dateTime.substring(0, 10);

    const timePart =
      dateTime.length >= 16
        ? dateTime.substring(11, 16)
        : '';

    return `${this.formatDate(datePart)}${
      timePart ? ` à ${timePart}` : ''
    }`;
  }
}
