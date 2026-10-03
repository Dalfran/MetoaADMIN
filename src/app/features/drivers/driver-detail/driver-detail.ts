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
  AdminDriverService
} from '../../../core/services/admin-driver.service';

import {
  AdminDriver
} from '../../../core/models/admin-driver.model';

import {
  AdminDocument
} from '../../../core/models/admin-document.model';

import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-driver-detail',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './driver-detail.html',
  styleUrl: './driver-detail.css'
})
export class DriverDetail {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly driverService =
    inject(AdminDriverService);

  private readonly authService = inject(AuthService);



  showRejectModal = signal(false);

  selectedDocument = signal<AdminDocument | null>(null);

  rejectReason = signal('');

  documentActionLoading = signal(false);

  documentActionError = signal('');

  documentActionSuccess = signal('');

  driver = signal<AdminDriver | null>(null);

  documents = signal<AdminDocument[]>([]);

  loading = signal(true);

  documentsLoading = signal(false);

  errorMessage = signal('');

  documentsError = signal('');


  constructor() {

    const userId =
      this.route.snapshot.paramMap.get('id');

    if (!userId) {

      this.errorMessage.set(
        'Identifiant du chauffeur introuvable.'
      );

      this.loading.set(false);

      return;
    }

    this.loadDriver(userId);

    this.loadDocuments(userId);
  }

  openRejectModal(document: AdminDocument): void {
    this.selectedDocument.set(document);
    this.rejectReason.set('');
    this.documentActionError.set('');
    this.documentActionSuccess.set('');
    this.showRejectModal.set(true);
  }

  closeRejectModal(): void {
    if (this.documentActionLoading()) {
      return;
    }

    this.showRejectModal.set(false);
    this.selectedDocument.set(null);
    this.rejectReason.set('');
  }

  approveDocument(document: AdminDocument): void {
    const driver = this.driver();

    if (!driver) {
      this.documentActionError.set(
        'Informations du chauffeur introuvables.'
      );
      return;
    }

    const adminUser = this.authService.getCurrentUser();

    if (!adminUser?.idUser) {
      this.documentActionError.set(
        'Impossible de récupérer l’identifiant de l’administrateur.'
      );
      return;
    }

    this.documentActionLoading.set(true);
    this.documentActionError.set('');
    this.documentActionSuccess.set('');

    this.driverService
      .approveDocument(
        driver.userId,
        document.documentId,
        adminUser.idUser
      )
      .subscribe({
        next: updatedDocument => {
          console.log(
            '✅ Document approuvé :',
            updatedDocument
          );

          this.documents.update(documents =>
            documents.map(doc =>
              doc.documentId === updatedDocument.documentId
                ? updatedDocument
                : doc
            )
          );

          this.documentActionSuccess.set(
            'Le document a été approuvé avec succès.'
          );

          this.documentActionLoading.set(false);
        },

        error: error => {
          console.error(
            '❌ Erreur lors de l’approbation :',
            error
          );

          this.documentActionError.set(
            error?.error?.message ??
            'Impossible d’approuver le document.'
          );

          this.documentActionLoading.set(false);
        }
      });
  }

  confirmRejectDocument(): void {
    const driver = this.driver();
    const document = this.selectedDocument();

    if (!driver || !document) {
      this.documentActionError.set(
        'Document ou chauffeur introuvable.'
      );
      return;
    }

    const motif = this.rejectReason().trim();

    if (motif.length < 3) {
      this.documentActionError.set(
        'Le motif du rejet doit contenir au moins 3 caractères.'
      );
      return;
    }

    const adminUser = this.authService.getCurrentUser();

    if (!adminUser?.idUser) {
      this.documentActionError.set(
        'Impossible de récupérer l’identifiant de l’administrateur.'
      );
      return;
    }

    this.documentActionLoading.set(true);
    this.documentActionError.set('');
    this.documentActionSuccess.set('');

    this.driverService
      .rejectDocument(
        driver.userId,
        document.documentId,
        motif,
        adminUser.idUser
      )
      .subscribe({
        next: updatedDocument => {
          console.log(
            '❌ Document rejeté :',
            updatedDocument
          );

          this.documents.update(documents =>
            documents.map(doc =>
              doc.documentId === updatedDocument.documentId
                ? updatedDocument
                : doc
            )
          );

          this.documentActionSuccess.set(
            'Le document a été rejeté avec succès.'
          );

          this.documentActionLoading.set(false);

          this.showRejectModal.set(false);
          this.selectedDocument.set(null);
          this.rejectReason.set('');
        },

        error: error => {
          console.error(
            '❌ Erreur lors du rejet :',
            error
          );

          this.documentActionError.set(
            error?.error?.message ??
            'Impossible de rejeter le document.'
          );

          this.documentActionLoading.set(false);
        }
      });
  }

  isDocumentPending(document: AdminDocument): boolean {
    const status = document.statutVerification?.trim().toUpperCase();

    console.log(
      `📌 Document "${document.nom}" → statut =`,
      status
    );

    return status === 'EN_ATTENTE';
  }


  /**
   * Charger le chauffeur
   */
  loadDriver(userId: string): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.driverService
      .getDriverByUserId(userId)
      .subscribe({

        next: driver => {

          console.log(
            '✅ Chauffeur récupéré :',
            driver
          );

          this.driver.set(driver);

          this.loading.set(false);
        },

        error: error => {

          console.error(
            '❌ Erreur récupération chauffeur :',
            error
          );

          this.errorMessage.set(
            'Impossible de charger les informations du chauffeur.'
          );

          this.loading.set(false);
        }

      });
  }


  /**
   * Charger les documents
   */
  loadDocuments(userId: string): void {

    this.documentsLoading.set(true);

    this.documentsError.set('');

    this.driverService
      .getDriverDocuments(userId)
      .subscribe({

        next: documents => {
          console.log('✅ Documents chauffeur récupérés :', documents);

          documents.forEach(document => {
            console.log('====================================');
            console.log('📄 Document :', document.nom);
            console.log('🆔 ID :', document.documentId);
            console.log('📋 Type :', document.type);
            console.log('📌 STATUT :', document.statutVerification);
            console.log('❌ Motif :', document.motifRejet);
            console.log('🔗 URL :', document.url);
            console.log('====================================');
          });

          this.documents.set(documents);
          this.documentsLoading.set(false);
        },

        error: error => {

          console.error(
            '❌ Erreur récupération documents :',
            error
          );

          this.documentsError.set(
            'Impossible de charger les documents du chauffeur.'
          );

          this.documentsLoading.set(false);
        }

      });
  }


  /**
   * Retour vers la liste
   */
  goBack(): void {

    this.router.navigate([
      '/admin/drivers'
    ]);
  }


  /**
   * URL photo utilisateur
   */
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


  /**
   * Initiales
   */
  getInitials(
    driver: AdminDriver
  ): string {

    return (
      `${driver.prenom?.charAt(0) ?? ''}` +
      `${driver.nom?.charAt(0) ?? ''}`
    ).toUpperCase();
  }


  /**
   * Libellé statut utilisateur
   */
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


  /**
   * Libellé badge conducteur
   */
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


  /**
   * Libellé statut document
   */
  getDocumentStatusLabel(
    status: AdminDocument['statutVerification']
  ): string {

    switch (status) {

      case 'EN_ATTENTE':
        return 'En attente';

      case 'APPROUVE':
        return 'Approuvé';

      case 'REJETE':
        return 'Rejeté';

      default:
        return status;
    }
  }


  /**
   * Classe CSS statut document
   */
  getDocumentStatusClass(
    status: AdminDocument['statutVerification']
  ): string {

    switch (status) {

      case 'EN_ATTENTE':
        return 'pending';

      case 'APPROUVE':
        return 'approved';

      case 'REJETE':
        return 'rejected';

      default:
        return '';
    }
  }


  /**
   * Ouvrir un document
   */

openDocument(document: AdminDocument): void {

  if (!document.url) {
    console.error('❌ URL du document absente');
    return;
  }

  console.log('📥 Récupération du document :', document.url);

  this.driverService.downloadDocument(document.url).subscribe({

    next: response => {

      console.log(
        '✅ Document récupéré :',
        response.status,
        response.headers.get('content-type')
      );

      if (!response.body) {
        console.error('❌ Le backend a retourné un fichier vide.');
        return;
      }

      const blob = response.body;

      /*
       * Création d'une URL temporaire permettant
       * au navigateur d'afficher le fichier.
       */
      const blobUrl = URL.createObjectURL(blob);

      console.log('🔗 Blob URL créée :', blobUrl);

      /*
       * Ouverture dans un nouvel onglet.
       */
      const newWindow = window.open(
        blobUrl,
        '_blank'
      );

      if (!newWindow) {
        console.error(
          '❌ Le navigateur a bloqué l’ouverture du nouvel onglet.'
        );

        URL.revokeObjectURL(blobUrl);
        return;
      }

      /*
       * On libère l'URL temporaire après un certain délai.
       * Le délai laisse au navigateur le temps de charger le fichier.
       */
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 60000);
    },

    error: error => {

      console.error(
        '❌ Erreur lors de la récupération du document :',
        error
      );

      if (error.error instanceof Blob) {

        error.error.text().then((text: string) => {

          console.error(
            '📄 Réponse brute du backend :',
            text
          );

          try {
            const backendError = JSON.parse(text);

            console.error(
              '🚨 Message backend :',
              backendError
            );

          } catch {
            console.error(
              '⚠️ La réponse backend n’est pas du JSON valide :',
              text
            );
          }

        });

      }

      if (error.status === 401) {
        console.error('🔐 JWT absent ou expiré.');
      } else if (error.status === 403) {
        console.error('🚫 Accès interdit.');
      } else if (error.status === 404) {
        console.error('❓ Document introuvable.');
      } else if (error.status === 400) {
        console.error('⚠️ Requête rejetée par le backend.');
      } else {
        console.error(
          '❌ Erreur serveur :',
          error.status
        );
      }
    }
  });
}



  /**
   * Construire URL document
   */
  getDocumentUrl(
    url: string
  ): string {

    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('data:')
    ) {
      return url;
    }

    if (url.startsWith('/')) {
      return `http://localhost:8089${url}`;
    }

    return `http://localhost:8089/${url}`;
  }
}
