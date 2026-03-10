export type UserRole = 'user' | 'trainer' | 'admin';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type SubscriptionPlan = 'free' | 'basic' | 'pro';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

export interface User {
  id: string; name: string; email: string; role: UserRole;
  avatar_url: string | null; is_active: boolean; created_at: string;
}
export interface Trainer {
  id: string; user_id: string; name: string; email: string;
  avatar_url: string | null; bio: string | null; specialization: string[];
  rating: number; total_reviews: number; created_at: string;
}
export interface Class {
  id: string; trainer_id: string; trainer_name: string; title: string;
  description: string | null; capacity: number; duration_min: number;
  scheduled_at: string; location: string | null; is_cancelled: boolean;
  booked_count: number; created_at: string;
}
export interface Booking {
  id: string; user_id: string; user_name: string; user_email: string;
  class_id: string; title: string; scheduled_at: string;
  status: BookingStatus; checked_in: boolean; created_at: string;
}
export interface Subscription {
  id: string; user_id: string; name: string; email: string;
  plan: SubscriptionPlan; status: SubscriptionStatus;
  stripe_sub_id: string | null; current_period_end: string | null; created_at: string;
}
export interface AuthUser { userId: string; email: string; role: UserRole; }
export interface ApiResponse<T> { success: boolean; message: string; data: T; }
