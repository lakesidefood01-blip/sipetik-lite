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
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Add CORS headers for webhook if needed by some providers
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With, x-callback-token");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

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

  const handleMayarWebhook = async (req: express.Request, res: express.Response) => {
    try {
      console.log('--- RECEIVED WEBHOOK ---');
      console.log('Method:', req.method);
      console.log('Headers:', req.headers);
      console.log('Body:', JSON.stringify(req.body, null, 2));
      
      const MAYAR_WEBHOOK_TOKEN = process.env.MAYAR_WEBHOOK_TOKEN;
      const callbackToken = req.headers['x-callback-token'];
      const authHeader = req.headers['authorization'];
      
      // Some providers uses Bearer token for webhook auth
      const token = callbackToken || (authHeader ? authHeader.replace('Bearer ', '') : undefined);

      // Always destructure safely
      const payload = req.body || {};
      const event = payload.event;

      // Mayar test event
      if (event === 'testing' || !event) {
        console.log('Responded to testing or empty event');
        // A generic 200 response with JSON format
        return res.status(200).json({ success: true, message: 'Test webhook received successfully' });
      }

      if (MAYAR_WEBHOOK_TOKEN && token !== MAYAR_WEBHOOK_TOKEN) {
        console.log('Unauthorized Webhook attempt. Token mismatch.', token);
        // We return 401 JSON so Mayar registers it correctly as unauthorized if token is wrong
        return res.status(401).json({ error: 'Unauthorized', message: 'Token mismatch' });
      }
      
      const data = payload.data || {};

      if (event !== 'payment.success') {
        return res.status(200).json({ skip: true, message: 'Ignored event type' });
      }

      const email = data.customerEmail || data?.customer?.email;
      const amount = data.amount;
      const refId = data.referenceId || data.id;

      if (!email || !amount) {
        return res.status(400).json({ error: 'Invalid payload' });
      }

      // Initialize Supabase to handle membership
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
         console.warn('Supabase not configured, skipping DB insert');
         return res.status(200).json({ success: true, warning: 'Supabase not configured' });
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Check if user exists
      let foundUser;
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { data: usersData, error: userAuthError } = await supabase.auth.admin.listUsers();
        if (!userAuthError && usersData?.users) {
          foundUser = usersData.users.find((u: any) => u.email === email);
        }
      }

      if (!foundUser) {
        console.log('User not found by email', email);
        return res.status(200).json({ success: true, message: 'User not found in auth list, skipping' });
      }

      // 3. Ambil user profile parameters needed
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, membership_status, membership_end')
        .eq('id', foundUser.id)
        .single();
        
      if (!profile) {
        return res.status(200).json({ success: true, message: 'User profile not found, skipping' });
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
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Bind to common webhook URL names
  app.post("/api/payment", handleMayarWebhook);
  app.post("/api/webhook/mayar", handleMayarWebhook);
  app.post("/api/webhook", handleMayarWebhook);
  
  // GET variants for verification some webhooks do
  app.get("/api/payment", handleMayarWebhook);
  app.get("/api/webhook/mayar", handleMayarWebhook);
  app.get("/api/webhook", handleMayarWebhook);

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
