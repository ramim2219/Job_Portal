// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import User from "./models/User.js";
import { clerkWebhooks } from "./controller/webhooks.js";

// ---- SENTRY SETUP ----
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    Sentry.mongooseIntegration(),
  ],
  tracesSampleRate: 1.0,
});

const app = express();

app.use(cors());
app.use(express.json());

// ---- ROUTES ----

// Test route
app.get("/", async (req, res) => {
  await connectDB();     // only connect inside routes
  res.send("API Working on Vercel");
});

// Sentry test
app.get("/debug-sentry", (req, res) => {
  throw new Error("Sentry test error!");
});

// Clerk webhook
app.post("/webhooks", async (req, res) => {
  await connectDB();
  clerkWebhooks(req, res);
});

// ---- ERROR HANDLER ----
Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
