import { UserProfile } from '@/src/types';

export const FREE_PLAN_COW_LIMIT = 3;

export function isActiveProPlan(profile: UserProfile | null): boolean {
  if (!profile) return false;
  if (profile.membership_status !== 'active') return false;

  // Cek tanggal expired — jangan hanya andalkan status dari DB
  // karena cron job mungkin belum jalan saat user buka aplikasi
  if (profile.membership_end) {
    return new Date(profile.membership_end) > new Date();
  }

  return false;
}

export function canCreateCow(profile: UserProfile | null, currentCowCount: number): boolean {
  if (isActiveProPlan(profile)) return true;
  return currentCowCount < FREE_PLAN_COW_LIMIT;
}

export function canExportPdf(profile: UserProfile | null): boolean {
  return isActiveProPlan(profile);
}

export function canAccessPremiumAnalytics(profile: UserProfile | null): boolean {
  return isActiveProPlan(profile);
}

export function canUseReminder(profile: UserProfile | null): boolean {
  return isActiveProPlan(profile);
}