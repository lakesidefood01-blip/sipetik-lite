import { createClient } from '@supabase/supabase-js';

// Vercel Serverless Function /api/payment
export default async function handler(req, res) {
  // Hanya menerima metode POST dari webhook Mayar
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Verifikasi Token dari Header
    // Pastikan diset di Environment Variables (contoh: Vercel / .env)
    const MAYAR_WEBHOOK_TOKEN = process.env.MAYAR_WEBHOOK_TOKEN;
    const token = req.headers['x-callback-token'];

    if (MAYAR_WEBHOOK_TOKEN && token !== MAYAR_WEBHOOK_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Token' });
    }

    // 2. Ambil data dari body webhook
    const payload = req.body;
    const event = payload.event;
    const amount = payload.data?.amount || 0;
    
    // Asumsi: Kita mengirimkan user.id ke Mayar melalui parameter ?ref= saat checkout,
    // yang oleh Mayar akan diteruskan kembali dalam payload webhook (misal di reference_id atau custom_field).
    // Sesuaikan ini dengan struktur asli dari webhook Mayar.
    const userId = payload.data?.reference_id || payload.data?.referenceId;

    if (!userId) {
      console.error('Webhook Error: User ID not found in payload');
      return res.status(400).json({ error: 'User ID required' });
    }

    // 3. Hanya proses jika event adalah payment success
    if (event !== 'payment.success') {
      return res.status(200).json({ message: 'Event skipped' });
    }

    // 4. Inisialisasi Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    // PENTING: Gunakan Service Role Key untuk bypass RLS saat mengupdate dari backend
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase credentials not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 5. Update status langganan User di tabel profiles
    // Kita aktifkan Paket Pro untuk user tersebut
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        plan_type: 'pro',
        subscription_status: 'active',
        subscription_started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
        // Optional: bisa menambahkan expired_at jika langganan per bulan
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Supabase Update Error:', updateError);
      return res.status(500).json({ error: 'Failed to update user profile' });
    }

    // 6. Catat Transaksi Keuangan (Optional: Jika ada tabel khusus untuk riwayat pembelian paket)
    // await supabase.from('credit_transactions').insert([...]);

    console.log(`Berhasil mengaktifkan Paket Pro untuk User ID: ${userId}`);
    return res.status(200).json({ success: true, message: 'Payment processed and Pro activated' });

  } catch (err) {
    console.error('Webhook Handler Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
