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
  app.post("/api/webhooks/mayar", async (req, res) => {
    try {
      // 1. Verify Mayar signature
      // const signature = req.headers['x-mayar-signature'];
      // if (!verifySignature(signature, req.body)) return res.status(401).send('Invalid signature');
      
      const payload = req.body;
      console.log('Received Mayar Webhook:', payload);

      if (payload.status === 'SUCCESS' || payload.event === 'payment_success') {
        const userId = payload.customer_id; // Extract mapped ID
        // updateSubscriptionService(userId, 'pro');
      }

      res.status(200).json({ received: true });
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
