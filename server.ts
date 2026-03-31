import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Stripe lazily
let stripeClient: Stripe | null = null;
const getStripe = () => {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.warn("[Server] STRIPE_SECRET_KEY is missing. Checkout will fail.");
      return null;
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory cache for live themes
  const liveThemes: Record<string, string> = {};

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Stripe Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    const { themeId, themeName, price, userId } = req.body;
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `SkinCraft: ${themeName}`,
                description: `Premium interface skin for ChatGPT/Gemini`,
              },
              unit_amount: Math.round(price * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${appUrl}?success=true&themeId=${themeId}`,
        cancel_url: `${appUrl}?canceled=true`,
        metadata: {
          userId,
          themeId,
        },
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("[Stripe] Error creating session:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Push live theme CSS
  app.post("/api/theme/live/:userId", (req, res) => {
    const { userId } = req.params;
    const { css } = req.body;
    
    if (!userId || !css) {
      return res.status(400).json({ error: "Missing userId or css" });
    }

    liveThemes[userId] = css;
    console.log(`[Server] Live theme updated for user: ${userId}`);
    res.json({ success: true });
  });

  // Serve live theme CSS
  app.get("/api/theme/live/:userId/css", (req, res) => {
    const { userId } = req.params;
    const css = liveThemes[userId];

    if (!css) {
      return res.status(404).send("/* No live theme found for this user. Please push from the app first. */");
    }

    res.setHeader("Content-Type", "text/css");
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow bookmarklet to fetch
    res.send(css);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
