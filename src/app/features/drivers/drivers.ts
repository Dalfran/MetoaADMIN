import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  AdminDriverService
} from '../../core/services/admin-driver.service';

import {
  AdminDriver
} from '../../core/models/admin-driver.model';


@Component({
  selector: 'app-drivers',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './drivers.html',
  styleUrl: './drivers.css'
})
export class Drivers {

  private readonly driverService =
    inject(AdminDriverService);


  drivers = signal<AdminDriver[]>([]);

  loading = signal(true);

  errorMessage = signal('');


  constructor() {

    this.loadDrivers();

  }


  loadDrivers(): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.driverService
      .getDrivers()
      .subscribe({

        next: drivers => {

          console.log(
            '✅ Chauffeurs récupérés :',
            drivers
          );

          this.drivers.set(drivers);

          this.loading.set(false);
        },

        error: error => {

          console.error(
            '❌ Erreur récupération chauffeurs :',
            error
          );

          this.errorMessage.set(
            'Impossible de charger les chauffeurs.'
          );

          this.loading.set(false);
        }

      });
  }


  getPhotoUrl(
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


  getInitials(
    driver: AdminDriver
  ): string {

    return (
      `${driver.prenom?.charAt(0) ?? ''}` +
      `${driver.nom?.charAt(0) ?? ''}`
    ).toUpperCase();
  }


  getStatusLabel(
    status: AdminDriver['statusUser']
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


  getBadgeLabel(
    badge?: AdminDriver['badge'] | null
  ): string {

    if (!badge || badge === 'AUCUN') {
      return 'Aucun';
    }

    switch (badge) {

      case 'BRONZE':
        return 'Bronze';

      case 'ARGENT':
        return 'Argent';

      case 'OR':
        return 'Or';

      case 'PLATINE':
        return 'Platine';

      default:
        return badge;
    }
  }
}
