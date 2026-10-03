export type DriverStatus =
  | 'ACTIF'
  | 'SUSPENDUE'
  | 'BLOQUER';

export type DriverBadge =
  | 'AUCUN'
  | 'BRONZE'
  | 'ARGENT'
  | 'OR'
  | 'PLATINE';

export interface AdminDriver {
  userId: string;

  nom: string;
  prenom: string;
  email: string;
  telephone?: string | null;
  ville?: string | null;

  photoUrl?: string | null;

  statusUser: DriverStatus;

  profileConducteurId?: string | null;

  adresse?: string | null;
  bio?: string | null;

  actif: boolean | null;

  badge?: DriverBadge | null;

  noteMoyenne?: number | null;
  totalAvis?: number | null;
  nombreTrajetsEffectues?: number | null;

  vehicule?: string | null;

  tauxAcceptation?: number | null;

  dateCreationProfile?: string | null;
  dateModificationProfile?: string | null;
}
