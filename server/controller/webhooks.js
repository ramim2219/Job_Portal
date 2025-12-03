// controller/webhooks.js
import { Webhook } from 'svix';
import User from '../models/User.js';

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    };

    // raw body for verification
    const payload = Buffer.isBuffer(req.body)
      ? req.body.toString('utf8')
      : JSON.stringify(req.body || {});

    const evt = await whook.verify(payload, headers); // returns parsed event
    const { data, type } = evt;

    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0]?.email_address,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          image: data.image_url,
          resume: '',
        };
        await User.create(userData);
        return res.status(200).json({ ok: true });
      }
      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0]?.email_address,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData, { new: true });
        return res.status(200).json({ ok: true });
      }
      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({ ok: true });
      }
      default:
        return res.status(200).json({ ok: true });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).json({ success: false, message: 'Webhooks Error', error: error.message });
  }
};
