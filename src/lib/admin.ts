import { supabase } from '@/src/lib/supabase';
import { PlanType, SubscriptionStatus } from '@/src/types';

export async function upgradeUserPlan(userId: string, newPlan: PlanType = 'pro') {
  const { error } = await supabase
    .from('profiles')
    .update({
      plan_type: newPlan,
      subscription_status: 'active',
      subscription_started_at: new Date().toISOString(),
      // misal paket masa berlaku 1 tahun atau null (unlimited / diproses backend)
      subscription_expired_at: null 
    })
    .eq('id', userId);
  
  if (error) throw error;
  return true;
}

export async function downgradeUserPlan(userId: string, newPlan: PlanType = 'free') {
  const { error } = await supabase
    .from('profiles')
    .update({
      plan_type: newPlan,
      subscription_status: 'active',
      subscription_started_at: null,
      subscription_expired_at: null
    })
    .eq('id', userId);
    
  if (error) throw error;
  return true;
}

export async function renewSubscription(userId: string, expiryDate: string) {
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_expired_at: expiryDate
    })
    .eq('id', userId);
    
  if (error) throw error;
  return true;
}

export async function expireSubscription(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'unpaid'
    })
    .eq('id', userId);
    
  if (error) throw error;
  return true;
}
