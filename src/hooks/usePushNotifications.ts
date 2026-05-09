import { useEffect, useCallback } from 'react';

const SERVER = 'http://localhost:3001';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export const usePushNotifications = (peerId: string | null, userName: string | null) => {
  const registerPush = useCallback(async () => {
    if (!peerId || !userName) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const res = await fetch(`${SERVER}/api/vapid-key`);
      const { publicKey } = await res.json();

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        });
      }

      await fetch(`${SERVER}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peerId, subscription: sub, name: userName })
      });
    } catch (e) {
      console.error('Push registration failed:', e);
    }
  }, [peerId, userName]);

  useEffect(() => {
    if (peerId && userName) {
      registerPush();
    }
  }, [peerId, userName, registerPush]);

  const notifyOffline = useCallback(async (
    targetPeerId: string,
    senderName: string,
    text: string
  ) => {
    try {
      await fetch(`${SERVER}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPeerId, senderName, text, timestamp: Date.now() })
      });
    } catch (e) {
      console.error('Notify failed:', e);
    }
  }, []);

  return { notifyOffline };
};
