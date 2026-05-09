import { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { ConnectionManager } from './components/ConnectionManager';
import { ChatRoom } from './components/ChatRoom';
import { usePeer } from './hooks/usePeer';
import type { User, Message } from './types';

const AUTO_DELETE_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ghost_user');
    return saved ? JSON.parse(saved) : null;
  });

  const {
    isConnected,
    messages,
    setMessages,
    connectToPeer,
    sendMessage,
    markMediaAsViewed
  } = usePeer(user);

  // Persistence and auto-deletion logic
  useEffect(() => {
    if (!user) return;

    // Load messages from local storage
    const savedMessages = localStorage.getItem(`messages_${user.id}`);
    if (savedMessages) {
      const parsed: Message[] = JSON.parse(savedMessages);
      const now = Date.now();
      // Filter out messages older than 12 hours on load
      const validMessages = parsed.filter(m => now - m.timestamp < AUTO_DELETE_INTERVAL);
      setMessages(validMessages);
    }
  }, [user, setMessages]);

  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`messages_${user.id}`, JSON.stringify(messages));
    }
  }, [user, messages]);

  // Periodic cleanup of old messages
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages(prev => prev.filter(m => now - m.timestamp < AUTO_DELETE_INTERVAL));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [setMessages]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('ghost_user', JSON.stringify(newUser));
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  if (!isConnected) {
    return (
      <ConnectionManager
        user={user}
        onConnect={connectToPeer}
        isConnected={isConnected}
      />
    );
  }

  return (
    <ChatRoom
      user={user}
      messages={messages}
      onSendMessage={sendMessage}
      onViewMedia={markMediaAsViewed}
    />
  );
}

export default App;
