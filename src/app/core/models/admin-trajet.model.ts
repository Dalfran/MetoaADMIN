export type TrajetStatus =
  | 'PLANIFIE'
  | 'EN_COURS'
  | 'TERMINE'
  | 'ANNULE';

export interface AdminTrajet {
  idTrajet: string;

  // Chauffeur
  chauffeurId?: string | null;
  chauffeurNom?: string | null;
  chauffeurPrenom?: string | null;
  chauffeurEmail?: string | null;
  chauffeurPhotoUrl?: string | null;

  // Départ
  villeDepart: string;
  adresseDepart?: string | null;

  // Destination
  villeDestination: string;
  adresseDestination?: string | null;

  // Trajet
  dateDepart: string;
  heureDepart: string;
  prix: number;
  nombrePlaces: number;
  placesDisponibles: number;
  description?: string | null;

  // Statut
  statut: TrajetStatus;

  // Dates système
  dateCreation?: string | null;
  dateModification?: string | null;
}

export interface AdminTrajetSearchRequest {
  villeDepart?: string | null;
  villeDestination?: string | null;
  chauffeurId?: string | null;
  statut?: TrajetStatus | null;
  dateDepart?: string | null;
}
