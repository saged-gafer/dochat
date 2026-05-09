import express from 'express';
import webpush from 'web-push';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const VAPID_PUBLIC_KEY = 'BJmd56lQwMjACqCAGMx7IVNE1sHbw2pfL8htvoaNyCANoMWETKh27rjv5LggzBBoacp5H-P2oQuVpRSnRvRYbBU';
const VAPID_PRIVATE_KEY = 'LjfBMblQOA4yuc3dsXkVaaDUIrmeL86NO3IYBII9VHE';

webpush.setVapidDetails(
  'mailto:admin@dochat.app',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// In-memory store: peerId -> { subscription, name }
const subscriptions = new Map();
// In-memory store: peerId -> [offline messages]
const offlineMessages = new Map();

// Save push subscription
app.post('/api/subscribe', (req, res) => {
  const { peerId, subscription, name } = req.body;
  if (!peerId || !subscription) return res.status(400).json({ error: 'Missing data' });
  subscriptions.set(peerId, { subscription, name });

  // Deliver any pending offline messages
  const pending = offlineMessages.get(peerId) || [];
  if (pending.length > 0) {
    pending.forEach(async (msg) => {
      try {
        await webpush.sendNotification(subscription, JSON.stringify(msg));
      } catch (e) {
        console.error('Push error:', e.message);
      }
    });
    offlineMessages.delete(peerId);
  }

  res.json({ success: true });
});

// Send offline message notification
app.post('/api/notify', async (req, res) => {
  const { targetPeerId, senderName, text, timestamp } = req.body;
  if (!targetPeerId) return res.status(400).json({ error: 'Missing targetPeerId' });

  const payload = JSON.stringify({
    title: senderName || 'DoChat',
    body: text || 'رسالة جديدة',
    timestamp
  });

  const entry = subscriptions.get(targetPeerId);
  if (entry) {
    try {
      await webpush.sendNotification(entry.subscription, payload);
      res.json({ success: true, delivered: true });
    } catch (e) {
      console.error('Push failed:', e.message);
      subscriptions.delete(targetPeerId);
      res.json({ success: false, error: e.message });
    }
  } else {
    // Store for later delivery
    const queue = offlineMessages.get(targetPeerId) || [];
    queue.push({ title: senderName || 'DoChat', body: text || 'رسالة جديدة', timestamp });
    offlineMessages.set(targetPeerId, queue);
    res.json({ success: true, delivered: false, queued: true });
  }
});

// Get VAPID public key
app.get('/api/vapid-key', (req, res) => {
  res.json({ publicKey: VAPID_PUBLIC_KEY });
});

const PORT = 3001;
app.listen(PORT, 'localhost', () => {
  console.log(`DoChat push server running on http://localhost:${PORT}`);
});
