import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  DashboardService
} from '../../core/services/dashboard.service';

import {
  AdminDashboard
} from '../../core/models/admin-dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  private readonly dashboardService =
    inject(DashboardService);

  /**
   * Données du dashboard.
   */
  dashboard = signal<AdminDashboard | null>(null);

  /**
   * État de chargement.
   */
  loading = signal(true);

  /**
   * Message d'erreur.
   */
  errorMessage = signal('');

  constructor() {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.dashboardService
      .getDashboard()
      .subscribe({

        next: data => {

          console.log(
            '📊 Dashboard Admin :',
            data
          );

          /**
           * Mise à jour réactive.
           */
          this.dashboard.set(data);

          this.loading.set(false);
        },

        error: error => {

          console.error(
            '❌ Erreur Dashboard Admin :',
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
              'Impossible de récupérer les statistiques.'
            );
          }
        }
      });
  }
}
