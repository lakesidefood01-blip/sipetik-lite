import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAppStore } from '@/src/store/useAppStore';

export function useMembership() {
  const user = useAppStore((state) => state.user);
  const [status, setStatus] = useState<'free' | 'active' | 'expired'>('free');
  const [expDate, setExpDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('profiles')
          .select('membership_status, membership_end')
          .eq('id', user.id)
          .single();

        const now = new Date();
        const exp = data?.membership_end ? new Date(data.membership_end) : null;
        const expired = exp && exp < now;

        const newStatus = expired ? 'expired' : data?.membership_status ?? 'free';
        setStatus(newStatus);
        setExpDate(exp);
        
        // If expired, let's update DB immediately just like in the markdown backend/realtime approach
        if (expired && data?.membership_status === 'active') {
          await supabase
            .from('profiles')
            .update({ membership_status: 'expired' })
            .eq('id', user.id);
        }
      } catch (err) {
        console.error('Failed checking membership', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const daysLeft = expDate
    ? Math.max(0, Math.ceil((expDate.getTime() - Date.now()) / 86400000))
    : 0;

  return { status, expDate, daysLeft, loading, isActive: status === 'active' };
}
