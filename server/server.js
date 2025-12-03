// server.js
import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhooks } from './controller/webhooks.js';

const app = express();

// Connect DB once (safe to call on each cold start)
await connectDB();

// CORS
app.use(cors());

// ⚠️ Clerk webhooks need RAW body and this must come BEFORE any JSON parser.
app.post('/webhooks', express.raw({ type: 'application/json' }), clerkWebhooks);

// JSON parser for all other routes
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('API Working'));
app.get('/debug-sentry', (req, res) => {
  throw new Error('My first Sentry error!');
});

// Sentry error handler (after routes)
Sentry.setupExpressErrorHandler(app);

// ❌ Do NOT app.listen() on Vercel.
// ✅ Export the app/handler instead.
export default app;
