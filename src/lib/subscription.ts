import { UserProfile } from '@/src/types';

export const FREE_PLAN_COW_LIMIT = 3;

export function isActiveProPlan(profile: UserProfile | null): boolean {
  if (!profile) return false;
  return profile.plan_type === 'pro' && profile.subscription_status === 'active';
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
