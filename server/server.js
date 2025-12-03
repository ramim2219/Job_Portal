import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhooks } from './controller/webhooks.js';

const app = express();

// Connect DB
await connectDB();


// Middlewares
app.use(cors());

/* // ✅ RAW body only for Clerk webhooks (must come before express.json)
app.post('/webhooks', express.raw({ type: 'application/json' }), clerkWebhooks);
 */
// ✅ Standard JSON for all other routes
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('API Working'));

app.get('/debug-sentry', (req, res) => {
  throw new Error('My first Sentry error!');
});

app.post('/webhooks', clerkWebhooks);

// Port
const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
