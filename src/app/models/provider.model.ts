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
  name: string; // Firestore field
  fullName: string; // Compatibility alias
  photoUrl: string; // base64 data URL or SVG avatar
  phone: string; // Firestore field
  phoneNumber: string; // Compatibility alias
  skill: SkillType;
  customSkill?: string; // If skill === 'Other'
  location: string; // Village or town name
  availability: Availability;
  status: ProviderStatus;
  isVisible: boolean; // Firestore field
  isPublicVisible: boolean; // Compatibility alias
  bio?: string;
  experienceYears?: number;
  createdAt: string;
  approvedAt?: string;
  averageRating: number;
  reviewCount: number;
}

export interface OtpSession {
  id: string;
  phone: string;
  otp: string;
  createdAt: string;
  expiresAt: string;
}
