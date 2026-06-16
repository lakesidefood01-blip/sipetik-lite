import { supabase } from '@/src/lib/supabase';

export async function upgradeUserPlan(userId: string) {
  const future = new Date();
  future.setFullYear(future.getFullYear() + 1);

  const { error } = await supabase
    .from('profiles')
    .update({
      membership_status: 'active',
      membership_start: new Date().toISOString(),
      membership_end: future.toISOString(),
    })
    .eq('id', userId);
  
  if (error) throw error;
  return true;
}

export async function downgradeUserPlan(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({
      membership_status: 'free',
      membership_start: null,
      membership_end: null
    })
    .eq('id', userId);
    
  if (error) throw error;
  return true;
}

export async function renewSubscription(userId: string, expiryDate: string) {
  const { error } = await supabase
    .from('profiles')
    .update({
      membership_status: 'active',
      membership_end: expiryDate
    })
    .eq('id', userId);
    
  if (error) throw error;
  return true;
}

export async function expireSubscription(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({
      membership_status: 'expired'
    })
    .eq('id', userId);
    
  if (error) throw error;
  return true;
}
