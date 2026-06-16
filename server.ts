import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SIPETIK Lite API is running" });
  });

  // Create Mayar Payment Session
  app.post("/api/payment/create-session", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
      }

      // Simulate integrating with Mayar API
      // In reality, this would correctly call Mayar API securely
      // using process.env.MAYAR_API_KEY and generate a payment link
      const apiKey = process.env.MAYAR_API_KEY;
      if (!apiKey) {
        throw new Error("Mayar API Key not configured.");
      }
      
      // Dummy response for Mayar integration demo
      return res.json({ 
        url: `https://checkout.mayar.id/demo-checkout-link?uid=${userId}`,
        sessionId: "session-" + Math.random().toString(36).substring(7) 
      });

    } catch (error: any) {
      console.error('Payment Session Error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Webhook from Mayar
  app.post("/api/payment", async (req, res) => {
    try {
      const MAYAR_WEBHOOK_TOKEN = process.env.MAYAR_WEBHOOK_TOKEN;
      const token = req.headers['x-callback-token'];

      if (MAYAR_WEBHOOK_TOKEN && token !== MAYAR_WEBHOOK_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const payload = req.body;
      const event = payload.event;
      const data = payload.data;

      if (event !== 'payment.success') {
        return res.status(200).json({ skip: true });
      }

      const email = data?.customer?.email;
      const amount = data?.amount;
      const refId = data?.referenceId;

      if (!email || !amount) {
        return res.status(400).json({ error: 'Invalid payload' });
      }

      // Initialize Supabase to handle membership
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase URL or Service Key missing");
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);

      // 2. Idempotency check
      const { data: existing } = await supabase
        .from('membership_payments')
        .select('id')
        .eq('reference_id', refId)
        .single();

      if (existing) {
        return res.status(200).json({ skip: 'already processed' });
      }

      // We will look up user by email since the markdown assumes there is email.
      // Easiest is to look up auth.users using admin API
      const { data: usersData, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError || !usersData || !usersData.users) {
        return res.status(500).json({ error: 'Failed to retrieve auth users' });
      }
      
      const foundUser = usersData.users.find((u: any) => u.email === email);
      if (!foundUser) {
        return res.status(404).json({ error: 'User not found in auth list' });
      }

      // 3. Ambil user profile parameters needed
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, membership_status, membership_end')
        .eq('id', foundUser.id)
        .single();
        
      if (!profile) {
        return res.status(404).json({ error: 'User profile not found' });
      }

      // 4. Hitung periode membership
      const { addMonths } = await import('date-fns');
      const now = new Date();
      const currentEnd = profile.membership_end ? new Date(profile.membership_end) : null;
      const isStillActive = currentEnd && currentEnd > now;

      const periodStart = isStillActive ? currentEnd : now;
      const periodEnd = addMonths(periodStart, 1); // +1 bulan

      // 5. Update membership
      await supabase
        .from('profiles')
        .update({
          membership_status: 'active',
          membership_start: periodStart.toISOString(),
          membership_end: periodEnd.toISOString(),
        })
        .eq('id', profile.id);

      // 6. Catat pembayaran
      await supabase.from('membership_payments').insert({
        user_id: profile.id,
        reference_id: refId,
        amount,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
      });

      console.log(`Paket Pro diaktifkan untuk user: ${profile.id}`);
      return res.status(200).json({ success: true });
      
    } catch (error) {
      console.error('Webhook Error:', error);
      res.status(500).send('Webhook Error');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
