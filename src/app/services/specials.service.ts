import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem, WeeklySpecial, WeeklySpecialRequest } from '../models/menu-item.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SpecialsService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = `${environment.apiUrl}/api`;

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiBase}/menuitem`);
  }

  getWeeklySpecials(weekCommencing: string): Observable<WeeklySpecial[]> {
    return this.http.get<WeeklySpecial[]>(
      `${this.apiBase}/weeklyspecial/week/${weekCommencing}T00:00:00Z`
    );
  }

  createWeeklySpecial(request: WeeklySpecialRequest): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiBase}/weeklyspecial`, request);
  }
}
