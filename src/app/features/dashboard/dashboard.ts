import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SalesService } from '../../services/sales.service';
import { SpecialsService } from '../../services/specials.service';
import { StaffMember } from '../../models/leaderboard.model';
import { MenuItem, WeeklySpecial } from '../../models/menu-item.model';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly salesService = inject(SalesService);
  private readonly specialsService = inject(SpecialsService);

  readonly staffLoading = signal(false);
  readonly staffError = signal<string | null>(null);
  readonly staff = signal<StaffMember[]>([]);

  readonly menuLoading = signal(false);
  readonly menuError = signal<string | null>(null);
  readonly menuItems = signal<MenuItem[]>([]);

  readonly specialsLoading = signal(false);
  readonly specialsError = signal<string | null>(null);
  readonly specials = signal<WeeklySpecial[]>([]);
  readonly selectedWeek = signal('');

  readonly sortedStaff = computed(() =>
    [...this.staff()].sort((a, b) =>
      (a.lastName ?? '').localeCompare(b.lastName ?? '') ||
      (a.firstName ?? '').localeCompare(b.firstName ?? '')
    )
  );

  readonly sortedMenuItems = computed(() =>
    [...this.menuItems()].sort(
      (a, b) =>
        (a.department ?? '').localeCompare(b.department ?? '') ||
        (a.name ?? '').localeCompare(b.name ?? '')
    )
  );

  readonly enrichedSpecials = computed(() => {
    const itemMap = new Map(this.menuItems().map(item => [item.id, item]));
    return [...this.specials()]
      .map(s => ({ ...s, menuItem: itemMap.get(s.menuItemId) }))
      .sort((a, b) =>
        (a.specialLevel ?? '').localeCompare(b.specialLevel ?? '') ||
        (a.menuItem?.name ?? '').localeCompare(b.menuItem?.name ?? '')
      );
  });

  ngOnInit(): void {
    this.loadStaff();
    this.loadMenuItems();
  }

  private loadStaff(): void {
    this.staffLoading.set(true);
    this.salesService.getStaff().subscribe({
      next: data => {
        this.staff.set(data);
        this.staffLoading.set(false);
      },
      error: (err: { message?: string }) => {
        this.staffError.set(err.message ?? 'Failed to load staff.');
        this.staffLoading.set(false);
      },
    });
  }

  private loadMenuItems(): void {
    this.menuLoading.set(true);
    this.specialsService.getMenuItems().subscribe({
      next: data => {
        this.menuItems.set(data);
        this.menuLoading.set(false);
      },
      error: (err: { message?: string }) => {
        this.menuError.set(err.message ?? 'Failed to load menu items.');
        this.menuLoading.set(false);
      },
    });
  }

  onWeekChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.selectedWeek.set(value);
    if (value) {
      this.loadSpecials(value);
    } else {
      this.specials.set([]);
    }
  }

  private loadSpecials(week: string): void {
    this.specialsLoading.set(true);
    this.specialsError.set(null);
    this.specialsService.getWeeklySpecials(week).subscribe({
      next: data => {
        this.specials.set(data);
        this.specialsLoading.set(false);
      },
      error: (err: { message?: string }) => {
        this.specialsError.set(err.message ?? 'Failed to load specials.');
        this.specialsLoading.set(false);
      },
    });
  }
}
