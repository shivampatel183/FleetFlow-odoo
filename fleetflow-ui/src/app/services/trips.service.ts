import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class TripsService {
  private http = inject(HttpClient);
  private readonly endpoint = `${API_BASE_URL}/trips`;

  getActive() {
    return this.http.get<any[]>(`${this.endpoint}/active`);
  }

  dispatch(payload: any) {
    return this.http.post(`${this.endpoint}/dispatch`, payload);
  }

  complete(id: number, endOdometer: number) {
    return this.http.post(`${this.endpoint}/${id}/complete`, endOdometer);
  }
}

