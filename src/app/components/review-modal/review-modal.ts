import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {DatePipe} from '@angular/common';
import {Provider, Review} from '../../models/provider.model';
import {LocalStorage} from '../../services/local-storage';
import {Translation} from '../../services/translation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-review-modal',
  imports: [ReactiveFormsModule, MatIconModule, DatePipe],
  template: `
    <div
      id="review-modal-backdrop"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto"
      (click)="onBackdropClick($event)"
      (keydown.escape)="closeModal.emit()"
      tabindex="0"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="review-modal-card"
        class="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#E0E0D5] overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        <!-- Modal Header -->
        <div class="p-5 border-b border-[#E0E0D5] bg-[#F9F9F7] flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img
              [src]="provider().photoUrl"
              [alt]="provider().fullName"
              referrerpolicy="no-referrer"
              class="w-12 h-12 rounded-full object-cover border border-[#E0E0D5] shadow-2xs"
            />
            <div>
              <h3 id="modal-provider-name" class="font-serif italic text-[#1A1A1A] text-lg leading-tight" style="font-family: Georgia, serif;">
                {{ provider().fullName }}
              </h3>
              <p class="text-xs text-[#5A5A40] mt-0.5">
                {{ translation.translateSkill(provider().skill) }} • {{ provider().location }}
              </p>
            </div>
          </div>
          <button
            id="close-review-modal-btn"
            type="button"
            (click)="closeModal.emit()"
            class="p-2 text-[#5A5A40] hover:text-[#1A1A1A] hover:bg-[#F0F0E8] rounded-full transition-colors cursor-pointer"
            [attr.aria-label]="t().closeModal"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto p-5 space-y-6 flex-1">
          <!-- Average Rating Summary -->
          <div class="bg-[#F9F9F7] rounded-xl p-4 border border-[#E0E0D5] flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-3xl font-serif font-bold text-[#1A1A1A]" style="font-family: Georgia, serif;">
                  {{ provider().averageRating > 0 ? provider().averageRating : '—' }}
                </span>
                <div class="flex text-[#B45309]">
                  @for (star of [1, 2, 3, 4, 5]; track star) {
                    <mat-icon class="text-xl">
                      {{ star <= provider().averageRating ? 'star' : (star - 0.5 <= provider().averageRating ? 'star_half' : 'star_border') }}
                    </mat-icon>
                  }
                </div>
              </div>
              <p class="text-xs text-[#5A5A40] font-medium mt-1">
                {{ provider().reviewCount }} {{ t().reviewsCountText }}
              </p>
            </div>

            <div class="text-right">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E6F4EA] text-[#1E7E34]">
                <mat-icon class="text-sm">verified</mat-icon>
                {{ t().verifiedBadge }}
              </span>
            </div>
          </div>

          <!-- Add Review Form -->
          <div class="border border-[#D1D1C7] bg-[#FDFCFA] rounded-xl p-4">
            <h4 class="font-serif font-bold text-[#1A1A1A] text-sm flex items-center gap-2 mb-3" style="font-family: Georgia, serif;">
              <mat-icon class="text-[#5A5A40] text-lg">rate_review</mat-icon>
              {{ t().addReviewTitle }}
            </h4>

            @if (showSuccessMessage()) {
              <div class="p-3 mb-3 bg-[#E6F4EA] text-[#1E7E34] border border-[#A6D5B4] text-xs rounded-lg flex items-center gap-2 font-medium">
                <mat-icon class="text-[#1E7E34] text-base">check_circle</mat-icon>
                {{ t().reviewAddedSuccess }}
              </div>
            }

            <form [formGroup]="reviewForm" (ngSubmit)="submitReview()" class="space-y-3">
              <!-- Star Picker -->
              <div>
                <span class="block text-xs font-semibold text-[#5A5A40] mb-1">
                  {{ t().ratingSelectPrompt }}
                </span>
                <div class="flex items-center gap-1.5" role="radiogroup" aria-label="Rating selection">
                  @for (s of [1, 2, 3, 4, 5]; track s) {
                    <button
                      type="button"
                      [id]="'star-btn-' + s"
                      (click)="setRating(s)"
                      (mouseenter)="hoverRating.set(s)"
                      (mouseleave)="hoverRating.set(0)"
                      class="p-1 rounded-md text-[#B45309] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      [attr.aria-label]="s + ' stars'"
                    >
                      <mat-icon class="text-28 leading-none">
                        {{ s <= (hoverRating() || selectedRating()) ? 'star' : 'star_border' }}
                      </mat-icon>
                    </button>
                  }
                  <span class="ml-2 text-xs font-bold text-[#5A5A40]">
                    {{ selectedRating() > 0 ? selectedRating() + '/5' : '' }}
                  </span>
                </div>
                @if (submitted() && selectedRating() === 0) {
                  <p class="text-red-600 text-xs mt-1">{{ t().errorRatingRequired }}</p>
                }
              </div>

              <!-- Reviewer Name -->
              <div>
                <label for="reviewer-name-input" class="block text-xs font-semibold text-[#5A5A40] mb-1">
                  {{ t().reviewerNameLabel }} <span class="text-red-500">*</span>
                </label>
                <input
                  id="reviewer-name-input"
                  type="text"
                  formControlName="reviewerName"
                  [placeholder]="t().reviewerNamePlaceholder"
                  class="w-full px-3 py-2 text-sm bg-white border border-[#D1D1C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A5A40] text-[#1A1A1A] placeholder-[#8E8E80]"
                />
                @if (submitted() && reviewForm.get('reviewerName')?.invalid) {
                  <p class="text-red-600 text-xs mt-1">{{ t().errorReviewerNameRequired }}</p>
                }
              </div>

              <!-- Comment -->
              <div>
                <label for="review-comment-input" class="block text-xs font-semibold text-[#5A5A40] mb-1">
                  {{ t().reviewCommentLabel }}
                </label>
                <textarea
                  id="review-comment-input"
                  rows="2"
                  formControlName="comment"
                  [placeholder]="t().reviewCommentPlaceholder"
                  class="w-full px-3 py-2 text-sm bg-white border border-[#D1D1C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A5A40] text-[#1A1A1A] placeholder-[#8E8E80] resize-none"
                ></textarea>
              </div>

              <button
                id="submit-review-btn"
                type="submit"
                class="w-full py-2.5 px-4 bg-[#5A5A40] hover:bg-[#444430] text-white font-bold text-sm rounded-lg shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <mat-icon class="text-base">send</mat-icon>
                {{ t().submitReviewBtn }}
              </button>
            </form>
          </div>

          <!-- Existing Reviews List -->
          <div>
            <h4 class="font-serif font-bold text-[#1A1A1A] text-sm mb-3 flex items-center gap-2" style="font-family: Georgia, serif;">
              <mat-icon class="text-[#5A5A40] text-base">forum</mat-icon>
              {{ t().reviewsTitle }} ({{ reviews().length }})
            </h4>

            @if (reviews().length === 0) {
              <div class="text-center py-6 px-4 bg-[#F9F9F7] rounded-xl border border-dashed border-[#D1D1C7]">
                <mat-icon class="text-[#8E8E80] text-3xl">rate_review</mat-icon>
                <p class="text-xs text-[#5A5A40] mt-1 font-medium">{{ t().noReviewsYet }}</p>
              </div>
            } @else {
              <div class="space-y-3">
                @for (rev of reviews(); track rev.id) {
                  <div class="p-3 bg-[#F9F9F7] rounded-xl border border-[#E0E0D5] text-xs">
                    <div class="flex items-center justify-between mb-1.5">
                      <div class="flex items-center gap-1.5 font-bold text-[#1A1A1A]">
                        <mat-icon class="text-[#8E8E80] text-sm">person</mat-icon>
                        <span>{{ rev.reviewerName }}</span>
                      </div>
                      <div class="flex text-[#B45309]">
                        @for (st of [1, 2, 3, 4, 5]; track st) {
                          <mat-icon class="text-xs">
                            {{ st <= rev.rating ? 'star' : 'star_border' }}
                          </mat-icon>
                        }
                      </div>
                    </div>
                    @if (rev.comment) {
                      <p class="text-[#5A5A40] leading-relaxed pl-5 font-normal">
                        "{{ rev.comment }}"
                      </p>
                    }
                    <div class="text-[10px] text-[#8E8E80] text-right mt-1">
                      {{ rev.createdAt | date: 'mediumDate' }}
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-[#E0E0D5] bg-[#F9F9F7] flex justify-end">
          <button
            id="close-modal-footer-btn"
            type="button"
            (click)="closeModal.emit()"
            class="px-4 py-2 text-xs font-semibold text-[#5A5A40] bg-white border border-[#D1D1C7] hover:bg-[#F0F0E8] rounded-lg cursor-pointer transition-colors"
          >
            {{ t().closeModal }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ReviewModal {
  readonly provider = input.required<Provider>();
  readonly closeModal = output<void>();

  private readonly storage = inject(LocalStorage);
  readonly translation = inject(Translation);
  readonly t = () => this.translation.t();

  readonly selectedRating = signal<number>(5);
  readonly hoverRating = signal<number>(0);
  readonly submitted = signal<boolean>(false);
  readonly showSuccessMessage = signal<boolean>(false);

  readonly reviewForm = new FormGroup({
    reviewerName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    comment: new FormControl(''),
  });

  readonly reviews = signal<Review[]>([]);

  constructor() {
    // Initial fetch of reviews
    setTimeout(() => {
      this.refreshReviews();
    }, 0);
  }

  refreshReviews(): void {
    const provId = this.provider().id;
    this.reviews.set(this.storage.getReviewsForProvider(provId));
  }

  setRating(rating: number): void {
    this.selectedRating.set(rating);
  }

  submitReview(): void {
    this.submitted.set(true);
    if (this.selectedRating() === 0 || this.reviewForm.invalid) {
      return;
    }

    const {reviewerName, comment} = this.reviewForm.value;
    this.storage.addReview(
      this.provider().id,
      this.selectedRating(),
      comment || '',
      reviewerName || 'Village Resident'
    );

    this.refreshReviews();
    this.showSuccessMessage.set(true);
    this.reviewForm.reset();
    this.submitted.set(false);
    this.selectedRating.set(5);

    setTimeout(() => {
      this.showSuccessMessage.set(false);
    }, 4000);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).id === 'review-modal-backdrop') {
      this.closeModal.emit();
    }
  }
}
