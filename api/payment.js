import { createClient } from '@supabase/supabase-js';
import { addMonths } from 'date-fns';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-callback-token');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    // 1. Verifikasi token
    const MAYAR_WEBHOOK_TOKEN = process.env.MAYAR_WEBHOOK_TOKEN;
    const token = req.headers['x-callback-token'];

    if (MAYAR_WEBHOOK_TOKEN && token !== MAYAR_WEBHOOK_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = req.body || {};
    const event = payload.event;

    // 2. Handle test event dari Mayar
    if (event === 'testing' || !event) {
      return res.status(200).json({ success: true, message: 'Test received' });
    }

    // 3. Skip event selain payment.success
    if (event !== 'payment.success') {
      return res.status(200).json({ skip: true, message: 'Event ignored' });
    }

    const data = payload.data || {};
    const email = data.customerEmail || data?.customer?.email;
    const amount = data.amount;
    const refId = data.referenceId || data.id;

    if (!email || !amount) {
      return res.status(400).json({ error: 'Invalid payload: missing email or amount' });
    }

    // 4. Init Supabase dengan Service Role Key
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 5. Cari user by email
    const { data: usersData, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) return res.status(500).json({ error: 'Failed to fetch users' });

    const foundUser = usersData?.users?.find(u => u.email === email);
    if (!foundUser) {
      console.log('User not found:', email);
      return res.status(200).json({ success: true, message: 'User not found, skipping' });
    }

    // 6. Ambil profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, membership_status, membership_end')
      .eq('id', foundUser.id)
      .single();

    if (!profile) {
      return res.status(200).json({ success: true, message: 'Profile not found, skipping' });
    }

    // 7. Hitung periode membership
    const now = new Date();
    const currentEnd = profile.membership_end ? new Date(profile.membership_end) : null;
    const isStillActive = currentEnd && currentEnd > now;
    const periodStart = isStillActive ? currentEnd : now;
    const periodEnd = addMonths(periodStart, 1);

    // 8. Update membership
    await supabase
      .from('profiles')
      .update({
        membership_status: 'active',
        membership_start: periodStart.toISOString(),
        membership_end: periodEnd.toISOString(),
      })
      .eq('id', profile.id);

    // 9. Catat transaksi
    await supabase.from('membership_payments').insert({
      user_id: profile.id,
      reference_id: refId,
      amount,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
    });

    console.log(`Membership aktif untuk: ${profile.id}`);
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}