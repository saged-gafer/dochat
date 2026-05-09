import { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { ConnectionManager } from './components/ConnectionManager';
import { ChatRoom } from './components/ChatRoom';
import { LandingPage } from './components/LandingPage';
import { usePeer } from './hooks/usePeer';
import type { User, Message } from './types';

const AUTO_DELETE_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [showLanding] = useState(!window.location.pathname.startsWith('/app'));

  const {
    isConnected,
    messages,
    setMessages,
    connectToPeer,
    sendMessage,
    markMediaAsViewed
  } = usePeer(authenticatedUser);

  // Persistence and auto-deletion logic
  useEffect(() => {
    if (!authenticatedUser) return;

    // Load messages from local storage
    const savedMessages = localStorage.getItem(`messages_${authenticatedUser.id}`);
    if (savedMessages) {
      const parsed: Message[] = JSON.parse(savedMessages);
      const now = Date.now();
      // Filter out messages older than 12 hours on load
      const validMessages = parsed.filter(m => now - m.timestamp < AUTO_DELETE_INTERVAL);
      setMessages(validMessages);
    }
  }, [authenticatedUser, setMessages]);

  useEffect(() => {
    if (authenticatedUser && messages.length > 0) {
      localStorage.setItem(`messages_${authenticatedUser.id}`, JSON.stringify(messages));
    }
  }, [authenticatedUser, messages]);

  // Periodic cleanup of old messages
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages(prev => prev.filter(m => now - m.timestamp < AUTO_DELETE_INTERVAL));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [setMessages]);

  const handleLogin = (newUser: User) => {
    setAuthenticatedUser(newUser);
    localStorage.setItem('ghost_user', JSON.stringify(newUser));
  };

  useEffect(() => {
    if (authenticatedUser && !isConnected) {
      const savedPartner = localStorage.getItem('partner_code');
      if (savedPartner) {
        connectToPeer(savedPartner);
      }
    }
  }, [authenticatedUser, isConnected, connectToPeer]);

  if (showLanding) {
    return <LandingPage />;
  }

  if (!authenticatedUser) {
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
      onSendMessage={sendMessage}
      onViewMedia={markMediaAsViewed}
    />
  );
}

export default App;
