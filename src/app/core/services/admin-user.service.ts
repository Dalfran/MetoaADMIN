import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  AdminUser,
  AdminUserSearchRequest,
  ChangeUserStatusRequest,
  UserStatus
} from '../models/admin-user.model';

import {
  PageResponse
} from '../models/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8089/api/admin/users';


  /**
   * Liste paginée des utilisateurs
   */
  getUsers(
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse<AdminUser>> {

    const params =
      new HttpParams()
        .set('page', page)
        .set('size', size);

    return this.http.get<PageResponse<AdminUser>>(
      this.apiUrl,
      { params }
    );
  }


  /**
   * Récupérer un utilisateur
   */
  getUserById(
    idUser: string
  ): Observable<AdminUser> {

    return this.http.get<AdminUser>(
      `${this.apiUrl}/${idUser}`
    );
  }


  /**
   * Recherche avancée
   */
  searchUsers(
    search: AdminUserSearchRequest,
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse<AdminUser>> {

    const params =
      new HttpParams()
        .set('page', page)
        .set('size', size);

    return this.http.post<PageResponse<AdminUser>>(
      `${this.apiUrl}/search`,
      search,
      { params }
    );
  }


  /**
   * Modifier le statut
   */
  changeStatus(
    idUser: string,
    statusUser: UserStatus
  ): Observable<AdminUser> {

    const body: ChangeUserStatusRequest = {
      statusUser
    };

    return this.http.patch<AdminUser>(
      `${this.apiUrl}/${idUser}/status`,
      body
    );
  }
}
