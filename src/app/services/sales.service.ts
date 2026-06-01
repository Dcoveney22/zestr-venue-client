import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LeaderboardEntry, StaffMember } from '../models/leaderboard.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = `${environment.apiUrl}/api`;

  readonly leaderboard = signal<LeaderboardEntry[]>([]);
  readonly uploadedWeek = signal<string>('');

  getStaff(): Observable<StaffMember[]> {
    return this.http.get<StaffMember[]>(`${this.apiBase}/staff`);
  }

  uploadSales(file: File, weekCommencing: string): Observable<LeaderboardEntry[]> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('weekCommencing', weekCommencing);
    return this.http.post<LeaderboardEntry[]>(`${this.apiBase}/sales`, formData).pipe(
      tap(data => {
        this.leaderboard.set(data);
        this.uploadedWeek.set(weekCommencing);
      })
    );
  }
}
