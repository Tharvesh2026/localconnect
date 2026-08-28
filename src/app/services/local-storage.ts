import {
  Injectable,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Provider, Review, SkillType, Availability} from '../models/provider.model';
import {INITIAL_PROVIDERS, INITIAL_REVIEWS} from './seed-data';

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly PROVIDERS_KEY = 'localconnect_providers_v2';
  private readonly REVIEWS_KEY = 'localconnect_reviews_v2';
  private readonly ADMIN_SESSION_KEY = 'localconnect_admin_session';

  readonly providers = signal<Provider[]>([]);
  readonly reviews = signal<Review[]>([]);
  readonly isAdminLoggedIn = signal<boolean>(false);

  // Derived signals
  readonly approvedProviders = computed(() =>
    this.providers().filter((p) => p.status === 'approved')
  );

  readonly pendingProviders = computed(() =>
    this.providers().filter((p) => p.status === 'pending')
  );

  readonly rejectedProviders = computed(() =>
    this.providers().filter((p) => p.status === 'rejected')
  );

  readonly uniqueLocations = computed(() => {
    const locSet = new Set<string>();
    for (const p of this.approvedProviders()) {
      if (p.location && p.location.trim()) {
        locSet.add(p.location.trim());
      }
    }
    return Array.from(locSet).sort();
  });

  constructor() {
    this.initData();
  }

  private initData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      // In SSR context, use initial seed data
      this.providers.set(INITIAL_PROVIDERS);
      this.reviews.set(INITIAL_REVIEWS);
      return;
    }

    try {
      const storedProviders = localStorage.getItem(this.PROVIDERS_KEY);
      const storedReviews = localStorage.getItem(this.REVIEWS_KEY);
      const storedAdmin = sessionStorage.getItem(this.ADMIN_SESSION_KEY);

      if (storedAdmin === 'true') {
        this.isAdminLoggedIn.set(true);
      }

      if (storedProviders && storedReviews) {
        const parsedProviders: Provider[] = JSON.parse(storedProviders);
        const parsedReviews: Review[] = JSON.parse(storedReviews);
        this.providers.set(parsedProviders);
        this.reviews.set(parsedReviews);
      } else {
        // First load - seed database with 9 approved + 2 pending providers and reviews
        this.seedInitialData();
      }
    } catch {
      this.seedInitialData();
    }
  }

  private seedInitialData(): void {
    this.providers.set(INITIAL_PROVIDERS);
    this.reviews.set(INITIAL_REVIEWS);
    this.persistToStorage(INITIAL_PROVIDERS, INITIAL_REVIEWS);
  }

  private persistToStorage(
    providersList: Provider[],
    reviewsList: Review[]
  ): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(this.PROVIDERS_KEY, JSON.stringify(providersList));
      localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(reviewsList));
    } catch {
      // Storage quota or disabled
    }
  }

  resetToSeedData(): void {
    this.seedInitialData();
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '').slice(-10);
  }

  addProvider(data: {
    fullName: string;
    photoUrl: string;
    phoneNumber: string;
    skill: SkillType;
    customSkill?: string;
    location: string;
    availability: Availability;
    bio?: string;
    experienceYears?: number;
  }): {success: boolean; error?: 'duplicate_phone' | 'invalid_phone'; provider?: Provider} {
    const cleanPhone = this.normalizePhone(data.phoneNumber);
    if (cleanPhone.length < 10) {
      return {success: false, error: 'invalid_phone'};
    }

    // Check duplicate phone number across all non-rejected providers
    const isDuplicate = this.providers().some(
      (p) =>
        p.status !== 'rejected' &&
        this.normalizePhone(p.phoneNumber) === cleanPhone
    );

    if (isDuplicate) {
      return {success: false, error: 'duplicate_phone'};
    }

    const newProvider: Provider = {
      id: 'prov-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      fullName: data.fullName.trim(),
      photoUrl: data.photoUrl,
      phoneNumber: cleanPhone,
      skill: data.skill,
      customSkill: data.customSkill?.trim(),
      location: data.location.trim(),
      availability: data.availability,
      status: 'pending',
      bio: data.bio?.trim(),
      experienceYears: data.experienceYears,
      createdAt: new Date().toISOString(),
      averageRating: 0,
      reviewCount: 0,
    };

    const updated = [newProvider, ...this.providers()];
    this.providers.set(updated);
    this.persistToStorage(updated, this.reviews());

    return {success: true, provider: newProvider};
  }

  approveProvider(providerId: string): void {
    const updated = this.providers().map((p) => {
      if (p.id === providerId) {
        return {
          ...p,
          status: 'approved' as const,
          approvedAt: new Date().toISOString(),
        };
      }
      return p;
    });

    this.providers.set(updated);
    this.persistToStorage(updated, this.reviews());
  }

  rejectProvider(providerId: string): void {
    // Hidden permanently / rejected status
    const updated = this.providers().map((p) => {
      if (p.id === providerId) {
        return {
          ...p,
          status: 'rejected' as const,
        };
      }
      return p;
    });

    this.providers.set(updated);
    this.persistToStorage(updated, this.reviews());
  }

  deleteProvider(providerId: string): void {
    const updatedProviders = this.providers().filter((p) => p.id !== providerId);
    const updatedReviews = this.reviews().filter((r) => r.providerId !== providerId);

    this.providers.set(updatedProviders);
    this.reviews.set(updatedReviews);
    this.persistToStorage(updatedProviders, updatedReviews);
  }

  getReviewsForProvider(providerId: string): Review[] {
    return this.reviews()
      .filter((r) => r.providerId === providerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addReview(
    providerId: string,
    rating: number,
    comment: string,
    reviewerName: string
  ): Review {
    const newReview: Review = {
      id: 'rev-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      providerId,
      rating: Math.max(1, Math.min(5, rating)),
      comment: comment.trim(),
      reviewerName: reviewerName.trim() || 'Village Resident',
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...this.reviews()];
    this.reviews.set(updatedReviews);

    // Recalculate provider average rating and review count
    const providerReviews = updatedReviews.filter((r) => r.providerId === providerId);
    const totalScore = providerReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = Number((totalScore / providerReviews.length).toFixed(1));

    const updatedProviders = this.providers().map((p) => {
      if (p.id === providerId) {
        return {
          ...p,
          averageRating: avg,
          reviewCount: providerReviews.length,
        };
      }
      return p;
    });

    this.providers.set(updatedProviders);
    this.persistToStorage(updatedProviders, updatedReviews);

    return newReview;
  }

  // Admin authentication
  loginAdmin(password: string): boolean {
    if (password.trim() === 'admin123') {
      this.isAdminLoggedIn.set(true);
      if (isPlatformBrowser(this.platformId)) {
        try {
          sessionStorage.setItem(this.ADMIN_SESSION_KEY, 'true');
        } catch (err) {
          console.warn('Failed to save admin session', err);
        }
      }
      return true;
    }
    return false;
  }

  logoutAdmin(): void {
    this.isAdminLoggedIn.set(false);
    if (isPlatformBrowser(this.platformId)) {
      try {
        sessionStorage.removeItem(this.ADMIN_SESSION_KEY);
      } catch (err) {
        console.warn('Failed to clear admin session', err);
      }
    }
  }
}
