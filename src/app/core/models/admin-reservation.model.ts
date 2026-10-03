export type ReservationStatus =
  | 'EN_ATTENTE'
  | 'CONFIRMEE'
  | 'ANNULEE'
  | 'TERMINEE';

export interface AdminReservation {
  idReservation: string;

  // ==============================
  // PASSAGER
  // ==============================

  passagerId?: string | null;
  passagerNom?: string | null;
  passagerPrenom?: string | null;
  passagerEmail?: string | null;
  passagerTelephone?: string | null;
  passagerPhotoUrl?: string | null;

  // ==============================
  // TRAJET
  // ==============================

  trajetId?: string | null;

  // ==============================
  // CHAUFFEUR
  // ==============================

  chauffeurId?: string | null;
  chauffeurNom?: string | null;
  chauffeurPrenom?: string | null;
  chauffeurEmail?: string | null;
  chauffeurPhotoUrl?: string | null;

  // ==============================
  // INFORMATIONS TRAJET
  // ==============================

  villeDepart?: string | null;
  adresseDepart?: string | null;

  villeDestination?: string | null;
  adresseDestination?: string | null;

  dateDepart?: string | null;
  heureDepart?: string | null;

  prix?: number | null;

  // ==============================
  // RESERVATION
  // ==============================

  nombrePlaces: number;
  statut: ReservationStatus;

  dateCreation?: string | null;
  dateModification?: string | null;
}

export interface AdminReservationSearchRequest {
  passagerId?: string | null;
  trajetId?: string | null;
  chauffeurId?: string | null;
  statut?: ReservationStatus | null;
  dateCreation?: string | null;
  dateDepart?: string | null;
}
