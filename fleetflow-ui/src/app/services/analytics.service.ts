import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);
  private readonly endpoint = `${API_BASE_URL}/analytics`;

  getKpis() {
    return this.http.get<any>(`${this.endpoint}/kpis`);
  }

  getCostReport() {
    return this.http.get<any[]>(`${this.endpoint}/cost-report`);
  }
}

