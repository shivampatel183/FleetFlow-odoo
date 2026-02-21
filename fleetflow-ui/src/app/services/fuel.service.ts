import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class FuelService {
  private http = inject(HttpClient);
  private readonly endpoint = `${API_BASE_URL}/fuel`;

  getAll() {
    return this.http.get<any[]>(this.endpoint);
  }

  create(payload: any) {
    return this.http.post(this.endpoint, payload);
  }

  update(id: number, payload: any) {
    return this.http.put(`${this.endpoint}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.endpoint}/${id}`);
  }
}

