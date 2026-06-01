import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { SpecialsService } from '../../services/specials.service';
import {
  SpecialLevel,
  SPECIAL_LEVELS,
  ItemSelectionState,
} from '../../models/menu-item.model';

@Component({
  selector: 'app-manage-specials',
  imports: [ReactiveFormsModule],
  templateUrl: './manage-specials.html',
  styleUrl: './manage-specials.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageSpecialsComponent implements OnInit {
  private readonly specialsService = inject(SpecialsService);
  private readonly fb = inject(FormBuilder);

  readonly specialLevels = SPECIAL_LEVELS;

  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly itemStates = signal<ItemSelectionState[]>([]);

  readonly selectedCount = computed(() =>
    this.itemStates().filter(s => s.checked).length
  );

  readonly groupedItems = computed(() => {
    const groups = new Map<string, ItemSelectionState[]>();
    for (const state of this.itemStates()) {
      const dept = state.item.department;
      if (!groups.has(dept)) groups.set(dept, []);
      groups.get(dept)!.push(state);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dept, items]) => ({ dept, items }));
  });

  readonly form = this.fb.group({
    weekCommencing: ['', Validators.required],
  });

  ngOnInit(): void {
    this.isLoading.set(true);
    this.specialsService.getMenuItems().subscribe({
      next: items => {
        this.itemStates.set(
          items
            .filter(item => item.isActive)
            .map(item => ({ item, checked: false, level: 'Gold' as SpecialLevel }))
        );
        this.isLoading.set(false);
      },
      error: (err: { message?: string }) => {
        this.errorMessage.set(err.message ?? 'Failed to load menu items.');
        this.isLoading.set(false);
      },
    });
  }

  protected deptId(dept: string): string {
    return 'dept-' + dept.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  toggleItem(itemId: string): void {
    this.successMessage.set(null);
    this.itemStates.update(states =>
      states.map(s => s.item.id === itemId ? { ...s, checked: !s.checked } : s)
    );
  }

  setLevel(itemId: string, event: Event): void {
    const level = (event.target as HTMLSelectElement).value as SpecialLevel;
    this.itemStates.update(states =>
      states.map(s => s.item.id === itemId ? { ...s, level } : s)
    );
  }

  onSubmit(): void {
    if (this.form.invalid || this.selectedCount() === 0) return;

    const weekCommencing = `${this.form.value.weekCommencing}T00:00:00Z`;
    const selected = this.itemStates().filter(s => s.checked);

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    forkJoin(
      selected.map(s =>
        this.specialsService.createWeeklySpecial({
          menuItemId: s.item.id,
          specialLevel: s.level,
          weekCommencing,
          isActive: true,
        })
      )
    ).subscribe({
      next: () => {
        this.isSaving.set(false);
        const n = selected.length;
        this.successMessage.set(
          `${n} special${n > 1 ? 's' : ''} saved for the week of ${weekCommencing}.`
        );
        this.itemStates.update(states => states.map(s => ({ ...s, checked: false })));
      },
      error: (err: { message?: string }) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.message ?? 'Failed to save specials. Please try again.');
      },
    });
  }
}
