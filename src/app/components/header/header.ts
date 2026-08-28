import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {Translation} from '../../services/translation';
import {LocalStorage} from '../../services/local-storage';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <header class="sticky top-0 z-40 bg-white text-[#1A1A1A] border-b border-[#E0E0D5] shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20 gap-2">
          <!-- Logo & Brand Title -->
          <a
            id="nav-logo"
            routerLink="/"
            class="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center shadow-xs font-extrabold text-lg group-hover:bg-[#444430] transition-colors">
              <mat-icon class="text-2xl">handyman</mat-icon>
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-lg sm:text-xl tracking-tight text-[#1A1A1A] leading-tight">
                LocalConnect
              </span>
              <span class="text-[11px] sm:text-xs text-[#5A5A40] font-medium tracking-wide">
                {{ t().appSubName }}
              </span>
            </div>
          </a>

          <!-- Desktop Navigation Links -->
          <nav class="hidden md:flex items-center gap-1 lg:gap-2">
            <a
              id="desktop-nav-home"
              routerLink="/"
              routerLinkActive="bg-[#F0F0E8] text-[#1A1A1A] font-bold"
              [routerLinkActiveOptions]="{exact: true}"
              class="px-3.5 py-2 rounded-xl text-sm font-medium text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#F0F0E8] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <mat-icon class="text-lg">home</mat-icon>
              <span>{{ t().navHome }}</span>
            </a>

            <a
              id="desktop-nav-search"
              routerLink="/search"
              routerLinkActive="bg-[#F0F0E8] text-[#1A1A1A] font-bold"
              class="px-3.5 py-2 rounded-xl text-sm font-medium text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#F0F0E8] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <mat-icon class="text-lg">search</mat-icon>
              <span>{{ t().navSearch }}</span>
            </a>

            <a
              id="desktop-nav-register"
              routerLink="/register"
              routerLinkActive="bg-[#F0F0E8] text-[#1A1A1A] font-bold"
              class="px-3.5 py-2 rounded-xl text-sm font-medium text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#F0F0E8] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <mat-icon class="text-lg">person_add</mat-icon>
              <span>{{ t().navRegister }}</span>
            </a>

            @if (loggedInWorker(); as worker) {
              <a
                id="desktop-nav-worker"
                routerLink="/worker-dashboard"
                routerLinkActive="bg-[#F0F0E8] text-[#1A1A1A] font-bold"
                class="px-3.5 py-2 rounded-xl text-sm font-medium text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#F0F0E8] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <mat-icon class="text-lg">badge</mat-icon>
                <span>{{ t().navWorkerDashboard }}</span>
                <span class="w-2 h-2 rounded-full bg-[#1E7E34]"></span>
              </a>
            } @else {
              <a
                id="desktop-nav-worker"
                routerLink="/worker-login"
                routerLinkActive="bg-[#F0F0E8] text-[#1A1A1A] font-bold"
                class="px-3.5 py-2 rounded-xl text-sm font-medium text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#F0F0E8] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <mat-icon class="text-lg">badge</mat-icon>
                <span>{{ t().navWorkerLogin }}</span>
              </a>
            }

            <a
              id="desktop-nav-admin"
              routerLink="/admin"
              routerLinkActive="bg-[#F0F0E8] text-[#1A1A1A] font-bold"
              class="px-3.5 py-2 rounded-xl text-sm font-medium text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#F0F0E8] transition-colors flex items-center gap-1.5 relative cursor-pointer"
            >
              <mat-icon class="text-lg">admin_panel_settings</mat-icon>
              <span>{{ t().navAdmin }}</span>
              @if (pendingCount() > 0) {
                <span class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#5A5A40] text-white">
                  {{ pendingCount() }}
                </span>
              }
            </a>
          </nav>

          <!-- Right Action controls: Language Switcher & Offline status -->
          <div class="flex items-center gap-2 sm:gap-3">
            <!-- Offline Indicator Badge -->
            <div
              class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#E6F4EA] text-[#1E7E34] border border-[#1E7E34]/20"
              title="Runs locally without external server"
            >
              <span class="w-2 h-2 rounded-full bg-[#1E7E34] animate-pulse"></span>
              <span>{{ t().offlineReady }}</span>
            </div>

            <!-- Language Pill Switcher (Matching Design Spec) -->
            <div class="flex bg-[#F0F0E8] rounded-full p-1 border border-[#E0E0D5]">
              <button
                id="lang-btn-en"
                type="button"
                (click)="translation.setLanguage('en')"
                class="px-3 sm:px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer"
                [class]="translation.currentLang() === 'en' ? 'bg-white text-[#1A1A1A] shadow-xs' : 'text-[#5A5A40] hover:text-[#1A1A1A]'"
              >
                English
              </button>
              <button
                id="lang-btn-ta"
                type="button"
                (click)="translation.setLanguage('ta')"
                class="px-3 sm:px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer"
                [class]="translation.currentLang() === 'ta' ? 'bg-white text-[#1A1A1A] shadow-xs' : 'text-[#5A5A40] hover:text-[#1A1A1A]'"
              >
                தமிழ்
              </button>
            </div>

            <!-- Mobile Menu Trigger -->
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#F0F0E8] rounded-lg transition-colors cursor-pointer"
              [attr.aria-label]="mobileMenuOpen() ? 'Close menu' : 'Open menu'"
            >
              <mat-icon>{{ mobileMenuOpen() ? 'close' : 'menu' }}</mat-icon>
            </button>
          </div>
        </div>

        <!-- Mobile Drawer Navigation -->
        @if (mobileMenuOpen()) {
          <div id="mobile-nav-menu" class="md:hidden py-3 border-t border-[#E0E0D5] space-y-1">
            <a
              id="mobile-nav-home"
              routerLink="/"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-[#F0F0E8] text-[#1A1A1A] font-bold"
              [routerLinkActiveOptions]="{exact: true}"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#5A5A40] hover:bg-[#F0F0E8] hover:text-[#1A1A1A] cursor-pointer"
            >
              <mat-icon class="text-[#5A5A40]">home</mat-icon>
              <span>{{ t().navHome }}</span>
            </a>

            <a
              id="mobile-nav-search"
              routerLink="/search"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-[#F0F0E8] text-[#1A1A1A] font-bold"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#5A5A40] hover:bg-[#F0F0E8] hover:text-[#1A1A1A] cursor-pointer"
            >
              <mat-icon class="text-[#5A5A40]">search</mat-icon>
              <span>{{ t().navSearch }}</span>
            </a>

            <a
              id="mobile-nav-register"
              routerLink="/register"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-[#F0F0E8] text-[#1A1A1A] font-bold"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#5A5A40] hover:bg-[#F0F0E8] hover:text-[#1A1A1A] cursor-pointer"
            >
              <mat-icon class="text-[#5A5A40]">person_add</mat-icon>
              <span>{{ t().navRegister }}</span>
            </a>

            @if (loggedInWorker(); as worker) {
              <a
                id="mobile-nav-worker"
                routerLink="/worker-dashboard"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#F0F0E8] text-[#1A1A1A] font-bold"
                class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-[#5A5A40] hover:bg-[#F0F0E8] hover:text-[#1A1A1A] cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <mat-icon class="text-[#5A5A40]">badge</mat-icon>
                  <span>{{ t().navWorkerDashboard }} ({{ worker.fullName }})</span>
                </div>
                <span class="w-2 h-2 rounded-full bg-[#1E7E34]"></span>
              </a>
            } @else {
              <a
                id="mobile-nav-worker"
                routerLink="/worker-login"
                (click)="closeMobileMenu()"
                routerLinkActive="bg-[#F0F0E8] text-[#1A1A1A] font-bold"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#5A5A40] hover:bg-[#F0F0E8] hover:text-[#1A1A1A] cursor-pointer"
              >
                <mat-icon class="text-[#5A5A40]">badge</mat-icon>
                <span>{{ t().navWorkerLogin }}</span>
              </a>
            }

            <a
              id="mobile-nav-admin"
              routerLink="/admin"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-[#F0F0E8] text-[#1A1A1A] font-bold"
              class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-[#5A5A40] hover:bg-[#F0F0E8] hover:text-[#1A1A1A] cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <mat-icon class="text-[#5A5A40]">admin_panel_settings</mat-icon>
                <span>{{ t().navAdmin }}</span>
              </div>
              @if (pendingCount() > 0) {
                <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-[#5A5A40] text-white">
                  {{ pendingCount() }} pending
                </span>
              }
            </a>

            <!-- Mobile offline status info -->
            <div class="px-3 py-2 text-xs text-[#1E7E34] flex items-center gap-2 pt-2 border-t border-[#E0E0D5]">
              <span class="w-2 h-2 rounded-full bg-[#1E7E34]"></span>
              <span>{{ t().offlineReady }}</span>
            </div>
          </div>
        }
      </div>
    </header>
  `,
})
export class Header {
  readonly translation = inject(Translation);
  private readonly storage = inject(LocalStorage);

  readonly t = () => this.translation.t();
  readonly mobileMenuOpen = signal<boolean>(false);
  readonly loggedInWorker = computed(() => this.storage.loggedInProvider());

  readonly pendingCount = () => this.storage.pendingProviders().length;

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
