import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {DatePipe} from '@angular/common';
import {Translation} from '../../services/translation';
import {LocalStorage} from '../../services/local-storage';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin',
  imports: [ReactiveFormsModule, RouterLink, MatIconModule, DatePipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Admin Header -->
      <div class="border-b border-[#E0E0D5] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-1.5 rounded-lg bg-[#5A5A40] text-white inline-flex items-center justify-center">
              <mat-icon class="text-xl">security</mat-icon>
            </span>
            <h1 id="admin-panel-title" class="text-2xl sm:text-3xl font-serif italic text-[#1A1A1A]" style="font-family: Georgia, serif;">
              {{ t().adminTitle }}
            </h1>
          </div>
          <p class="text-xs sm:text-sm text-[#5A5A40] mt-1">
            {{ t().adminSubtitle }}
          </p>
        </div>

        @if (storage.isAdminLoggedIn()) {
          <button
            type="button"
            id="admin-logout-btn"
            (click)="logout()"
            class="px-4 py-2 bg-[#F0F0E8] hover:bg-[#E0E0D5] text-[#5A5A40] text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <mat-icon class="text-base">logout</mat-icon>
            <span>{{ t().adminLogoutBtn }}</span>
          </button>
        }
      </div>

      <!-- Password Gate (When not logged in) -->
      @if (!storage.isAdminLoggedIn()) {
        <div class="max-w-md mx-auto my-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#E0E0D5] shadow-xs space-y-6">
          <div class="text-center space-y-2">
            <div class="w-14 h-14 rounded-2xl bg-[#F0F0E8] text-[#5A5A40] flex items-center justify-center mx-auto text-2xl shadow-2xs">
              <mat-icon class="text-2xl">lock</mat-icon>
            </div>
            <h2 class="text-xl font-serif italic text-[#1A1A1A]" style="font-family: Georgia, serif;">{{ t().adminPasswordPrompt }}</h2>
            <p class="text-xs text-[#5A5A40]">
              Access restricted to village community administrators to moderate provider listings.
            </p>
          </div>

          <!-- Helpful Demo Hint Box -->
          <div class="p-3 bg-[#F9F9F7] border border-[#D1D1C7] rounded-xl text-xs flex items-center justify-between text-[#5A5A40]">
            <div class="flex items-center gap-1.5 font-medium">
              <mat-icon class="text-[#5A5A40] text-base">info</mat-icon>
              <span>{{ t().adminPasswordHint }}</span>
            </div>
            <button
              type="button"
              (click)="fillDemoPassword()"
              class="font-bold underline text-[#5A5A40] hover:text-[#1A1A1A] cursor-pointer ml-2"
            >
              Fill Demo Key
            </button>
          </div>

          @if (loginError()) {
            <div class="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
              <mat-icon class="text-base text-red-600">error</mat-icon>
              <span>{{ t().adminInvalidPassword }}</span>
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" class="space-y-4">
            <div>
              <label for="admin-password-input" class="block text-xs font-bold text-[#5A5A40] mb-1">
                {{ t().adminPasswordPlaceholder }}
              </label>
              <input
                id="admin-password-input"
                type="password"
                formControlName="password"
                [placeholder]="t().adminPasswordPlaceholder"
                class="w-full px-4 py-3 bg-white border border-[#D1D1C7] rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] text-[#1A1A1A] placeholder-[#8E8E80]"
              />
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              class="w-full py-3 px-4 bg-[#5A5A40] hover:bg-[#444430] active:scale-98 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <mat-icon class="text-base">login</mat-icon>
              <span>{{ t().adminLoginBtn }}</span>
            </button>
          </form>
        </div>
      } @else {
        <!-- Admin Dashboard Content -->
        <div class="space-y-6">
          <!-- Notification message if any -->
          @if (actionMessage()) {
            <div class="p-4 bg-[#E6F4EA] border border-[#A6D5B4] text-[#1E7E34] rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <mat-icon class="text-[#1E7E34] text-base">check_circle</mat-icon>
              <span>{{ actionMessage() }}</span>
            </div>
          }

          <!-- Stats Overview Strip -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-2xl border border-[#E0E0D5] shadow-xs">
              <div class="text-xs font-bold text-[#8E8E80] uppercase tracking-wider">
                {{ t().adminTotalProviders }}
              </div>
              <div class="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-1" style="font-family: Georgia, serif;">
                {{ totalProvidersCount() }}
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-[#E0E0D5] shadow-xs">
              <div class="text-xs font-bold text-[#B45309] uppercase tracking-wider">
                {{ t().adminTotalPending }}
              </div>
              <div class="text-2xl sm:text-3xl font-serif font-bold text-[#B45309] mt-1" style="font-family: Georgia, serif;">
                {{ pendingProviders().length }}
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-[#E0E0D5] shadow-xs">
              <div class="text-xs font-bold text-[#1E7E34] uppercase tracking-wider">
                {{ t().adminTotalApproved }}
              </div>
              <div class="text-2xl sm:text-3xl font-serif font-bold text-[#1E7E34] mt-1" style="font-family: Georgia, serif;">
                {{ approvedProviders().length }}
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-[#E0E0D5] shadow-xs">
              <div class="text-xs font-bold text-[#8E8E80] uppercase tracking-wider">
                {{ t().adminTotalReviews }}
              </div>
              <div class="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] mt-1" style="font-family: Georgia, serif;">
                {{ totalReviewsCount() }}
              </div>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="flex items-center justify-between border-b border-[#E0E0D5] gap-2 flex-wrap pb-2">
            <div class="flex items-center gap-2">
              <button
                type="button"
                id="admin-tab-pending-btn"
                (click)="activeTab.set('pending')"
                class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                [class]="activeTab() === 'pending' ? 'bg-[#5A5A40] text-white' : 'bg-[#F0F0E8] text-[#5A5A40] hover:bg-[#E0E0D5]'"
              >
                <mat-icon class="text-base">pending_actions</mat-icon>
                <span>{{ t().adminTabPending }}</span>
                <span
                  class="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
                  [class]="activeTab() === 'pending' ? 'bg-white text-[#5A5A40]' : 'bg-[#5A5A40] text-white'"
                >
                  {{ pendingProviders().length }}
                </span>
              </button>

              <button
                type="button"
                id="admin-tab-approved-btn"
                (click)="activeTab.set('approved')"
                class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                [class]="activeTab() === 'approved' ? 'bg-[#5A5A40] text-white' : 'bg-[#F0F0E8] text-[#5A5A40] hover:bg-[#E0E0D5]'"
              >
                <mat-icon class="text-base">check_circle</mat-icon>
                <span>{{ t().adminTabApproved }}</span>
                <span class="text-xs opacity-75">({{ approvedProviders().length }})</span>
              </button>
            </div>

            <!-- Reset Seed Data Button -->
            <button
              type="button"
              id="admin-reset-seed-btn"
              (click)="onResetSeedClick()"
              class="text-xs font-semibold px-3 py-1.5 bg-[#F0F0E8] hover:bg-[#E0E0D5] text-[#5A5A40] rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-[#D1D1C7]"
              title="Restores original 9 approved providers and 2 pending demo providers"
            >
              <mat-icon class="text-sm text-[#5A5A40]">restart_alt</mat-icon>
              <span>{{ t().adminResetSeedBtn }}</span>
            </button>
          </div>

          <!-- TAB 1: Pending Providers -->
          @if (activeTab() === 'pending') {
            @if (pendingProviders().length === 0) {
              <div class="bg-white rounded-3xl p-10 text-center border border-[#E0E0D5] shadow-xs max-w-lg mx-auto space-y-3">
                <mat-icon class="text-[#1E7E34] text-4xl">task_alt</mat-icon>
                <h3 class="text-lg font-serif italic text-[#1A1A1A]" style="font-family: Georgia, serif;">{{ t().adminNoPending }}</h3>
                <p class="text-xs text-[#5A5A40]">
                  New registrations submitted through the provider signup form will appear here for review.
                </p>
                <div class="pt-2">
                  <a
                    routerLink="/register"
                    class="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5A5A40] hover:bg-[#444430] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    <mat-icon class="text-sm">add</mat-icon>
                    <span>Submit a Test Provider</span>
                  </a>
                </div>
              </div>
            } @else {
              <div class="space-y-4">
                @for (provider of pendingProviders(); track provider.id) {
                  <div
                    [id]="'pending-provider-' + provider.id"
                    class="bg-white rounded-2xl p-5 border border-[#D1D1C7] shadow-2xs hover:shadow-xs transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    <!-- Provider Info -->
                    <div class="flex items-start gap-4">
                      <img
                        [src]="provider.photoUrl"
                        [alt]="provider.fullName"
                        referrerpolicy="no-referrer"
                        class="w-16 h-16 rounded-2xl object-cover border border-[#E0E0D5] bg-white shrink-0"
                      />
                      <div class="space-y-1">
                        <div class="flex items-center gap-2">
                          <h3 class="font-serif font-bold text-[#1A1A1A] text-base" style="font-family: Georgia, serif;">
                            {{ provider.fullName }}
                          </h3>
                          <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF4E5] text-[#B45309]">
                            Pending Review
                          </span>
                        </div>

                        <div class="flex flex-wrap items-center gap-2 text-xs text-[#5A5A40]">
                          <span class="font-semibold text-[#5A5A40] bg-[#F0F0E8] px-2 py-0.5 rounded-md border border-[#D1D1C7]">
                            {{ translation.translateSkill(provider.skill) }}
                            @if (provider.customSkill) {
                              ({{ provider.customSkill }})
                            }
                          </span>
                          <span>•</span>
                          <span class="flex items-center gap-1">
                            <mat-icon class="text-xs text-[#8E8E80]">place</mat-icon>
                            {{ provider.location }}
                          </span>
                          <span>•</span>
                          <span class="font-mono font-bold text-[#1A1A1A]">
                            +91 {{ provider.phoneNumber }}
                          </span>
                        </div>

                        <div class="text-xs text-[#8E8E80] flex items-center gap-3 pt-1">
                          <span>
                            Availability:
                            <strong class="text-[#5A5A40]">
                              {{ translation.translateAvailability(provider.availability) }}
                            </strong>
                          </span>
                          @if (provider.experienceYears) {
                            <span>
                              Experience:
                              <strong class="text-[#5A5A40]">{{ provider.experienceYears }} yrs</strong>
                            </span>
                          }
                          <span>
                            Submitted: {{ provider.createdAt | date: 'mediumDate' }}
                          </span>
                        </div>

                        @if (provider.bio) {
                          <p class="text-xs text-[#5A5A40] bg-[#F9F9F7] p-2.5 rounded-lg border border-[#E0E0D5] mt-2 max-w-xl">
                            "{{ provider.bio }}"
                          </p>
                        }
                      </div>
                    </div>

                    <!-- Approve / Reject Action Buttons -->
                    <div class="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        [id]="'approve-btn-' + provider.id"
                        (click)="approve(provider.id)"
                        class="px-5 py-2.5 bg-[#1E7E34] hover:bg-[#155d27] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <mat-icon class="text-base">check</mat-icon>
                        <span>{{ t().adminApproveBtn }}</span>
                      </button>

                      <button
                        type="button"
                        [id]="'reject-btn-' + provider.id"
                        (click)="reject(provider.id)"
                        class="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 active:scale-95 font-bold text-xs rounded-xl border border-red-200 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <mat-icon class="text-base">close</mat-icon>
                        <span>{{ t().adminRejectBtn }}</span>
                      </button>
                    </div>
                  </div>
                }
              </div>
            }
          }

          <!-- TAB 2: Approved Providers -->
          @if (activeTab() === 'approved') {
            @if (approvedProviders().length === 0) {
              <div class="bg-white rounded-3xl p-10 text-center border border-[#E0E0D5] shadow-xs max-w-lg mx-auto">
                <mat-icon class="text-[#8E8E80] text-4xl">folder_off</mat-icon>
                <h3 class="text-lg font-serif italic text-[#1A1A1A] mt-2" style="font-family: Georgia, serif;">{{ t().adminNoApproved }}</h3>
              </div>
            } @else {
              <div class="bg-white rounded-2xl border border-[#E0E0D5] shadow-xs overflow-hidden">
                <div class="divide-y divide-[#E0E0D5]">
                  @for (provider of approvedProviders(); track provider.id) {
                    <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F9F9F7] transition-colors">
                      <div class="flex items-center gap-3.5">
                        <img
                          [src]="provider.photoUrl"
                          [alt]="provider.fullName"
                          referrerpolicy="no-referrer"
                          class="w-12 h-12 rounded-xl object-cover border border-[#E0E0D5] bg-white shrink-0"
                        />
                        <div>
                          <div class="flex items-center gap-2">
                            <h4 class="font-bold text-[#1A1A1A] text-sm sm:text-base">
                              {{ provider.fullName }}
                            </h4>
                            <span class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#1E7E34]">
                              Active
                            </span>
                          </div>
                          <p class="text-xs text-[#5A5A40] mt-0.5">
                            {{ translation.translateSkill(provider.skill) }} • {{ provider.location }} • +91 {{ provider.phoneNumber }}
                          </p>
                          <div class="flex items-center gap-2 text-xs text-[#8E8E80] mt-1">
                            <span class="text-[#B45309] font-bold">★ {{ provider.averageRating }}</span>
                            <span>({{ provider.reviewCount }} reviews)</span>
                            <span>•</span>
                            <span>{{ translation.translateAvailability(provider.availability) }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="flex items-center gap-2 self-end sm:self-center">
                        <a
                          [href]="'tel:' + provider.phoneNumber"
                          class="p-2 text-[#5A5A40] hover:text-[#1E7E34] hover:bg-[#E6F4EA] rounded-lg transition-colors cursor-pointer"
                          title="Call"
                        >
                          <mat-icon class="text-base">phone</mat-icon>
                        </a>

                        <button
                          type="button"
                          (click)="removeProvider(provider.id)"
                          class="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <mat-icon class="text-sm">delete</mat-icon>
                          <span>{{ t().adminDeleteBtn }}</span>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          }
        </div>
      }
    </div>
  `,
})
export class Admin {
  readonly storage = inject(LocalStorage);
  readonly translation = inject(Translation);

  readonly t = () => this.translation.t();

  readonly activeTab = signal<'pending' | 'approved'>('pending');
  readonly loginError = signal<boolean>(false);
  readonly actionMessage = signal<string | null>(null);

  readonly loginForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
  });

  readonly pendingProviders = computed(() => this.storage.pendingProviders());
  readonly approvedProviders = computed(() => this.storage.approvedProviders());
  readonly totalProvidersCount = computed(() => this.storage.providers().length);
  readonly totalReviewsCount = computed(() => this.storage.reviews().length);

  fillDemoPassword(): void {
    this.loginForm.patchValue({password: 'admin123'});
  }

  onLoginSubmit(): void {
    this.loginError.set(false);
    const pass = this.loginForm.get('password')?.value || '';
    const ok = this.storage.loginAdmin(pass);
    if (!ok) {
      this.loginError.set(true);
    } else {
      this.loginForm.reset();
    }
  }

  logout(): void {
    this.storage.logoutAdmin();
  }

  approve(providerId: string): void {
    this.storage.approveProvider(providerId);
    this.showActionMessage(this.t().adminApprovedSuccess);
  }

  reject(providerId: string): void {
    this.storage.rejectProvider(providerId);
    this.showActionMessage(this.t().adminRejectedSuccess);
  }

  removeProvider(providerId: string): void {
    if (confirm('Permanently remove this provider and reviews?')) {
      this.storage.deleteProvider(providerId);
      this.showActionMessage('Provider removed permanently.');
    }
  }

  onResetSeedClick(): void {
    if (confirm(this.t().adminResetSeedConfirm)) {
      this.storage.resetToSeedData();
      this.showActionMessage(this.t().adminResetSeedSuccess);
    }
  }

  private showActionMessage(msg: string): void {
    this.actionMessage.set(msg);
    setTimeout(() => {
      this.actionMessage.set(null);
    }, 4000);
  }
}
