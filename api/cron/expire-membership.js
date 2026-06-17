import { createClient } from '@supabase/supabase-js';

// Vercel Cron Job — jalankan setiap hari jam 00:00 WIB (17:00 UTC)
// Konfigurasi di vercel.json:
// {
//   "crons": [{ "path": "/api/cron/expire-membership", "schedule": "0 17 * * *" }]
// }

export default async function handler(req, res) {
  // Vercel Cron kirim via GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Verifikasi cron secret agar tidak bisa dipanggil sembarang orang
  const secret = req.headers['x-cron-secret'];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const now = new Date().toISOString();

    // Update semua membership yang sudah melewati tanggal expired
    const { count, error } = await supabase
      .from('profiles')
      .update({ membership_status: 'expired' })
      .eq('membership_status', 'active')
      .lt('membership_end', now)
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.error('Cron expire error:', error);
      return res.status(500).json({ error: 'Failed to expire memberships' });
    }

    console.log(`Cron selesai. Total expired: ${count ?? 0} user`);
    return res.status(200).json({
      success: true,
      expired_count: count ?? 0,
      run_at: now,
    });

  } catch (err) {
    console.error('Cron error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}