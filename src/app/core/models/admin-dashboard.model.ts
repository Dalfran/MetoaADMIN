export interface AdminDashboard {
  totalUsers: number;
  totalPassagers: number;
  totalChauffeurs: number;
  totalAdmins: number;

  usersActifs: number;
  usersSuspendus: number;
  usersBloques: number;

  totalTrajets: number;
  trajetsPlanifies: number;
  trajetsEnCours: number;
  trajetsTermines: number;
  trajetsAnnules: number;

  totalReservations: number;
  reservationsEnAttente: number;
  reservationsConfirmees: number;
  reservationsAnnulees: number;
  reservationsTerminees: number;

  chauffeursActifs: number;
  chauffeursInactifs: number;
}
