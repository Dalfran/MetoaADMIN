export type UserRole =
  | 'PASSAGER'
  | 'CHAUFFEUR'
  | 'ADMIN';

export type UserStatus =
  | 'ACTIF'
  | 'SUSPENDUE'
  | 'BLOQUER';

export type UserSexe =
  | 'HOMME'
  | 'FEMME';

export interface AdminUser {
  idUser: string;

  nom: string;
  prenom: string;

  email: string;
  telephone?: string | null;
  userName?: string | null;

  ville?: string | null;
  sexe?: UserSexe | null;

  role: UserRole;
  statusUser: UserStatus;

  dateInscription?: string | null;
  dateModification?: string | null;

  photoUrl?: string | null;
  coverPhotoUrl?: string | null;

  hasProfilePassager: boolean;
  hasProfileConducteur: boolean;
}

export interface ChangeUserStatusRequest {
  statusUser: UserStatus;
}

export interface AdminUserSearchRequest {
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  ville?: string | null;
  role?: UserRole | null;
  statusUser?: UserStatus | null;
}

