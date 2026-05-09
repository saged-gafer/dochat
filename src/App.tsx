import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { ConnectionManager } from './components/ConnectionManager';
import { ChatRoom } from './components/ChatRoom';
import { usePeer } from './hooks/usePeer';
import { usePushNotifications } from './hooks/usePushNotifications';
import type { User, Message } from './types';

const AUTO_DELETE_INTERVAL = 12 * 60 * 60 * 1000;

type AppView = 'landing' | 'auth' | 'app';

function App() {
  const [view, setView] = useState<AppView>(() => {
    const hasUser = !!localStorage.getItem('ghost_user');
    const hasName = !!localStorage.getItem('dochat_username');
    if (hasUser) return 'app';
    if (hasName) return 'auth';
    return 'landing';
  });

  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ghost_user');
    return saved ? JSON.parse(saved) : null;
  });

  const {
    isConnected,
    messages,
    setMessages,
    connectToPeer,
    sendMessage,
    markMediaAsViewed,
    partnerPeerId
  } = usePeer(authenticatedUser);

  const { notifyOffline } = usePushNotifications(
    authenticatedUser?.code || null,
    authenticatedUser?.name || null
  );

  // Persistence and auto-deletion
  useEffect(() => {
    if (!authenticatedUser) return;
    const savedMessages = localStorage.getItem(`messages_${authenticatedUser.id}`);
    if (savedMessages) {
      const parsed: Message[] = JSON.parse(savedMessages);
      const now = Date.now();
      setMessages(parsed.filter(m => now - m.timestamp < AUTO_DELETE_INTERVAL));
    }
  }, [authenticatedUser, setMessages]);

  useEffect(() => {
    if (authenticatedUser && messages.length > 0) {
      localStorage.setItem(`messages_${authenticatedUser.id}`, JSON.stringify(messages));
    }
  }, [authenticatedUser, messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages(prev => prev.filter(m => now - m.timestamp < AUTO_DELETE_INTERVAL));
    }, 60000);
    return () => clearInterval(interval);
  }, [setMessages]);

  const handleLogin = (newUser: User) => {
    setAuthenticatedUser(newUser);
    localStorage.setItem('ghost_user', JSON.stringify(newUser));
    setView('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('ghost_user');
    localStorage.removeItem('partner_code');
    setAuthenticatedUser(null);
    setView('auth');
  };

  useEffect(() => {
    if (authenticatedUser && !isConnected) {
      const savedPartner = localStorage.getItem('partner_code');
      if (savedPartner) connectToPeer(savedPartner);
    }
  }, [authenticatedUser, isConnected, connectToPeer]);

  // Enhanced sendMessage with offline push notification
  const handleSendMessage = async (message: Message) => {
    const sent = sendMessage(message);
    if (!sent && partnerPeerId && authenticatedUser) {
      await notifyOffline(partnerPeerId, authenticatedUser.name, message.text || 'أرسل لك ملفاً');
    }
  };

  if (view === 'landing') {
    return <LandingPage onEnterApp={() => setView('auth')} />;
  }

  if (view === 'auth' || !authenticatedUser) {
    return <Auth onLogin={handleLogin} />;
  }

  if (!isConnected && !localStorage.getItem('partner_code')) {
    return (
      <ConnectionManager
        user={authenticatedUser}
        onConnect={connectToPeer}
        isConnected={isConnected}
      />
    );
  }

  return (
    <ChatRoom
      user={authenticatedUser}
      messages={messages}
      onSendMessage={handleSendMessage}
      onViewMedia={markMediaAsViewed}
      onLogout={handleLogout}
    />
  );
}

export default App;
