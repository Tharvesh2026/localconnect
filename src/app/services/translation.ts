import {Injectable, PLATFORM_ID, inject, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Language, TRANSLATIONS, Translations} from '../models/translations';

@Injectable({
  providedIn: 'root',
})
export class Translation {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'localconnect_lang';

  readonly currentLang = signal<Language>('ta');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY) as Language | null;
        if (saved === 'en' || saved === 'ta') {
          this.currentLang.set(saved);
        } else {
          // Default to Tamil
          this.currentLang.set('ta');
        }
      } catch {
        this.currentLang.set('ta');
      }
    }
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.STORAGE_KEY, lang);
      } catch {
        // Ignore local storage error
      }
    }
  }

  toggleLanguage(): void {
    const next = this.currentLang() === 'ta' ? 'en' : 'ta';
    this.setLanguage(next);
  }

  t(): Translations {
    return TRANSLATIONS[this.currentLang()];
  }

  translateSkill(skill: string): string {
    const t = this.t();
    switch (skill) {
      case 'Electrician':
        return t.skillElectrician;
      case 'Plumber':
        return t.skillPlumber;
      case 'Tailor':
        return t.skillTailor;
      case 'Tutor':
        return t.skillTutor;
      case 'Carpenter':
        return t.skillCarpenter;
      case 'Auto Driver':
        return t.skillAutoDriver;
      case 'Other':
        return t.skillOther;
      default:
        return skill;
    }
  }

  translateAvailability(availability: string): string {
    const t = this.t();
    switch (availability) {
      case 'Available Now':
        return t.availNow;
      case 'Available Today':
        return t.availToday;
      case 'Available This Week':
        return t.availThisWeek;
      default:
        return availability;
    }
  }
}
