import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {Translation} from '../../services/translation';
import {LocalStorage} from '../../services/local-storage';
import {Provider, SkillType} from '../../models/provider.model';
import {ReviewModal} from '../review-modal/review-modal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-search',
  imports: [RouterLink, MatIconModule, ReviewModal],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Page Header -->
      <div class="border-b border-[#E0E0D5] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="search-page-title" class="text-2xl sm:text-3xl font-serif italic text-[#1A1A1A]" style="font-family: Georgia, serif;">
            {{ t().searchTitle }}
          </h1>
          <p class="text-xs sm:text-sm text-[#5A5A40] mt-1">
            {{ t().appSubName }} • {{ filteredProviders().length }} {{ t().resultsCount }}
          </p>
        </div>

        <a
          id="search-header-register-link"
          routerLink="/register"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#5A5A40] hover:bg-[#444430] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <mat-icon class="text-base">person_add</mat-icon>
          <span>{{ t().homeRegisterBtn }}</span>
        </a>
      </div>

      <!-- Filters & Search Controls Card -->
      <div id="search-filter-controls" class="bg-white rounded-3xl p-5 sm:p-6 border border-[#E0E0D5] shadow-xs space-y-4">
        <!-- Main Search Bar -->
        <div class="relative">
          <mat-icon class="absolute left-3.5 top-3.5 text-[#5A5A40]">search</mat-icon>
          <input
            id="main-search-input"
            type="text"
            [placeholder]="t().searchPlaceholder"
            [value]="searchQuery()"
            (input)="searchQuery.set($any($event.target).value)"
            class="w-full pl-11 pr-10 py-3 text-sm sm:text-base bg-white border border-[#D1D1C7] rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:border-transparent transition-all text-[#1A1A1A] placeholder-[#8E8E80]"
          />
          @if (searchQuery()) {
            <button
              type="button"
              (click)="searchQuery.set('')"
              class="absolute right-3 top-3 text-[#8E8E80] hover:text-[#1A1A1A] p-1 cursor-pointer"
              title="Clear text"
            >
              <mat-icon class="text-base">close</mat-icon>
            </button>
          }
        </div>

        <!-- Filter Dropdowns Row -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- Skill / Service Filter -->
          <div>
            <label for="skill-filter-select" class="block text-xs font-bold text-[#5A5A40] mb-1">
              {{ t().skillLabel }}
            </label>
            <div class="relative">
              <select
                id="skill-filter-select"
                [value]="selectedSkill()"
                (change)="selectedSkill.set($any($event.target).value)"
                class="w-full px-3 py-2.5 bg-white border border-[#D1D1C7] rounded-xl text-xs sm:text-sm font-medium text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] appearance-none pr-8 cursor-pointer"
              >
                <option value="ALL">{{ t().filterSkillAll }}</option>
                @for (skill of skillsList; track skill) {
                  <option [value]="skill">
                    {{ translation.translateSkill(skill) }}
                  </option>
                }
              </select>
              <mat-icon class="absolute right-2.5 top-2.5 text-[#5A5A40] pointer-events-none text-base">expand_more</mat-icon>
            </div>
          </div>

          <!-- Location (Village/Town) Filter -->
          <div>
            <label for="location-filter-select" class="block text-xs font-bold text-[#5A5A40] mb-1">
              {{ t().locationLabel }}
            </label>
            <div class="relative">
              <select
                id="location-filter-select"
                [value]="selectedLocation()"
                (change)="selectedLocation.set($any($event.target).value)"
                class="w-full px-3 py-2.5 bg-white border border-[#D1D1C7] rounded-xl text-xs sm:text-sm font-medium text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] appearance-none pr-8 cursor-pointer"
              >
                <option value="ALL">{{ t().filterLocationAll }}</option>
                @for (loc of locationsList(); track loc) {
                  <option [value]="loc">{{ loc }}</option>
                }
              </select>
              <mat-icon class="absolute right-2.5 top-2.5 text-[#5A5A40] pointer-events-none text-base">expand_more</mat-icon>
            </div>
          </div>

          <!-- Availability Filter -->
          <div>
            <label for="availability-filter-select" class="block text-xs font-bold text-[#5A5A40] mb-1">
              {{ t().availableLabel }}
            </label>
            <div class="relative">
              <select
                id="availability-filter-select"
                [value]="selectedAvailability()"
                (change)="selectedAvailability.set($any($event.target).value)"
                class="w-full px-3 py-2.5 bg-white border border-[#D1D1C7] rounded-xl text-xs sm:text-sm font-medium text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] appearance-none pr-8 cursor-pointer"
              >
                <option value="ALL">{{ t().filterAvailabilityAll }}</option>
                <option value="Available Now">{{ t().availNow }}</option>
                <option value="Available Today">{{ t().availToday }}</option>
                <option value="Available This Week">{{ t().availThisWeek }}</option>
              </select>
              <mat-icon class="absolute right-2.5 top-2.5 text-[#5A5A40] pointer-events-none text-base">expand_more</mat-icon>
            </div>
          </div>
        </div>

        <!-- Quick Filter Pills for Skills -->
        <div class="pt-2 border-t border-[#E0E0D5] flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold text-[#5A5A40] mr-1">
            {{ t().filterSkillAll }}:
          </span>
          <button
            type="button"
            (click)="selectedSkill.set('ALL')"
            class="px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer"
            [class]="selectedSkill() === 'ALL' ? 'bg-[#5A5A40] text-white shadow-xs' : 'bg-[#F0F0E8] text-[#5A5A40] hover:bg-[#E0E0D5]'"
          >
            {{ t().filterSkillAll }}
          </button>
          @for (skill of skillsList; track skill) {
            <button
              type="button"
              (click)="selectedSkill.set(skill)"
              class="px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
              [class]="selectedSkill() === skill ? 'bg-[#5A5A40] text-white shadow-xs' : 'bg-[#F0F0E8] text-[#5A5A40] hover:bg-[#E0E0D5]'"
            >
              <span>{{ getSkillEmoji(skill) }}</span>
              <span>{{ translation.translateSkill(skill) }}</span>
            </button>
          }

          @if (isAnyFilterActive()) {
            <button
              type="button"
              (click)="resetFilters()"
              class="ml-auto text-xs font-bold text-[#B45309] hover:text-amber-800 flex items-center gap-1 cursor-pointer py-1 px-2 hover:bg-[#FFF4E5] rounded-lg transition-colors"
            >
              <mat-icon class="text-sm">filter_alt_off</mat-icon>
              <span>{{ t().clearFilters }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Search Results Section -->
      <div>
        @if (filteredProviders().length === 0) {
          <!-- Empty State -->
          <div
            id="empty-search-state"
            class="bg-white rounded-3xl p-10 sm:p-14 text-center border-2 border-dashed border-[#D1D1C7] shadow-xs max-w-xl mx-auto space-y-4 my-8"
          >
            <div class="w-16 h-16 rounded-full bg-[#F0F0E8] text-[#5A5A40] flex items-center justify-center mx-auto text-3xl">
              <mat-icon class="text-3xl">search_off</mat-icon>
            </div>
            <h3 class="text-xl font-serif italic text-[#1A1A1A]" style="font-family: Georgia, serif;">
              {{ t().noProvidersFound }}
            </h3>
            <p class="text-sm text-[#5A5A40] leading-relaxed">
              {{ t().noProvidersHint }}
            </p>
            <div class="pt-2">
              <button
                type="button"
                id="reset-search-filters-btn"
                (click)="resetFilters()"
                class="px-6 py-2.5 bg-[#5A5A40] hover:bg-[#444430] active:scale-95 text-white font-bold text-sm rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <mat-icon class="text-base">refresh</mat-icon>
                <span>{{ t().resetSearch }}</span>
              </button>
            </div>
          </div>
        } @else {
          <!-- Providers Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (provider of filteredProviders(); track provider.id) {
              <div
                [id]="'provider-card-' + provider.id"
                class="bg-white rounded-3xl border border-[#E0E0D5] shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div class="space-y-4">
                  <!-- Header: Photo & Identity -->
                  <div class="flex items-start gap-3.5">
                    <img
                      [src]="provider.photoUrl"
                      [alt]="provider.fullName"
                      referrerpolicy="no-referrer"
                      class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-[#E0E0D5] bg-[#E0E0D5] shrink-0 shadow-2xs"
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

                      <!-- Skill & Location Badges -->
                      <div class="flex flex-wrap items-center gap-1.5 mt-1">
                        <span class="inline-block px-2 py-0.5 rounded-md text-xs font-semibold bg-[#F0F0E8] text-[#5A5A40]">
                          {{ translation.translateSkill(provider.skill) }}
                          @if (provider.customSkill) {
                            ({{ provider.customSkill }})
                          }
                        </span>
                      </div>

                      <div class="flex items-center gap-1 text-xs text-[#8E8E80] mt-1">
                        <mat-icon class="text-xs text-[#8E8E80]">place</mat-icon>
                        <span class="truncate">{{ provider.location }}</span>
                      </div>

                      <!-- Rating row -->
                      <div class="flex items-center gap-1.5 mt-1.5">
                        <div class="flex text-amber-500">
                          @for (s of [1, 2, 3, 4, 5]; track s) {
                            <mat-icon class="text-xs">
                              {{ s <= provider.averageRating ? 'star' : (s - 0.5 <= provider.averageRating ? 'star_half' : 'star_border') }}
                            </mat-icon>
                          }
                        </div>
                        <span class="text-xs font-bold text-[#1A1A1A]">
                          {{ provider.averageRating > 0 ? provider.averageRating : '—' }}
                        </span>
                        <span class="text-xs text-[#8E8E80]">
                          ({{ provider.reviewCount }} {{ t().reviewsCountText }})
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Bio / Experience Description -->
                  @if (provider.bio) {
                    <p class="text-xs text-[#5A5A40] line-clamp-2 leading-relaxed bg-[#F9F9F7] p-2.5 rounded-xl border border-[#E0E0D5]/50">
                      {{ provider.bio }}
                    </p>
                  }

                  <!-- Availability & Experience Badges -->
                  <div class="flex items-center justify-between pt-1 text-xs">
                    <span class="text-[#8E8E80] font-medium">{{ t().availableLabel }}:</span>
                    <span
                      class="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px]"
                      [class]="getAvailabilityClass(provider.availability)"
                    >
                      {{ translation.translateAvailability(provider.availability) }}
                    </span>
                  </div>

                  @if (provider.experienceYears) {
                    <div class="text-[11px] text-[#8E8E80] flex items-center gap-1">
                      <mat-icon class="text-xs text-[#8E8E80]">work_history</mat-icon>
                      <span>{{ provider.experienceYears }}+ years village experience</span>
                    </div>
                  }

                  <!-- Revealed Contact Info Box -->
                  @if (revealedPhoneId() === provider.id) {
                    <div class="p-3.5 bg-[#F9F9F7] rounded-2xl border border-[#D1D1C7] text-xs space-y-2">
                      <div class="flex items-center justify-between font-mono font-bold text-[#1A1A1A] text-sm">
                        <span class="flex items-center gap-1.5">
                          <mat-icon class="text-[#5A5A40] text-base">phone</mat-icon>
                          <span>{{ formatPhone(provider.phoneNumber) }}</span>
                        </span>
                      </div>
                      <div class="grid grid-cols-2 gap-2 pt-1">
                        <a
                          [href]="'tel:' + provider.phoneNumber"
                          class="py-2 px-2.5 bg-[#5A5A40] hover:bg-[#444430] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                        >
                          <mat-icon class="text-sm">call</mat-icon>
                          <span>{{ t().callNow }}</span>
                        </a>
                        <a
                          [href]="'https://wa.me/91' + provider.phoneNumber"
                          target="_blank"
                          rel="noopener"
                          class="py-2 px-2.5 bg-[#1E7E34] hover:bg-[#155d27] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                        >
                          <mat-icon class="text-sm">chat</mat-icon>
                          <span>{{ t().whatsappMsg }}</span>
                        </a>
                      </div>
                    </div>
                  }
                </div>

                <!-- Bottom Interactive Action Buttons -->
                <div class="mt-4 pt-3 border-t border-[#E0E0D5] flex items-center gap-2">
                  <button
                    type="button"
                    [id]="'card-contact-btn-' + provider.id"
                    (click)="togglePhone(provider.id)"
                    class="flex-1 py-2.5 px-3 bg-[#5A5A40] hover:bg-[#444430] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <mat-icon class="text-base">
                      {{ revealedPhoneId() === provider.id ? 'visibility_off' : 'call' }}
                    </mat-icon>
                    <span>
                      {{ revealedPhoneId() === provider.id ? t().hideContactBtn : t().contactBtn }}
                    </span>
                  </button>

                  <button
                    type="button"
                    [id]="'card-review-btn-' + provider.id"
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
        }
      </div>

      <!-- Rating & Review Modal -->
      @if (activeReviewProvider()) {
        <app-review-modal
          [provider]="activeReviewProvider()!"
          (closeModal)="closeReviewModal()"
        />
      }
    </div>
  `,
})
export class Search {
  private readonly route = inject(ActivatedRoute);
  private readonly storage = inject(LocalStorage);
  readonly translation = inject(Translation);

  readonly t = () => this.translation.t();

  readonly searchQuery = signal<string>('');
  readonly selectedSkill = signal<string>('ALL');
  readonly selectedLocation = signal<string>('ALL');
  readonly selectedAvailability = signal<string>('ALL');

  readonly revealedPhoneId = signal<string | null>(null);
  readonly activeReviewProvider = signal<Provider | null>(null);

  readonly skillsList: SkillType[] = [
    'Electrician',
    'Plumber',
    'Tailor',
    'Tutor',
    'Carpenter',
    'Auto Driver',
    'Other',
  ];

  readonly locationsList = computed(() => this.storage.uniqueLocations());

  readonly filteredProviders = computed(() => {
    // Only approved providers!
    let list = this.storage.approvedProviders();

    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const nameMatch = p.fullName.toLowerCase().includes(q);
        const locMatch = p.location.toLowerCase().includes(q);
        const skillMatch = p.skill.toLowerCase().includes(q);
        const customSkillMatch = p.customSkill?.toLowerCase().includes(q) || false;
        const bioMatch = p.bio?.toLowerCase().includes(q) || false;
        return nameMatch || locMatch || skillMatch || customSkillMatch || bioMatch;
      });
    }

    const skill = this.selectedSkill();
    if (skill !== 'ALL') {
      list = list.filter((p) => p.skill === skill);
    }

    const loc = this.selectedLocation();
    if (loc !== 'ALL') {
      list = list.filter((p) => p.location.toLowerCase() === loc.toLowerCase());
    }

    const avail = this.selectedAvailability();
    if (avail !== 'ALL') {
      list = list.filter((p) => p.availability === avail);
    }

    return list;
  });

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['skill']) {
        this.selectedSkill.set(params['skill']);
      }
      if (params['q']) {
        this.searchQuery.set(params['q']);
      }
      if (params['location']) {
        this.selectedLocation.set(params['location']);
      }
    });
  }

  isAnyFilterActive(): boolean {
    return (
      this.searchQuery().trim() !== '' ||
      this.selectedSkill() !== 'ALL' ||
      this.selectedLocation() !== 'ALL' ||
      this.selectedAvailability() !== 'ALL'
    );
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedSkill.set('ALL');
    this.selectedLocation.set('ALL');
    this.selectedAvailability.set('ALL');
  }

  togglePhone(providerId: string): void {
    this.revealedPhoneId.update((id) => (id === providerId ? null : providerId));
  }

  formatPhone(raw: string): string {
    const clean = raw.replace(/\D/g, '');
    if (clean.length === 10) {
      return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
    }
    return raw;
  }

  getSkillEmoji(skill: SkillType): string {
    switch (skill) {
      case 'Electrician':
        return '⚡';
      case 'Plumber':
        return '🔧';
      case 'Tailor':
        return '🧵';
      case 'Tutor':
        return '📚';
      case 'Carpenter':
        return '🪚';
      case 'Auto Driver':
        return '🛺';
      case 'Other':
        return '🛠️';
    }
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
