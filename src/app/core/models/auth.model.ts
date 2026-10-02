export interface LoginRequest {
  email: string;
  passe: string;
}

export interface LoginResponse {
  token: string;
  user?: AdminAuthUser;
}

export interface AdminAuthUser {
  idUser: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  photoUrl?: string;
  coverPhotoUrl?: string;
}
