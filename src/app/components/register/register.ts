import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {Translation} from '../../services/translation';
import {LocalStorage} from '../../services/local-storage';
import {Availability, Provider, SkillType} from '../../models/provider.model';
import {createSvgAvatar} from '../../services/seed-data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, MatIconModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <!-- Top Breadcrumb / Navigation link -->
      <div class="mb-6">
        <a
          id="back-to-home-link"
          routerLink="/"
          class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5A5A40] hover:text-[#1A1A1A] transition-colors cursor-pointer"
        >
          <mat-icon class="text-base">arrow_back</mat-icon>
          <span>{{ t().backToHome }}</span>
        </a>
      </div>

      <!-- Success Screen -->
      @if (submittedSuccess()) {
        <div
          id="registration-success-card"
          class="bg-white rounded-3xl p-8 sm:p-10 border border-[#E0E0D5] shadow-sm text-center space-y-6"
        >
          <div class="w-16 h-16 rounded-full bg-[#E6F4EA] text-[#1E7E34] flex items-center justify-center mx-auto text-3xl shadow-xs">
            <mat-icon class="text-3xl">check_circle</mat-icon>
          </div>

          <div class="space-y-2 max-w-lg mx-auto">
            <h2 class="text-2xl sm:text-3xl font-serif italic text-[#1A1A1A]" style="font-family: Georgia, serif;">
              {{ t().regSuccessTitle }}
            </h2>
            <p class="text-sm sm:text-base text-[#5A5A40] leading-relaxed">
              {{ t().regSuccessDesc }}
            </p>
          </div>

          <!-- Pending provider preview badge -->
          @if (createdProvider(); as prov) {
            <div class="bg-[#F9F9F7] border border-[#D1D1C7] rounded-2xl p-5 max-w-md mx-auto text-left space-y-3">
              <div class="flex items-center gap-3">
                <img
                  [src]="prov.photoUrl"
                  [alt]="prov.fullName"
                  referrerpolicy="no-referrer"
                  class="w-14 h-14 rounded-2xl object-cover border border-[#E0E0D5] bg-white"
                />
                <div>
                  <h4 class="font-bold text-[#1A1A1A] text-base">{{ prov.fullName }}</h4>
                  <p class="text-xs text-[#5A5A40]">
                    {{ translation.translateSkill(prov.skill) }} • {{ prov.location }}
                  </p>
                  <p class="text-xs font-mono font-bold text-[#1A1A1A] mt-0.5">
                    +91 {{ prov.phoneNumber }}
                  </p>
                </div>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-[#E0E0D5] text-xs">
                <span class="text-[#5A5A40] font-medium">Status:</span>
                <span class="px-2.5 py-1 rounded-full font-bold bg-[#FFF4E5] text-[#B45309] flex items-center gap-1">
                  <mat-icon class="text-sm">hourglass_top</mat-icon>
                  Pending Admin Approval
                </span>
              </div>
            </div>
          }

          <div class="pt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              id="success-view-directory-btn"
              routerLink="/search"
              class="px-6 py-3 bg-[#5A5A40] hover:bg-[#444430] active:scale-95 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <mat-icon class="text-base">search</mat-icon>
              <span>{{ t().viewStatusBtn }}</span>
            </a>

            <a
              id="success-view-admin-btn"
              routerLink="/admin"
              class="px-6 py-3 bg-white hover:bg-[#F0F0E8] active:scale-95 text-[#5A5A40] font-bold text-sm rounded-xl border border-[#5A5A40] transition-all flex items-center gap-2 cursor-pointer"
            >
              <mat-icon class="text-base">admin_panel_settings</mat-icon>
              <span>{{ t().navAdmin }} (Approve Demo)</span>
            </a>

            <button
              type="button"
              id="register-another-btn"
              (click)="resetFormState()"
              class="px-5 py-3 bg-[#F0F0E8] hover:bg-[#E0E0D5] text-[#5A5A40] font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Register Another Provider
            </button>
          </div>
        </div>
      } @else {
        <!-- Signup Form -->
        <div class="bg-white rounded-3xl p-6 sm:p-10 border border-[#E0E0D5] shadow-xs space-y-8">
          <!-- Form Header -->
          <div class="border-b border-[#E0E0D5] pb-5">
            <h1 id="register-page-title" class="text-2xl sm:text-3xl font-serif italic text-[#1A1A1A]" style="font-family: Georgia, serif;">
              {{ t().regTitle }}
            </h1>
            <p class="text-xs sm:text-sm text-[#5A5A40] mt-2 leading-relaxed">
              {{ t().regSubtitle }}
            </p>
          </div>

          <!-- Error Alert Banner (e.g. Duplicate Phone Number) -->
          @if (formErrorMessage()) {
            <div
              id="register-error-banner"
              class="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs sm:text-sm flex items-start gap-3"
            >
              <mat-icon class="text-red-600 mt-0.5 shrink-0">error</mat-icon>
              <div>
                <p class="font-bold">{{ formErrorMessage() }}</p>
              </div>
            </div>
          }

          <form [formGroup]="providerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Full Name Input -->
            <div>
              <label for="reg-fullname-input" class="block text-xs sm:text-sm font-bold text-[#5A5A40] mb-1.5">
                {{ t().fullNameLabel }} <span class="text-red-500">*</span>
              </label>
              <input
                id="reg-fullname-input"
                type="text"
                formControlName="fullName"
                [placeholder]="t().fullNamePlaceholder"
                class="w-full px-4 py-3 bg-white border border-[#D1D1C7] rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:border-transparent text-[#1A1A1A] placeholder-[#8E8E80]"
              />
              @if (isFieldInvalid('fullName')) {
                <p class="text-red-600 text-xs mt-1 font-medium">{{ t().errorNameRequired }}</p>
              }
            </div>

            <!-- Phone Number Input with Duplicate Protection -->
            <div>
              <label for="reg-phone-input" class="block text-xs sm:text-sm font-bold text-[#5A5A40] mb-1.5">
                {{ t().phoneLabel }} <span class="text-red-500">*</span>
              </label>
              <div class="relative flex items-center">
                <span class="absolute left-3.5 text-[#5A5A40] font-bold text-sm select-none">
                  +91
                </span>
                <input
                  id="reg-phone-input"
                  type="tel"
                  formControlName="phoneNumber"
                  [placeholder]="t().phonePlaceholder"
                  maxlength="10"
                  class="w-full pl-14 pr-4 py-3 bg-white border border-[#D1D1C7] rounded-xl text-sm font-mono tracking-wider focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:border-transparent text-[#1A1A1A] placeholder-[#8E8E80]"
                />
              </div>
              <p class="text-[11px] text-[#8E8E80] mt-1">{{ t().phoneHelper }}</p>
              @if (isFieldInvalid('phoneNumber')) {
                <p class="text-red-600 text-xs mt-1 font-medium">{{ t().errorPhoneInvalid }}</p>
              }
            </div>

            <!-- Profile Photo Upload (Base64 conversion) -->
            <div>
              <span class="block text-xs sm:text-sm font-bold text-[#5A5A40] mb-1.5">
                {{ t().photoLabel }}
              </span>

              <div class="flex items-center gap-4">
                <!-- Photo Preview Avatar -->
                <div class="relative shrink-0">
                  <img
                    [src]="uploadedPhotoBase64() || defaultPreviewAvatar()"
                    alt="Preview"
                    referrerpolicy="no-referrer"
                    class="w-20 h-20 rounded-2xl object-cover border border-[#D1D1C7] shadow-2xs bg-[#F0F0E8]"
                  />
                  @if (uploadedPhotoBase64()) {
                    <button
                      type="button"
                      id="remove-photo-btn"
                      (click)="removePhoto()"
                      class="absolute -top-1 -right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
                      [attr.aria-label]="t().photoRemovePrompt"
                    >
                      <mat-icon class="text-xs leading-none">close</mat-icon>
                    </button>
                  }
                </div>

                <!-- Upload Area / Picker Button -->
                <div class="flex-1">
                  <input
                    #fileInput
                    id="photo-file-input"
                    type="file"
                    accept="image/*"
                    (change)="onFileSelected($event)"
                    class="hidden"
                  />
                  <button
                    type="button"
                    id="choose-photo-btn"
                    (click)="fileInput.click()"
                    class="w-full sm:w-auto px-4 py-2.5 bg-[#F0F0E8] hover:bg-[#E0E0D5] text-[#5A5A40] font-bold text-xs sm:text-sm rounded-xl border border-[#D1D1C7] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <mat-icon class="text-base text-[#5A5A40]">add_a_photo</mat-icon>
                    <span>
                      {{ uploadedPhotoBase64() ? t().photoChangePrompt : t().photoUploadPrompt }}
                    </span>
                  </button>
                  <p class="text-[11px] text-[#8E8E80] mt-1">
                    JPEG, PNG or WebP. Auto-compressed and stored in local storage.
                  </p>
                </div>
              </div>
            </div>

            <!-- Skill / Category Dropdown -->
            <div>
              <label for="reg-skill-select" class="block text-xs sm:text-sm font-bold text-[#5A5A40] mb-1.5">
                {{ t().skillLabel }} <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  id="reg-skill-select"
                  formControlName="skill"
                  class="w-full px-4 py-3 bg-white border border-[#D1D1C7] rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:border-transparent appearance-none pr-10 text-[#1A1A1A] cursor-pointer"
                >
                  <option value="" disabled>-- Select a Skill / Service --</option>
                  @for (skill of skillsList; track skill) {
                    <option [value]="skill">
                      {{ translation.translateSkill(skill) }}
                    </option>
                  }
                </select>
                <mat-icon class="absolute right-3.5 top-3.5 text-[#5A5A40] pointer-events-none">expand_more</mat-icon>
              </div>
              @if (isFieldInvalid('skill')) {
                <p class="text-red-600 text-xs mt-1 font-medium">{{ t().errorSkillRequired }}</p>
              }
            </div>

            <!-- Custom Skill Field (if 'Other' is selected) -->
            @if (providerForm.get('skill')?.value === 'Other') {
              <div class="p-4 bg-[#F9F9F7] rounded-xl border border-[#D1D1C7] space-y-1.5">
                <label for="reg-custom-skill-input" class="block text-xs font-bold text-[#5A5A40]">
                  {{ t().customSkillLabel }} <span class="text-red-500">*</span>
                </label>
                <input
                  id="reg-custom-skill-input"
                  type="text"
                  formControlName="customSkill"
                  [placeholder]="t().customSkillPlaceholder"
                  class="w-full px-3 py-2.5 bg-white border border-[#D1D1C7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40] text-[#1A1A1A]"
                />
              </div>
            }

            <!-- Location (Village or Town Name) -->
            <div>
              <label for="reg-location-input" class="block text-xs sm:text-sm font-bold text-[#5A5A40] mb-1.5">
                {{ t().locationInputLabel }} <span class="text-red-500">*</span>
              </label>
              <input
                id="reg-location-input"
                type="text"
                formControlName="location"
                [placeholder]="t().locationInputPlaceholder"
                class="w-full px-4 py-3 bg-white border border-[#D1D1C7] rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:border-transparent text-[#1A1A1A] placeholder-[#8E8E80]"
              />
              @if (isFieldInvalid('location')) {
                <p class="text-red-600 text-xs mt-1 font-medium">{{ t().errorLocationRequired }}</p>
              }
              <!-- Quick Suggestions for Village/Town -->
              <div class="flex flex-wrap items-center gap-1.5 mt-2">
                <span class="text-[11px] text-[#8E8E80]">Popular:</span>
                @for (loc of ['Thanjavur', 'Pollachi', 'Madurai', 'Karaikudi', 'Tenkasi', 'Tiruvannamalai']; track loc) {
                  <button
                    type="button"
                    (click)="setLocationValue(loc)"
                    class="text-[11px] px-2 py-0.5 bg-[#F0F0E8] hover:bg-[#E0E0D5] hover:text-[#1A1A1A] rounded-md text-[#5A5A40] transition-colors cursor-pointer"
                  >
                    {{ loc }}
                  </button>
                }
              </div>
            </div>

            <!-- Availability Dropdown -->
            <div>
              <label for="reg-availability-select" class="block text-xs sm:text-sm font-bold text-[#5A5A40] mb-1.5">
                {{ t().availabilityLabel }} <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  id="reg-availability-select"
                  formControlName="availability"
                  class="w-full px-4 py-3 bg-white border border-[#D1D1C7] rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:border-transparent appearance-none pr-10 text-[#1A1A1A] cursor-pointer"
                >
                  <option value="Available Now">{{ t().availNow }}</option>
                  <option value="Available Today">{{ t().availToday }}</option>
                  <option value="Available This Week">{{ t().availThisWeek }}</option>
                </select>
                <mat-icon class="absolute right-3.5 top-3.5 text-[#5A5A40] pointer-events-none">expand_more</mat-icon>
              </div>
            </div>

            <!-- Experience in Years (Optional) -->
            <div>
              <label for="reg-experience-input" class="block text-xs sm:text-sm font-bold text-[#5A5A40] mb-1.5">
                {{ t().experienceLabel }}
              </label>
              <input
                id="reg-experience-input"
                type="number"
                min="0"
                max="60"
                formControlName="experienceYears"
                [placeholder]="t().experiencePlaceholder"
                class="w-full px-4 py-3 bg-white border border-[#D1D1C7] rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] text-[#1A1A1A] placeholder-[#8E8E80]"
              />
            </div>

            <!-- Short Bio / Note (Optional) -->
            <div>
              <label for="reg-bio-textarea" class="block text-xs sm:text-sm font-bold text-[#5A5A40] mb-1.5">
                {{ t().bioLabel }}
              </label>
              <textarea
                id="reg-bio-textarea"
                rows="3"
                formControlName="bio"
                [placeholder]="t().bioPlaceholder"
                class="w-full px-4 py-3 bg-white border border-[#D1D1C7] rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40] text-[#1A1A1A] placeholder-[#8E8E80] resize-none"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <div class="pt-4 border-t border-[#E0E0D5]">
              <button
                id="submit-registration-btn"
                type="submit"
                [disabled]="isSubmitting()"
                class="w-full py-4 px-6 bg-[#5A5A40] hover:bg-[#444430] active:scale-98 text-white font-bold text-base rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                @if (isSubmitting()) {
                  <mat-icon class="animate-spin text-xl">refresh</mat-icon>
                  <span>{{ t().submitting }}</span>
                } @else {
                  <mat-icon class="text-xl">send</mat-icon>
                  <span>{{ t().submitRegistration }}</span>
                }
              </button>
              <p class="text-center text-xs text-[#8E8E80] mt-2 font-medium">
                Note: Submissions are saved locally with status "pending" until approved by the admin.
              </p>
            </div>
          </form>
        </div>
      }
    </div>
  `,
})
export class Register {
  private readonly router = inject(Router);
  private readonly storage = inject(LocalStorage);
  readonly translation = inject(Translation);

  readonly t = () => this.translation.t();

  readonly isSubmitting = signal<boolean>(false);
  readonly submitted = signal<boolean>(false);
  readonly submittedSuccess = signal<boolean>(false);
  readonly formErrorMessage = signal<string | null>(null);
  readonly uploadedPhotoBase64 = signal<string | null>(null);
  readonly createdProvider = signal<Provider | null>(null);

  readonly skillsList: SkillType[] = [
    'Electrician',
    'Plumber',
    'Tailor',
    'Tutor',
    'Carpenter',
    'Auto Driver',
    'Other',
  ];

  readonly providerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{10}$/),
    ]),
    skill: new FormControl<SkillType>('Electrician', [Validators.required]),
    customSkill: new FormControl(''),
    location: new FormControl('', [Validators.required, Validators.minLength(2)]),
    availability: new FormControl<Availability>('Available Now', [Validators.required]),
    experienceYears: new FormControl<number | null>(null),
    bio: new FormControl(''),
  });

  defaultPreviewAvatar(): string {
    const name = this.providerForm.get('fullName')?.value || 'VP';
    const initials = name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || '')
      .join('') || 'VP';
    return createSvgAvatar(initials, '#5A5A40', '#ffffff', '👤');
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.providerForm.get(fieldName);
    return Boolean(this.submitted() && control && control.invalid);
  }

  setLocationValue(loc: string): void {
    this.providerForm.patchValue({location: loc});
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Compress and resize with HTML5 canvas to keep storage light and snappy
      this.compressImage(result, 240, 240, (compressed) => {
        this.uploadedPhotoBase64.set(compressed);
      });
    };
    reader.readAsDataURL(file);
  }

  private compressImage(
    dataUrl: string,
    maxWidth: number,
    maxHeight: number,
    callback: (compressed: string) => void
  ): void {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        callback(compressedBase64);
      } else {
        callback(dataUrl);
      }
    };
    img.src = dataUrl;
  }

  removePhoto(): void {
    this.uploadedPhotoBase64.set(null);
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.formErrorMessage.set(null);

    if (this.providerForm.invalid) {
      return;
    }

    const val = this.providerForm.value;

    const finalPhoto =
      this.uploadedPhotoBase64() ||
      createSvgAvatar(
        val.fullName
          ?.trim()
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0]?.toUpperCase() || '')
          .join('') || 'VP',
        '#d97706',
        '#ffffff',
        '⭐'
      );

    this.isSubmitting.set(true);

    const result = this.storage.addProvider({
      fullName: val.fullName || '',
      photoUrl: finalPhoto,
      phoneNumber: val.phoneNumber || '',
      skill: val.skill as SkillType,
      customSkill: val.customSkill || undefined,
      location: val.location || '',
      availability: val.availability as Availability,
      experienceYears: val.experienceYears || undefined,
      bio: val.bio || undefined,
    });

    this.isSubmitting.set(false);

    if (!result.success) {
      if (result.error === 'duplicate_phone') {
        this.formErrorMessage.set(this.t().errorPhoneDuplicate);
      } else {
        this.formErrorMessage.set(this.t().errorPhoneInvalid);
      }
      return;
    }

    // Success!
    this.createdProvider.set(result.provider || null);
    this.submittedSuccess.set(true);
  }

  resetFormState(): void {
    this.providerForm.reset({
      skill: 'Electrician',
      availability: 'Available Now',
    });
    this.uploadedPhotoBase64.set(null);
    this.submitted.set(false);
    this.submittedSuccess.set(false);
    this.formErrorMessage.set(null);
    this.createdProvider.set(null);
  }
}
