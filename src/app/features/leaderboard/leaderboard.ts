import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-leaderboard',
  imports: [RouterLink, DatePipe],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderboardComponent {
  private readonly salesService = inject(SalesService);

  readonly entries = this.salesService.leaderboard;
  readonly uploadedWeek = this.salesService.uploadedWeek;
  readonly hasData = computed(() => this.entries().length > 0);

  protected placeLabel(n: number): string {
    if (n >= 11 && n <= 13) return `${n}th`;
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  }
}
