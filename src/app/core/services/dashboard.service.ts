import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdminDashboard } from '../models/admin-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8089/api/admin/dashboard';

  getDashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(
      this.apiUrl
    );
  }
}
