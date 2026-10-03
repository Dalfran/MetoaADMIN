import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  AdminTrajet,
  AdminTrajetSearchRequest,
  TrajetStatus
} from '../models/admin-trajet.model';

import { PageResponse } from '../models/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class AdminTrajetService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8089/api/admin/trajets';

  /**
   * Liste paginée de tous les trajets.
   */
  getTrajets(
    page = 0,
    size = 20
  ): Observable<PageResponse<AdminTrajet>> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<AdminTrajet>>(
      this.apiUrl,
      { params }
    );
  }

  /**
   * Récupère un trajet par son identifiant.
   */
  getTrajetById(
    idTrajet: string
  ): Observable<AdminTrajet> {

    return this.http.get<AdminTrajet>(
      `${this.apiUrl}/${idTrajet}`
    );
  }

  /**
   * Recherche multicritère paginée.
   */
  searchTrajets(
    search: AdminTrajetSearchRequest,
    page = 0,
    size = 20
  ): Observable<PageResponse<AdminTrajet>> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.post<PageResponse<AdminTrajet>>(
      `${this.apiUrl}/search`,
      search,
      { params }
    );
  }

  /**
   * Filtre les trajets par statut.
   */
  getTrajetsByStatus(
    statut: TrajetStatus,
    page = 0,
    size = 20
  ): Observable<PageResponse<AdminTrajet>> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<AdminTrajet>>(
      `${this.apiUrl}/status/${statut}`,
      { params }
    );
  }
}
