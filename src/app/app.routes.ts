import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
  },
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./features/leaderboard/leaderboard').then(m => m.LeaderboardComponent),
  },
  {
    path: 'upload',
    loadComponent: () =>
      import('./features/csv-upload/csv-upload').then(m => m.CsvUploadComponent),
  },
  {
    path: 'specials',
    loadComponent: () =>
      import('./features/manage-specials/manage-specials').then(m => m.ManageSpecialsComponent),
  },
];
