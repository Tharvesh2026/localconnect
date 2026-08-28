import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {Translation} from '../../services/translation';
import {LocalStorage} from '../../services/local-storage';
import {Provider, SkillType} from '../../models/provider.model';
import {ReviewModal} from '../review-modal/review-modal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  imports: [RouterLink, MatIconModule, ReviewModal],
  template: `
    <div class="space-y-12 pb-16">
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-[#F5F5F0] border-b border-[#E0E0D5] pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center space-y-6">
          <!-- Community Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F0E8] border border-[#E0E0D5] text-[#5A5A40] text-xs sm:text-sm font-semibold shadow-2xs">
            <mat-icon class="text-[#5A5A40] text-base">diversity_1</mat-icon>
            <span>{{ t().appSubName }} — {{ t().tagline }}</span>
          </div>

          <!-- Main 1-2 Line Title & Explanation -->
          <h1 id="hero-title" class="text-3xl sm:text-4xl lg:text-5xl font-serif italic text-[#1A1A1A] tracking-tight leading-tight" style="font-family: Georgia, serif;">
            {{ t().homeHeroTitle }}
          </h1>

          <p id="hero-description" class="text-base sm:text-lg text-[#5A5A40] max-w-2xl mx-auto leading-relaxed">
            {{ t().homeHeroDesc }}
          </p>

          <!-- Quick Search Input Bar in Hero -->
          <div class="max-w-xl mx-auto pt-2">
            <form (submit)="onHeroSearchSubmit($event)" class="relative flex items-center shadow-sm rounded-2xl bg-white border border-[#D1D1C7] focus-within:ring-2 focus-within:ring-[#5A5A40] focus-within:border-transparent transition-all p-1.5">
              <mat-icon class="ml-3 text-[#5A5A40]">search</mat-icon>
              <input
                id="hero-search-input"
                type="text"
                [placeholder]="t().searchPlaceholder"
                [value]="quickQuery()"
                (input)="quickQuery.set($any($event.target).value)"
                class="w-full px-3 py-2.5 text-sm sm:text-base text-[#1A1A1A] bg-transparent focus:outline-none placeholder-[#8E8E80]"
              />
              <button
                id="hero-search-submit-btn"
                type="submit"
                class="px-5 py-2.5 bg-[#5A5A40] hover:bg-[#444430] active:scale-95 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>{{ t().homeFindBtn }}</span>
                <mat-icon class="text-sm">arrow_forward</mat-icon>
              </button>
            </form>
          </div>

          <!-- Dual Call to Action Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <a
              id="hero-find-service-btn"
              routerLink="/search"
              class="w-full sm:w-auto px-7 py-3.5 bg-[#5A5A40] hover:bg-[#444430] active:scale-98 text-white font-bold text-base rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <mat-icon class="text-xl">search</mat-icon>
              <span>{{ t().homeFindBtn }}</span>
            </a>

            <a
              id="hero-register-btn"
              routerLink="/register"
              class="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-[#F0F0E8] active:scale-98 text-[#5A5A40] font-bold text-base rounded-2xl shadow-xs border border-[#5A5A40] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <mat-icon class="text-xl">person_add</mat-icon>
              <span>{{ t().homeRegisterBtn }}</span>
            </a>
          </div>

          <!-- Community Stats Quick Strip -->
          <div class="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-[#5A5A40] font-medium">
            <div class="flex items-center gap-1.5">
              <mat-icon class="text-[#5A5A40] text-lg">verified_user</mat-icon>
              <span>{{ approvedCount() }} {{ t().resultsCount }}</span>
            </div>
            <span class="text-[#D1D1C7] hidden sm:inline">•</span>
            <div class="flex items-center gap-1.5">
              <mat-icon class="text-amber-500 text-lg">star</mat-icon>
              <span>100% {{ t().homeWhy2Title }}</span>
            </div>
            <span class="text-[#D1D1C7] hidden sm:inline">•</span>
            <div class="flex items-center gap-1.5">
              <mat-icon class="text-[#1E7E34] text-lg">cloud_off</mat-icon>
              <span class="text-[#1E7E34] font-semibold">{{ t().offlineReady }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Category Quick Selector Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 id="categories-heading" class="text-xl sm:text-2xl font-serif italic text-[#1A1A1A]" style="font-family: Georgia, serif;">
              {{ t().homeCategoriesTitle }}
            </h2>
            <p class="text-xs sm:text-sm text-[#5A5A40] mt-1">
              {{ t().appSubName }}
            </p>
          </div>
          <a
            id="view-all-services-link"
            routerLink="/search"
            class="text-xs sm:text-sm font-bold text-[#5A5A40] hover:text-[#1A1A1A] flex items-center gap-1 cursor-pointer"
          >
            <span>{{ t().resultsCount }}</span>
            <mat-icon class="text-base">chevron_right</mat-icon>
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          @for (cat of categoryCards; track cat.skill) {
            <button
              type="button"
              [id]="'cat-btn-' + cat.skill.toLowerCase().replace(' ', '-')"
              (click)="navigateToCategory(cat.skill)"
              class="p-4 bg-white hover:bg-[#F9F9F7] rounded-3xl border border-[#E0E0D5] hover:border-[#5A5A40]/50 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2.5 group cursor-pointer active:scale-95"
            >
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform" [class]="cat.colorClass">
                <span>{{ cat.icon }}</span>
              </div>
              <div>
                <span class="block font-bold text-xs sm:text-sm text-[#1A1A1A] group-hover:text-[#5A5A40] transition-colors">
                  {{ translation.translateSkill(cat.skill) }}
                </span>
                <span class="block text-[11px] text-[#8E8E80] font-medium mt-0.5">
                  {{ getSkillCount(cat.skill) }} {{ t().resultsCount }}
                </span>
              </div>
            </button>
          }
        </div>
      </section>

      <!-- Featured Providers Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 id="featured-providers-heading" class="text-xl sm:text-2xl font-serif italic text-[#1A1A1A]" style="font-family: Georgia, serif;">
              {{ t().homeFeaturedTitle }}
            </h2>
            <p class="text-xs sm:text-sm text-[#5A5A40] mt-1">
              {{ t().tagline }}
            </p>
          </div>
          <a
            id="see-all-providers-link"
            routerLink="/search"
            class="text-xs sm:text-sm font-bold text-[#5A5A40] hover:text-[#1A1A1A] flex items-center gap-1 cursor-pointer"
          >
            <span>{{ t().resultsCount }}</span>
            <mat-icon class="text-base">arrow_forward</mat-icon>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (provider of featuredProviders(); track provider.id) {
            <div
              [id]="'featured-card-' + provider.id"
              class="bg-white rounded-3xl border border-[#E0E0D5] shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <!-- Card Top -->
              <div class="space-y-4">
                <div class="flex items-start gap-3.5">
                  <img
                    [src]="provider.photoUrl"
                    [alt]="provider.fullName"
                    referrerpolicy="no-referrer"
                    class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-[#E0E0D5] bg-[#E0E0D5] shrink-0"
                  />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5">
                      <h3 class="font-bold text-[#1A1A1A] text-base truncate">
                        {{ provider.fullName }}
                      </h3>
                      <span class="inline-flex items-center text-[#5A5A40]" title="Verified Village Provider">
                        <mat-icon class="text-base">verified</mat-icon>
                      </span>
                    </div>

                    <div class="flex items-center gap-1.5 mt-0.5">
                      <span class="inline-block px-2 py-0.5 rounded-md text-xs font-semibold bg-[#F0F0E8] text-[#5A5A40]">
                        {{ translation.translateSkill(provider.skill) }}
                      </span>
                      <span class="text-xs text-[#8E8E80] truncate">
                        {{ provider.location }}
                      </span>
                    </div>

                    <!-- Star rating -->
                    <div class="flex items-center gap-1.5 mt-1.5">
                      <div class="flex text-amber-500">
                        @for (s of [1, 2, 3, 4, 5]; track s) {
                          <mat-icon class="text-sm">
                            {{ s <= provider.averageRating ? 'star' : (s - 0.5 <= provider.averageRating ? 'star_half' : 'star_border') }}
                          </mat-icon>
                        }
                      </div>
                      <span class="text-xs font-bold text-[#1A1A1A]">{{ provider.averageRating }}</span>
                      <span class="text-xs text-[#8E8E80]">({{ provider.reviewCount }})</span>
                    </div>
                  </div>
                </div>

                @if (provider.bio) {
                  <p class="text-xs text-[#5A5A40] line-clamp-2 leading-relaxed bg-[#F9F9F7] p-2 rounded-xl border border-[#E0E0D5]/50">
                    {{ provider.bio }}
                  </p>
                }

                <!-- Availability Badge -->
                <div class="flex items-center justify-between pt-1 text-xs">
                  <span class="text-[#8E8E80] font-medium">{{ t().availableLabel }}:</span>
                  <span
                    class="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px]"
                    [class]="getAvailabilityClass(provider.availability)"
                  >
                    {{ translation.translateAvailability(provider.availability) }}
                  </span>
                </div>

                <!-- Revealed Contact info if active -->
                @if (contactRevealedId() === provider.id) {
                  <div class="p-3.5 bg-[#F9F9F7] rounded-2xl border border-[#D1D1C7] text-xs space-y-2">
                    <div class="flex items-center justify-between font-mono font-bold text-[#1A1A1A] text-sm">
                      <span>{{ formatPhone(provider.phoneNumber) }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 pt-1">
                      <a
                        [href]="'tel:' + provider.phoneNumber"
                        class="py-2 px-3 bg-[#5A5A40] hover:bg-[#444430] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <mat-icon class="text-base">call</mat-icon>
                        <span>{{ t().callNow }}</span>
                      </a>
                      <a
                        [href]="'https://wa.me/91' + provider.phoneNumber"
                        target="_blank"
                        rel="noopener"
                        class="py-2 px-3 bg-[#1E7E34] hover:bg-[#155d27] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <mat-icon class="text-base">chat</mat-icon>
                        <span>{{ t().whatsappMsg }}</span>
                      </a>
                    </div>
                  </div>
                }
              </div>

              <!-- Card Bottom Actions -->
              <div class="mt-4 pt-3 border-t border-[#E0E0D5] flex items-center gap-2">
                <button
                  type="button"
                  [id]="'contact-btn-' + provider.id"
                  (click)="toggleContact(provider.id)"
                  class="flex-1 py-2.5 px-3 bg-[#5A5A40] hover:bg-[#444430] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <mat-icon class="text-base">
                    {{ contactRevealedId() === provider.id ? 'visibility_off' : 'call' }}
                  </mat-icon>
                  <span>
                    {{ contactRevealedId() === provider.id ? t().hideContactBtn : t().contactBtn }}
                  </span>
                </button>

                <button
                  type="button"
                  [id]="'review-btn-' + provider.id"
                  (click)="openReviewModal(provider)"
                  class="py-2.5 px-3 bg-[#F0F0E8] hover:bg-[#E0E0D5] text-[#5A5A40] font-bold text-xs rounded-xl border border-[#E0E0D5] transition-colors flex items-center gap-1 cursor-pointer"
                  [attr.aria-label]="t().rateAndReview"
                >
                  <mat-icon class="text-base text-amber-500">rate_review</mat-icon>
                  <span class="hidden sm:inline">{{ t().rateAndReview }}</span>
                </button>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Why LocalConnect Trust Pillars / Community Banner -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-[#5A5A40] text-white rounded-[32px] p-6 sm:p-10 shadow-xl">
          <div class="max-w-3xl mb-8">
            <span class="text-xs uppercase tracking-wider font-semibold opacity-80">Local Village Services</span>
            <h2 id="why-heading" class="text-2xl sm:text-3xl font-serif italic text-white mt-1" style="font-family: Georgia, serif;">
              {{ t().homeWhyTitle }}
            </h2>
            <p class="text-white/90 text-sm sm:text-base mt-2">
              {{ t().tagline }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-5 bg-white/10 rounded-2xl border border-white/15 space-y-2">
              <div class="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center">
                <mat-icon>phone_forwarded</mat-icon>
              </div>
              <h3 class="font-bold text-base text-white">{{ t().homeWhy1Title }}</h3>
              <p class="text-xs text-white/85 leading-relaxed">{{ t().homeWhy1Desc }}</p>
            </div>

            <div class="p-5 bg-white/10 rounded-2xl border border-white/15 space-y-2">
              <div class="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center">
                <mat-icon>stars</mat-icon>
              </div>
              <h3 class="font-bold text-base text-white">{{ t().homeWhy2Title }}</h3>
              <p class="text-xs text-white/85 leading-relaxed">{{ t().homeWhy2Desc }}</p>
            </div>

            <div class="p-5 bg-white/10 rounded-2xl border border-white/15 space-y-2">
              <div class="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center">
                <mat-icon>offline_bolt</mat-icon>
              </div>
              <h3 class="font-bold text-base text-white">{{ t().homeWhy3Title }}</h3>
              <p class="text-xs text-white/85 leading-relaxed">{{ t().homeWhy3Desc }}</p>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div class="p-2.5 bg-white/10 rounded-2xl border border-dashed border-white/20 flex items-center gap-2 text-xs text-white">
              <span class="w-2 h-2 rounded-full bg-[#E6F4EA]"></span>
              <span>LocalConnect • {{ t().offlineReady }} • Community Trust Platform</span>
            </div>
            <a
              id="footer-register-link"
              routerLink="/register"
              class="px-5 py-2.5 bg-white text-[#5A5A40] hover:bg-[#F5F5F0] font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              {{ t().homeRegisterBtn }} →
            </a>
          </div>
        </div>
      </section>

      <!-- Review Modal (if active) -->
      @if (activeReviewProvider()) {
        <app-review-modal
          [provider]="activeReviewProvider()!"
          (closeModal)="closeReviewModal()"
        />
      }
    </div>
  `,
})
export class Home {
  private readonly router = inject(Router);
  private readonly storage = inject(LocalStorage);
  readonly translation = inject(Translation);

  readonly t = () => this.translation.t();
  readonly quickQuery = signal<string>('');
  readonly contactRevealedId = signal<string | null>(null);
  readonly activeReviewProvider = signal<Provider | null>(null);

  readonly approvedCount = computed(() => this.storage.approvedProviders().length);

  readonly featuredProviders = computed(() => {
    return this.storage
      .approvedProviders()
      .slice(0, 6);
  });

  readonly categoryCards: {
    skill: SkillType;
    icon: string;
    colorClass: string;
  }[] = [
    {skill: 'Electrician', icon: '⚡', colorClass: 'bg-[#F0F0E8] text-[#5A5A40]'},
    {skill: 'Plumber', icon: '🔧', colorClass: 'bg-[#F0F0E8] text-[#5A5A40]'},
    {skill: 'Tailor', icon: '🧵', colorClass: 'bg-[#F0F0E8] text-[#5A5A40]'},
    {skill: 'Tutor', icon: '📚', colorClass: 'bg-[#F0F0E8] text-[#5A5A40]'},
    {skill: 'Carpenter', icon: '🪚', colorClass: 'bg-[#F0F0E8] text-[#5A5A40]'},
    {skill: 'Auto Driver', icon: '🛺', colorClass: 'bg-[#F0F0E8] text-[#5A5A40]'},
  ];

  getSkillCount(skill: SkillType): number {
    return this.storage.approvedProviders().filter((p) => p.skill === skill).length;
  }

  navigateToCategory(skill: SkillType): void {
    this.router.navigate(['/search'], {queryParams: {skill}});
  }

  onHeroSearchSubmit(e: Event): void {
    e.preventDefault();
    const query = this.quickQuery().trim();
    if (query) {
      this.router.navigate(['/search'], {queryParams: {q: query}});
    } else {
      this.router.navigate(['/search']);
    }
  }

  toggleContact(providerId: string): void {
    this.contactRevealedId.update((id) => (id === providerId ? null : providerId));
  }

  formatPhone(raw: string): string {
    const clean = raw.replace(/\D/g, '');
    if (clean.length === 10) {
      return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
    }
    return raw;
  }

  getAvailabilityClass(availability: string): string {
    switch (availability) {
      case 'Available Now':
        return 'bg-[#E6F4EA] text-[#1E7E34]';
      case 'Available Today':
        return 'bg-[#FFF4E5] text-[#B45309]';
      case 'Available This Week':
        return 'bg-[#F1F1ED] text-[#71716A]';
      default:
        return 'bg-[#F1F1ED] text-[#71716A]';
    }
  }

  openReviewModal(provider: Provider): void {
    this.activeReviewProvider.set(provider);
  }

  closeReviewModal(): void {
    this.activeReviewProvider.set(null);
  }
}
