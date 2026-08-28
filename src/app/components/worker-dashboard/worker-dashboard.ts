import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {Translation} from '../../services/translation';
import {LocalStorage} from '../../services/local-storage';
import {Availability} from '../../models/provider.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-worker-dashboard',
  imports: [RouterLink, ReactiveFormsModule, MatIconModule, DatePipe],
  template: `
    @if (currentProvider(); as provider) {
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <!-- Top Banner / Navigation Header -->
        <div class="border-b border-[#E0E0D5] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-semibold uppercase tracking-wider text-[#5A5A40]">
                {{ t().workerDashboardTitle }}
              </span>
              <span class="text-[#D1D1C7]">•</span>
              <span
                class="px-2 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1"
                [class]="provider.status === 'approved' ? 'bg-[#E6F4EA] text-[#1E7E34]' : 'bg-[#FFF4E5] text-[#B45309]'"
              >
                <mat-icon class="text-xs">
                  {{ provider.status === 'approved' ? 'verified' : 'hourglass_top' }}
                </mat-icon>
                {{ provider.status === 'approved' ? t().workerApprovalApproved : t().workerApprovalPending }}
              </span>
            </div>

            <h1 id="worker-dashboard-title" class="text-2xl sm:text-3xl font-serif italic text-[#1A1A1A]" style="font-family: Georgia, serif;">
              {{ provider.fullName }}
            </h1>
            <p class="text-xs sm:text-sm text-[#5A5A40] mt-1">
              {{ t().workerDashboardSubtitle }}
            </p>
          </div>

          <div class="flex items-center gap-2 sm:gap-3 self-start sm:self-auto">
            @if (provider.status === 'approved' && isPublicVisible()) {
              <a
                id="preview-public-link"
                routerLink="/search"
                [queryParams]="{q: provider.fullName}"
                class="px-3.5 py-2 text-xs font-bold text-[#5A5A40] bg-white border border-[#D1D1C7] hover:bg-[#F0F0E8] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <mat-icon class="text-sm">visibility</mat-icon>
                <span class="hidden sm:inline">{{ t().workerPublicViewBtn }}</span>
                <span class="sm:hidden">Directory</span>
              </a>
            }

            <button
              id="worker-logout-btn"
              type="button"
              (click)="onLogout()"
              class="px-3.5 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <mat-icon class="text-sm">logout</mat-icon>
              <span>{{ t().workerLogout }}</span>
            </button>
          </div>
        </div>

        <!-- Pending Approval Alert (if status === 'pending') -->
        @if (provider.status === 'pending') {
          <div
            id="pending-status-alert"
            class="p-4 sm:p-5 bg-[#FFF9E6] border border-[#F59E0B]/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
          >
            <div class="flex items-start gap-3">
              <div class="p-2 bg-amber-100 rounded-xl text-amber-700 mt-0.5">
                <mat-icon class="text-xl">hourglass_top</mat-icon>
              </div>
              <div>
                <h3 class="font-bold text-[#1A1A1A] text-sm">
                  {{ t().workerApprovalPending }}
                </h3>
                <p class="text-xs text-[#5A5A40] mt-0.5 leading-relaxed">
                  {{ t().workerApprovalPendingNotice }}
                </p>
              </div>
            </div>
            <a
              routerLink="/admin"
              class="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shrink-0 whitespace-nowrap transition-colors"
            >
              Admin Preview
            </a>
          </div>
        }

        <!-- 1. Profile Summary Card -->
        <div id="profile-summary-card" class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0E0D5] shadow-xs">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#E0E0D5]">
            <div class="flex items-center gap-4 sm:gap-5">
              <img
                [src]="provider.photoUrl"
                alt="Provider profile photo"
                referrerpolicy="no-referrer"
                class="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl object-cover border-2 border-[#E0E0D5] shadow-xs"
              />
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="text-xl sm:text-2xl font-serif italic text-[#1A1A1A]" style="font-family: Georgia, serif;">
                    {{ provider.fullName }}
                  </h2>
                  <span
                    class="px-2.5 py-0.5 rounded-full text-xs font-bold"
                    [class]="provider.status === 'approved' ? 'bg-[#E6F4EA] text-[#1E7E34]' : 'bg-[#FFF4E5] text-[#B45309]'"
                  >
                    {{ provider.status === 'approved' ? t().workerApprovalApproved : t().workerApprovalPending }}
                  </span>
                </div>

                <p class="text-sm font-semibold text-[#5A5A40]">
                  {{ translation.translateSkill(provider.skill) }}
                  @if (provider.customSkill) {
                    <span> ({{ provider.customSkill }})</span>
                  }
                </p>

                <div class="flex flex-wrap items-center gap-3 text-xs text-[#5A5A40] pt-1">
                  <span class="flex items-center gap-1">
                    <mat-icon class="text-sm text-[#5A5A40]">location_on</mat-icon>
                    <span>{{ provider.location }}</span>
                  </span>
                  <span>•</span>
                  <span class="flex items-center gap-1 font-mono font-bold text-[#1A1A1A]">
                    <mat-icon class="text-sm text-[#5A5A40]">call</mat-icon>
                    <span>+91 {{ formatPhone(provider.phoneNumber) }}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Average Rating & Reviews Highlight -->
            <div class="bg-[#F9F9F7] rounded-2xl p-4 border border-[#E0E0D5] w-full sm:w-auto text-left sm:text-right shrink-0">
              <div class="flex sm:justify-end items-center gap-1.5">
                <span class="text-3xl font-serif font-bold text-[#1A1A1A]" style="font-family: Georgia, serif;">
                  {{ provider.averageRating > 0 ? provider.averageRating : '—' }}
                </span>
                <div class="flex text-amber-500">
                  @for (star of [1, 2, 3, 4, 5]; track star) {
                    <mat-icon class="text-lg">
                      {{ star <= provider.averageRating ? 'star' : (star - 0.5 <= provider.averageRating ? 'star_half' : 'star_border') }}
                    </mat-icon>
                  }
                </div>
              </div>
              <p class="text-xs font-semibold text-[#5A5A40] mt-0.5">
                {{ provider.reviewCount }} {{ t().reviewsCountText }}
              </p>
            </div>
          </div>

          <!-- 4. Visibility Toggle in Profile Summary -->
          <div class="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <mat-icon class="text-lg text-[#5A5A40]">visibility</mat-icon>
                <h3 class="text-sm font-bold text-[#1A1A1A]">
                  {{ t().workerVisibilityToggleTitle }}
                </h3>
              </div>
              <p class="text-xs text-[#5A5A40] max-w-xl leading-relaxed">
                {{ t().workerVisibilityDesc }}
              </p>
            </div>

            <div class="flex items-center gap-3">
              <button
                id="visibility-toggle-btn"
                type="button"
                (click)="onToggleVisibility()"
                class="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-2xs"
                [class]="isPublicVisible() ? 'bg-[#E6F4EA] text-[#1E7E34] border border-[#1E7E34]/30 hover:bg-[#d5eedd]' : 'bg-[#F0F0E8] text-[#5A5A40] border border-[#D1D1C7] hover:bg-[#e4e4dc]'"
                [attr.aria-pressed]="isPublicVisible()"
              >
                <span class="w-2.5 h-2.5 rounded-full" [class]="isPublicVisible() ? 'bg-[#1E7E34] animate-pulse' : 'bg-[#8E8E80]'"></span>
                <span>{{ isPublicVisible() ? t().workerVisibilityOn : t().workerVisibilityOff }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 5. Stats Row -->
        <div id="worker-stats-row" class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- Total Reviews -->
          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0E0D5] shadow-2xs flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-[#F0F0E8] text-[#5A5A40] flex items-center justify-center shrink-0">
              <mat-icon>forum</mat-icon>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-[#5A5A40] uppercase tracking-wider">
                {{ t().workerStatsReviews }}
              </p>
              <p class="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]" style="font-family: Georgia, serif;">
                {{ provider.reviewCount }}
              </p>
            </div>
          </div>

          <!-- Average Rating -->
          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0E0D5] shadow-2xs flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <mat-icon>star</mat-icon>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-[#5A5A40] uppercase tracking-wider">
                {{ t().workerStatsRating }}
              </p>
              <p class="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]" style="font-family: Georgia, serif;">
                {{ provider.averageRating > 0 ? provider.averageRating + ' / 5' : '—' }}
              </p>
            </div>
          </div>

          <!-- Profile Status -->
          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0E0D5] shadow-2xs flex items-center gap-3">
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              [class]="provider.status === 'approved' ? 'bg-[#E6F4EA] text-[#1E7E34]' : 'bg-[#FFF4E5] text-[#B45309]'"
            >
              <mat-icon>{{ provider.status === 'approved' ? 'verified' : 'hourglass_top' }}</mat-icon>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-[#5A5A40] uppercase tracking-wider">
                {{ t().workerStatsStatus }}
              </p>
              <p class="text-sm sm:text-base font-bold capitalize text-[#1A1A1A]">
                {{ provider.status === 'approved' ? 'Approved' : 'Pending' }}
              </p>
            </div>
          </div>

          <!-- Directory Search Visibility -->
          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0E0D5] shadow-2xs flex items-center gap-3">
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              [class]="isPublicVisible() ? 'bg-[#E6F4EA] text-[#1E7E34]' : 'bg-[#F0F0E8] text-[#5A5A40]'"
            >
              <mat-icon>{{ isPublicVisible() ? 'visibility' : 'visibility_off' }}</mat-icon>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-[#5A5A40] uppercase tracking-wider">
                {{ t().workerStatsVisibility }}
              </p>
              <p class="text-sm sm:text-base font-bold text-[#1A1A1A]">
                {{ isPublicVisible() ? t().workerVisibleLabel : t().workerHiddenLabel }}
              </p>
            </div>
          </div>
        </div>

        <!-- 3. Profile Edit Section (Auto-saves without re-approval) -->
        <div id="profile-edit-section" class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0E0D5] shadow-xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0E0D5] pb-4">
            <div>
              <h3 class="text-lg sm:text-xl font-serif italic text-[#1A1A1A]" style="font-family: Georgia, serif;">
                {{ t().workerEditTitle }}
              </h3>
              <p class="text-xs text-[#5A5A40] mt-0.5">
                {{ t().workerEditSubtitle }}
              </p>
            </div>

            <!-- Auto-save Status Badge -->
            <div class="flex items-center gap-1.5 self-start sm:self-auto">
              @if (isSaving()) {
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0F0E8] text-[#5A5A40]">
                  <mat-icon class="text-xs animate-spin">refresh</mat-icon>
                  <span>{{ t().workerSavingBadge }}</span>
                </span>
              } @else if (lastSavedTime()) {
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E6F4EA] text-[#1E7E34] border border-[#1E7E34]/20">
                  <mat-icon class="text-xs">check_circle</mat-icon>
                  <span>{{ t().workerAutoSavedBadge }} ({{ lastSavedTime() }})</span>
                </span>
              }
            </div>
          </div>

          <form [formGroup]="editForm" (ngSubmit)="onSaveProfileManually()" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <!-- Phone Number -->
              <div>
                <label for="edit-phone-input" class="block text-xs font-bold text-[#1A1A1A] mb-1">
                  {{ t().workerEditPhoneLabel }} <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-2.5 text-xs font-semibold text-[#5A5A40]">+91</span>
                  <input
                    id="edit-phone-input"
                    type="tel"
                    formControlName="phoneNumber"
                    maxlength="10"
                    (input)="triggerAutoSave()"
                    class="w-full pl-11 pr-3 py-2 text-sm font-mono bg-[#F9F9F7] border border-[#D1D1C7] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] text-[#1A1A1A]"
                  />
                </div>
                @if (editForm.get('phoneNumber')?.invalid && editForm.get('phoneNumber')?.touched) {
                  <p class="text-red-600 text-xs mt-1">{{ t().errorPhoneInvalid }}</p>
                }
              </div>

              <!-- Availability -->
              <div>
                <label for="edit-availability-select" class="block text-xs font-bold text-[#1A1A1A] mb-1">
                  {{ t().workerEditAvailabilityLabel }}
                </label>
                <select
                  id="edit-availability-select"
                  formControlName="availability"
                  (change)="triggerAutoSave()"
                  class="w-full px-3 py-2 text-sm bg-[#F9F9F7] border border-[#D1D1C7] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] text-[#1A1A1A] cursor-pointer"
                >
                  <option value="Available Now">{{ t().availNow }}</option>
                  <option value="Available Today">{{ t().availToday }}</option>
                  <option value="Available This Week">{{ t().availThisWeek }}</option>
                </select>
              </div>

              <!-- Location -->
              <div>
                <label for="edit-location-input" class="block text-xs font-bold text-[#1A1A1A] mb-1">
                  {{ t().workerEditLocationLabel }} <span class="text-red-500">*</span>
                </label>
                <input
                  id="edit-location-input"
                  type="text"
                  formControlName="location"
                  (input)="triggerAutoSave()"
                  [placeholder]="t().locationInputPlaceholder"
                  class="w-full px-3 py-2 text-sm bg-[#F9F9F7] border border-[#D1D1C7] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] text-[#1A1A1A]"
                />
                @if (editForm.get('location')?.invalid && editForm.get('location')?.touched) {
                  <p class="text-red-600 text-xs mt-1">{{ t().errorLocationRequired }}</p>
                }
              </div>
            </div>

            <!-- Optional Bio Note -->
            <div>
              <label for="edit-bio-input" class="block text-xs font-bold text-[#1A1A1A] mb-1">
                {{ t().bioLabel }}
              </label>
              <textarea
                id="edit-bio-input"
                rows="2"
                formControlName="bio"
                (input)="triggerAutoSave()"
                [placeholder]="t().bioPlaceholder"
                class="w-full px-3 py-2 text-sm bg-[#F9F9F7] border border-[#D1D1C7] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] text-[#1A1A1A] resize-none"
              ></textarea>
            </div>

            <div class="flex items-center justify-between pt-2">
              <span class="text-xs text-[#5A5A40] italic">
                * Note: Changes to phone, availability, and location are saved instantly without interrupting your approval status.
              </span>
              <button
                id="save-profile-btn"
                type="submit"
                [disabled]="editForm.invalid || isSaving()"
                class="px-5 py-2 bg-[#5A5A40] hover:bg-[#444430] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors disabled:opacity-50"
              >
                {{ t().workerSaveBtn }}
              </button>
            </div>
          </form>
        </div>

        <!-- 2. My Reviews Section -->
        <div id="worker-reviews-section" class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0E0D5] shadow-xs space-y-6">
          <div class="flex items-center justify-between border-b border-[#E0E0D5] pb-4">
            <div>
              <h3 class="text-lg sm:text-xl font-serif italic text-[#1A1A1A]" style="font-family: Georgia, serif;">
                {{ t().workerReviewsTitle }}
              </h3>
              <p class="text-xs text-[#5A5A40] mt-0.5">
                {{ providerReviews().length }} {{ t().reviewsCountText }} received (sorted most recent first)
              </p>
            </div>

            @if (providerReviews().length > 0) {
              <div class="flex items-center gap-1 text-xs font-bold text-[#5A5A40]">
                <mat-icon class="text-amber-500 text-base">star</mat-icon>
                <span>{{ provider.averageRating }} Average</span>
              </div>
            }
          </div>

          @if (providerReviews().length === 0) {
            <!-- Empty state -->
            <div class="text-center py-10 px-4 bg-[#F9F9F7] rounded-2xl border border-dashed border-[#D1D1C7] space-y-2">
              <mat-icon class="text-4xl text-[#8E8E80]">rate_review</mat-icon>
              <h4 class="font-bold text-[#1A1A1A] text-sm">{{ t().noReviewsYet }}</h4>
              <p class="text-xs text-[#5A5A40] max-w-sm mx-auto">
                {{ t().workerNoReviews }}
              </p>
            </div>
          } @else {
            <!-- List of all reviews received -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (rev of providerReviews(); track rev.id) {
                <div class="p-4 bg-[#F9F9F7] rounded-2xl border border-[#E0E0D5] space-y-2.5">
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-full bg-[#E0E0D5] text-[#5A5A40] flex items-center justify-center text-xs font-bold">
                        <mat-icon class="text-sm">person</mat-icon>
                      </div>
                      <div>
                        <p class="text-xs font-bold text-[#1A1A1A]">{{ rev.reviewerName }}</p>
                        <p class="text-[10px] text-[#8E8E80]">{{ rev.createdAt | date: 'mediumDate' }}</p>
                      </div>
                    </div>

                    <!-- Stars -->
                    <div class="flex text-amber-500">
                      @for (s of [1, 2, 3, 4, 5]; track s) {
                        <mat-icon class="text-xs">
                          {{ s <= rev.rating ? 'star' : 'star_border' }}
                        </mat-icon>
                      }
                    </div>
                  </div>

                  @if (rev.comment) {
                    <p class="text-xs text-[#5A5A40] leading-relaxed italic bg-white p-3 rounded-xl border border-[#E0E0D5]/70">
                      "{{ rev.comment }}"
                    </p>
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class WorkerDashboard {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly storage = inject(LocalStorage);
  readonly translation = inject(Translation);

  readonly t = () => this.translation.t();

  readonly currentProvider = computed(() => this.storage.loggedInProvider());

  readonly isPublicVisible = computed(() => {
    const p = this.currentProvider();
    if (!p) return true;
    return p.isPublicVisible !== false;
  });

  readonly providerReviews = computed(() => {
    const p = this.currentProvider();
    if (!p) return [];
    return this.storage.getReviewsForProvider(p.id);
  });

  readonly isSaving = signal<boolean>(false);
  readonly lastSavedTime = signal<string>('');
  private autoSaveTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly editForm = this.fb.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    availability: ['Available Now' as Availability, Validators.required],
    location: ['', Validators.required],
    bio: [''],
  });

  constructor() {
    // Verification requirement: If not logged in, redirect immediately to /worker-login
    const provider = this.currentProvider();
    if (!provider) {
      this.router.navigate(['/worker-login']);
      return;
    }

    // Populate initial values
    this.editForm.patchValue({
      phoneNumber: provider.phoneNumber,
      availability: provider.availability,
      location: provider.location,
      bio: provider.bio || '',
    });
  }

  formatPhone(phone: string): string {
    if (!phone) return '';
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 10) {
      return `${clean.slice(0, 5)} ${clean.slice(5)}`;
    }
    return phone;
  }

  async onToggleVisibility(): Promise<void> {
    const p = this.currentProvider();
    if (!p) return;

    await this.storage.toggleProviderVisibility(p.id);
    this.recordSaveSuccess();
  }

  triggerAutoSave(): void {
    if (this.editForm.invalid) return;

    this.isSaving.set(true);

    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    this.autoSaveTimeout = setTimeout(() => {
      this.saveFormValues();
    }, 600);
  }

  onSaveProfileManually(): void {
    if (this.editForm.invalid) return;
    this.saveFormValues();
  }

  private async saveFormValues(): Promise<void> {
    const p = this.currentProvider();
    if (!p) return;

    const values = this.editForm.value;
    await this.storage.updateProviderProfile(p.id, {
      phoneNumber: values.phoneNumber || undefined,
      availability: (values.availability as Availability) || undefined,
      location: values.location || undefined,
      bio: values.bio || undefined,
    });

    this.isSaving.set(false);
    this.recordSaveSuccess();
  }

  private recordSaveSuccess(): void {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
    this.lastSavedTime.set(timeStr);
  }

  onLogout(): void {
    this.storage.logoutWorker();
    this.router.navigate(['/worker-login']);
  }
}
