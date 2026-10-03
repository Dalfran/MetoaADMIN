import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdminDriver } from '../models/admin-driver.model';
import {
  AdminDocument,
  RejectDocumentRequest
} from '../models/admin-document.model';

@Injectable({
  providedIn: 'root'
})
export class AdminDriverService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8089/api/admin/drivers';

  getDrivers(): Observable<AdminDriver[]> {
    return this.http.get<AdminDriver[]>(this.apiUrl);
  }

  getDriverByUserId(userId: string): Observable<AdminDriver> {
    return this.http.get<AdminDriver>(
      `${this.apiUrl}/${userId}`
);
}

getDriverDocuments(userId: string): Observable<AdminDocument[]> {
  return this.http.get<AdminDocument[]>(
    `${this.apiUrl}/${userId}/documents`
  );
}

/**
 * Récupère réellement le fichier depuis le backend
 * avec le JWT ajouté automatiquement par l'intercepteur.
 */
downloadDocument(
  documentUrl: string
): Observable<HttpResponse<Blob>> {

  const url = documentUrl.startsWith('http://')
  || documentUrl.startsWith('https://')
    ? documentUrl
    : `http://localhost:8089${documentUrl}`;

  return this.http.get(url, {
    responseType: 'blob',
    observe: 'response'
  });
}

approveDocument(
  userId: string,
  documentId: string,
  adminId: string
): Observable<AdminDocument> {

  return this.http.patch<AdminDocument>(
    `${this.apiUrl}/${userId}/documents/${documentId}/approve`,
    null,
    {
      params: { adminId }
    }
  );
}

rejectDocument(
  userId: string,
  documentId: string,
  motifRejet: string,
  adminId: string
): Observable<AdminDocument> {

  const body: RejectDocumentRequest = {
  motifRejet
};

return this.http.patch<AdminDocument>(
  `${this.apiUrl}/${userId}/documents/${documentId}/reject`,
  body,
  {
    params: { adminId }
  }
);
}
}
