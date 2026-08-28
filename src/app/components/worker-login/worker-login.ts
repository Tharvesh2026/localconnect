import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {Translation} from '../../services/translation';
import {LocalStorage} from '../../services/local-storage';
import {Provider} from '../../models/provider.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-worker-login',
  imports: [RouterLink, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <!-- Breadcrumb / Back Link -->
      <div class="flex items-center justify-between">
        <a
          id="back-to-home-link"
          routerLink="/"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5A40] hover:text-[#1A1A1A] transition-colors cursor-pointer"
        >
          <mat-icon class="text-base">arrow_back</mat-icon>
          <span>{{ t().backToHome }}</span>
        </a>

        @if (storage.loggedInProvider(); as curr) {
          <button
            id="worker-logout-top-btn"
            type="button"
            (click)="onLogout()"
            class="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
          >
            <mat-icon class="text-sm">logout</mat-icon>
            <span>{{ t().workerLogout }}</span>
          </button>
        }
      </div>

      <!-- Main Login Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0E0D5] shadow-sm space-y-6">
        <!-- Header -->
        <div class="text-center space-y-2 border-b border-[#E0E0D5] pb-5">
          <div class="w-12 h-12 rounded-2xl bg-[#5A5A40] text-white mx-auto flex items-center justify-center shadow-xs">
            <mat-icon class="text-2xl">lock_person</mat-icon>
          </div>
          <h1 id="worker-login-title" class="text-2xl sm:text-3xl font-serif italic text-[#1A1A1A]" style="font-family: Georgia, serif;">
            {{ t().workerLoginTitle }}
          </h1>
          <p class="text-xs sm:text-sm text-[#5A5A40] max-w-md mx-auto leading-relaxed">
            {{ t().workerLoginSubtitle }}
          </p>
        </div>

        <!-- If Already Logged In Banner -->
        @if (storage.loggedInProvider(); as currentWorker) {
          <div class="bg-[#F9F9F7] rounded-2xl p-5 border border-[#D1D1C7] space-y-4">
            <div class="flex items-center gap-3.5">
              <img
                [src]="currentWorker.photoUrl"
                alt="Worker photo"
                referrerpolicy="no-referrer"
                class="w-12 h-12 rounded-full object-cover border border-[#E0E0D5]"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-[#1A1A1A] truncate">{{ currentWorker.fullName }}</span>
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    [class]="currentWorker.status === 'approved' ? 'bg-[#E6F4EA] text-[#1E7E34]' : 'bg-[#FFF4E5] text-[#B45309]'"
                  >
                    {{ currentWorker.status === 'approved' ? t().workerApprovalApproved : t().workerApprovalPending }}
                  </span>
                </div>
                <p class="text-xs text-[#5A5A40]">
                  {{ translation.translateSkill(currentWorker.skill) }} • {{ currentWorker.location }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                id="already-logged-dashboard-btn"
                type="button"
                (click)="goToDashboard()"
                class="py-2.5 px-4 bg-[#5A5A40] hover:bg-[#444430] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <mat-icon class="text-base">dashboard</mat-icon>
                <span>{{ t().workerGoToDashboard }}</span>
              </button>
              <button
                id="already-logged-switch-btn"
                type="button"
                (click)="onLogout()"
                class="py-2.5 px-4 bg-white border border-[#D1D1C7] hover:bg-[#F0F0E8] text-[#5A5A40] font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <mat-icon class="text-base">logout</mat-icon>
                <span>{{ t().workerLoginWithDifferent }}</span>
              </button>
            </div>
          </div>
        } @else {
          <!-- STEP 1: Enter Phone Number -->
          @if (currentStep() === 'phone') {
            <form [formGroup]="phoneForm" (ngSubmit)="onRequestOtp()" class="space-y-4">
              <div>
                <label for="worker-phone-input" class="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                  {{ t().workerPhonePrompt }} <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3.5 top-3 text-xs sm:text-sm font-semibold text-[#5A5A40]">
                    +91
                  </span>
                  <input
                    id="worker-phone-input"
                    type="tel"
                    formControlName="phoneNumber"
                    maxlength="10"
                    [placeholder]="t().workerPhonePlaceholder"
                    class="w-full pl-13 pr-4 py-2.5 text-sm sm:text-base font-mono bg-[#F9F9F7] border border-[#D1D1C7] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] text-[#1A1A1A] placeholder-[#8E8E80]"
                  />
                </div>
                <p class="text-[11px] text-[#5A5A40] mt-1">
                  {{ t().phoneHelper }}
                </p>
                @if (phoneSubmitted() && phoneForm.get('phoneNumber')?.invalid) {
                  <p class="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <mat-icon class="text-xs">error</mat-icon>
                    <span>{{ t().errorPhoneInvalid }}</span>
                  </p>
                }
              </div>

              @if (errorMessage()) {
                <div class="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <mat-icon class="text-sm mt-0.5 text-red-500">warning</mat-icon>
                  <div class="flex-1">
                    <p>{{ errorMessage() }}</p>
                    <a routerLink="/register" class="font-bold underline ml-1 text-red-800 hover:text-red-950">
                      {{ t().homeRegisterBtn }}
                    </a>
                  </div>
                </div>
              }

              <button
                id="worker-send-otp-btn"
                type="submit"
                class="w-full py-3 px-4 bg-[#5A5A40] hover:bg-[#444430] active:scale-98 text-white font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <mat-icon class="text-base">sms</mat-icon>
                <span>{{ t().workerSendOtpBtn }}</span>
              </button>
            </form>

            <!-- Quick Demo Accounts Helper -->
            <div class="border-t border-[#E0E0D5] pt-5 space-y-3">
              <p class="text-xs font-bold text-[#5A5A40] flex items-center gap-1.5">
                <mat-icon class="text-sm text-[#5A5A40]">touch_app</mat-icon>
                <span>{{ t().workerDemoAccountsTitle }}</span>
              </p>
              <div class="grid grid-cols-1 gap-2">
                @for (demo of demoProviders(); track demo.phone) {
                  <button
                    type="button"
                    (click)="fillDemoPhone(demo.phone)"
                    class="w-full text-left p-2.5 rounded-xl border border-[#E0E0D5] hover:border-[#5A5A40] bg-[#FDFCFA] hover:bg-[#F0F0E8] transition-colors cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <span class="font-bold text-[#1A1A1A]">{{ demo.name }}</span>
                      <span class="text-[#5A5A40] ml-1.5">({{ demo.skill }} • {{ demo.status }})</span>
                    </div>
                    <span class="font-mono text-[#5A5A40] font-semibold">+91 {{ demo.phone }}</span>
                  </button>
                }
              </div>
            </div>
          }

          <!-- STEP 2: Enter OTP -->
          @if (currentStep() === 'otp') {
            <!-- Simulated OTP Toast / Alert Banner (Prominent Spec Requirement) -->
            <div
              id="otp-demo-toast-banner"
              class="p-4 bg-[#E6F4EA] border-2 border-[#1E7E34] text-[#1E7E34] rounded-2xl space-y-2 shadow-sm animate-fade-in"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-xl text-[#1E7E34]">mark_chat_read</mat-icon>
                  <span class="font-extrabold text-sm uppercase tracking-wide">
                    Simulated SMS Notification
                  </span>
                </div>
                <span class="px-2 py-0.5 bg-[#1E7E34] text-white text-[10px] font-bold rounded-full">
                  DEMO OTP
                </span>
              </div>
              <p class="text-xs sm:text-sm font-medium leading-relaxed">
                {{ t().workerOtpSentToastPrefix }}
                <span class="font-mono text-lg font-extrabold underline px-1 text-[#1A1A1A] bg-white rounded-md mx-1">
                  {{ generatedOtp() }}
                </span>
                {{ t().workerOtpSentToastSuffix }}
              </p>
              <div class="pt-1 flex items-center justify-end">
                <button
                  id="auto-fill-otp-btn"
                  type="button"
                  (click)="autoFillOtp()"
                  class="px-3 py-1.5 bg-[#1E7E34] hover:bg-[#155d27] text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <mat-icon class="text-sm">content_paste</mat-icon>
                  <span>{{ t().workerAutoFillOtpBtn }}</span>
                </button>
              </div>
            </div>

            <!-- OTP Input Form -->
            <form [formGroup]="otpForm" (ngSubmit)="onVerifyOtp()" class="space-y-4 pt-1">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label for="worker-otp-input" class="block text-xs font-bold text-[#1A1A1A]">
                    {{ t().workerOtpPrompt }} <span class="text-red-500">*</span>
                  </label>
                  <span class="text-xs text-[#5A5A40] font-mono font-semibold">
                    Sent to +91 {{ targetProvider()?.phoneNumber }}
                  </span>
                </div>

                <input
                  id="worker-otp-input"
                  type="text"
                  formControlName="otp"
                  maxlength="4"
                  [placeholder]="t().workerOtpPlaceholder"
                  class="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 bg-[#F9F9F7] border-2 border-[#D1D1C7] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] text-[#1A1A1A] placeholder-[#8E8E80]"
                  autocomplete="one-time-code"
                />

                @if (otpSubmitted() && otpForm.get('otp')?.invalid) {
                  <p class="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <mat-icon class="text-xs">error</mat-icon>
                    <span>Please enter the 4-digit code</span>
                  </p>
                }
              </div>

              @if (errorMessage()) {
                <div class="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <mat-icon class="text-sm text-red-500">error</mat-icon>
                  <span>{{ errorMessage() }}</span>
                </div>
              }

              <!-- Verification Action Button -->
              <button
                id="worker-verify-otp-btn"
                type="submit"
                class="w-full py-3 px-4 bg-[#5A5A40] hover:bg-[#444430] active:scale-98 text-white font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <mat-icon class="text-base">verified_user</mat-icon>
                <span>{{ t().workerVerifyOtpBtn }}</span>
              </button>

              <!-- Secondary Navigation: Resend OTP or Change Phone -->
              <div class="flex items-center justify-between pt-2 text-xs">
                <button
                  id="change-phone-btn"
                  type="button"
                  (click)="backToPhoneStep()"
                  class="text-[#5A5A40] hover:text-[#1A1A1A] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <mat-icon class="text-sm">arrow_back</mat-icon>
                  <span>{{ t().workerChangePhone }}</span>
                </button>

                <button
                  id="resend-otp-btn"
                  type="button"
                  (click)="resendOtp()"
                  class="text-[#5A5A40] hover:text-[#1A1A1A] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <mat-icon class="text-sm">refresh</mat-icon>
                  <span>{{ t().workerResendOtp }}</span>
                </button>
              </div>
            </form>
          }
        }
      </div>

      <!-- Registration Pitch for Unregistered Workers -->
      <div class="text-center text-xs text-[#5A5A40] p-4 bg-[#F9F9F7] rounded-2xl border border-[#E0E0D5]">
        <span>New local service provider? </span>
        <a
          id="login-register-link"
          routerLink="/register"
          class="font-bold text-[#1A1A1A] underline hover:text-[#5A5A40] ml-1"
        >
          {{ t().homeRegisterBtn }}
        </a>
      </div>
    </div>
  `,
})
export class WorkerLogin {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly storage = inject(LocalStorage);
  readonly translation = inject(Translation);

  readonly t = () => this.translation.t();

  readonly currentStep = signal<'phone' | 'otp'>('phone');
  readonly generatedOtp = signal<string>('');
  readonly targetProvider = signal<Provider | null>(null);
  readonly errorMessage = signal<string>('');

  readonly phoneSubmitted = signal<boolean>(false);
  readonly otpSubmitted = signal<boolean>(false);

  readonly phoneForm = this.fb.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
  });

  readonly otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
  });

  readonly demoProviders = signal<
    {name: string; phone: string; skill: string; status: string}[]
  >([
    {
      name: 'K. Murugan',
      phone: '9840123456',
      skill: 'Electrician',
      status: 'Approved',
    },
    {
      name: 'S. Selvam',
      phone: '9443267890',
      skill: 'Plumber',
      status: 'Approved',
    },
    {
      name: 'G. Balaji',
      phone: '9894011223',
      skill: 'Carpenter',
      status: 'Pending',
    },
  ]);

  fillDemoPhone(phone: string): void {
    this.phoneForm.patchValue({phoneNumber: phone});
    this.errorMessage.set('');
  }

  async onRequestOtp(): Promise<void> {
    this.phoneSubmitted.set(true);
    this.errorMessage.set('');

    if (this.phoneForm.invalid) {
      return;
    }

    const phone = this.phoneForm.get('phoneNumber')?.value || '';
    const res = await this.storage.requestOtpForPhone(phone);

    if (!res.success) {
      this.errorMessage.set(this.t().workerErrorPhoneNotFound);
      return;
    }

    // Step 2: Display generated OTP (stored in Firestore otpSessions collection)
    this.generatedOtp.set(res.otp || '');
    this.targetProvider.set(res.provider || null);
    this.currentStep.set('otp');
    this.otpForm.reset();
    this.otpSubmitted.set(false);
  }

  autoFillOtp(): void {
    this.otpForm.patchValue({otp: this.generatedOtp()});
    this.errorMessage.set('');
  }

  async resendOtp(): Promise<void> {
    const phone =
      this.targetProvider()?.phone ||
      this.targetProvider()?.phoneNumber ||
      this.phoneForm.get('phoneNumber')?.value ||
      '';
    if (phone) {
      const res = await this.storage.requestOtpForPhone(phone);
      if (res.otp) {
        this.generatedOtp.set(res.otp);
      }
    }
    this.errorMessage.set('');
  }

  backToPhoneStep(): void {
    this.currentStep.set('phone');
    this.errorMessage.set('');
  }

  async onVerifyOtp(): Promise<void> {
    this.otpSubmitted.set(true);
    this.errorMessage.set('');

    if (this.otpForm.invalid) {
      return;
    }

    const phone =
      this.targetProvider()?.phone ||
      this.targetProvider()?.phoneNumber ||
      this.phoneForm.get('phoneNumber')?.value ||
      '';
    const enteredOtp = (this.otpForm.get('otp')?.value || '').trim();

    const res = await this.storage.verifyOtp(phone, enteredOtp);
    if (!res.success) {
      this.errorMessage.set(this.t().workerErrorInvalidOtp);
      return;
    }

    // Match verified via Firestore otpSessions! Redirect to dashboard
    this.router.navigate(['/worker-dashboard']);
  }

  onLogout(): void {
    this.storage.logoutWorker();
    this.currentStep.set('phone');
    this.targetProvider.set(null);
    this.generatedOtp.set('');
    this.phoneForm.reset();
    this.phoneSubmitted.set(false);
    this.errorMessage.set('');
  }

  goToDashboard(): void {
    this.router.navigate(['/worker-dashboard']);
  }
}
