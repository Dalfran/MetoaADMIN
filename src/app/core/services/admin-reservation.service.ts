import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PageResponse } from '../models/page-response.model';
import {
  AdminReservation,
  AdminReservationSearchRequest,
  ReservationStatus
} from '../models/admin-reservation.model';

@Injectable({
  providedIn: 'root'
})
export class AdminReservationService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8089/api/admin/reservations';

  // ==========================================================
  // TOUTES LES RESERVATIONS
  // ==========================================================

  getReservations(
    page = 0,
    size = 20
  ): Observable<PageResponse<AdminReservation>> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<AdminReservation>>(
      this.apiUrl,
      { params }
    );
  }

  // ==========================================================
  // RESERVATION PAR ID
  // ==========================================================

  getReservationById(
    idReservation: string
  ): Observable<AdminReservation> {

    return this.http.get<AdminReservation>(
      `${this.apiUrl}/${idReservation}`
    );
  }

  // ==========================================================
  // RECHERCHE MULTICRITERE
  // ==========================================================

  searchReservations(
    search: AdminReservationSearchRequest,
    page = 0,
    size = 20
  ): Observable<PageResponse<AdminReservation>> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.post<PageResponse<AdminReservation>>(
      `${this.apiUrl}/search`,
      search,
      { params }
    );
  }

  // ==========================================================
  // RESERVATIONS PAR STATUT
  // ==========================================================

  getReservationsByStatus(
    statut: ReservationStatus,
    page = 0,
    size = 20
  ): Observable<PageResponse<AdminReservation>> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<AdminReservation>>(
      `${this.apiUrl}/status/${statut}`,
      { params }
    );
  }
}
