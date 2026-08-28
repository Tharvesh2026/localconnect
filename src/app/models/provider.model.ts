export type SkillType =
  | 'Electrician'
  | 'Plumber'
  | 'Tailor'
  | 'Tutor'
  | 'Carpenter'
  | 'Auto Driver'
  | 'Other';

export type Availability =
  | 'Available Now'
  | 'Available Today'
  | 'Available This Week';

export type ProviderStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  providerId: string;
  rating: number; // 1 to 5
  comment: string;
  reviewerName: string;
  createdAt: string; // ISO date string
}

export interface Provider {
  id: string;
  fullName: string;
  photoUrl: string; // base64 data URL or SVG avatar
  phoneNumber: string;
  skill: SkillType;
  customSkill?: string; // If skill === 'Other'
  location: string; // Village or town name
  availability: Availability;
  status: ProviderStatus;
  bio?: string;
  experienceYears?: number;
  createdAt: string;
  approvedAt?: string;
  averageRating: number;
  reviewCount: number;
}
