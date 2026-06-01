import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-csv-upload',
  imports: [ReactiveFormsModule],
  templateUrl: './csv-upload.html',
  styleUrl: './csv-upload.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsvUploadComponent {
  private readonly fb = inject(FormBuilder);
  private readonly salesService = inject(SalesService);
  private readonly router = inject(Router);

  private selectedFile: File | null = null;

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly selectedFileName = signal<string | null>(null);

  readonly form = this.fb.group({
    weekCommencing: ['', Validators.required],
  });

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;
    this.selectedFileName.set(file?.name ?? null);
  }

  onSubmit(): void {
    if (this.form.invalid || !this.selectedFile) return;

    const weekCommencing = this.form.value.weekCommencing!;
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.salesService.uploadSales(this.selectedFile, weekCommencing).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/leaderboard']);
      },
      error: (err: { message?: string }) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message ?? 'Upload failed. Please try again.');
      },
    });
  }
}
