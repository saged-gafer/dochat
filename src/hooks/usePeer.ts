import { useEffect, useRef, useState, useCallback } from 'react';
import Peer, { type DataConnection } from 'peerjs';
import type { Message, User } from '../types';

export const usePeer = (user: User | null) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [connection, setConnection] = useState<DataConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pendingMessages, setPendingMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('pending_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const connRef = useRef<DataConnection | null>(null);

  useEffect(() => {
    if (!user) return;

    const newPeer = new Peer(user.code);

    newPeer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      setPeer(newPeer);
    });

    newPeer.on('connection', (conn) => {
      console.log('Incoming connection from:', conn.peer);

      conn.on('data', (data: any) => {
        setMessages((prev) => [...prev, data as Message]);
      });

      conn.on('open', () => {
        setIsConnected(true);
        setConnection(conn);
        connRef.current = conn;
      });

      conn.on('close', () => {
        setIsConnected(false);
        setConnection(null);
        connRef.current = null;
      });
    });

    return () => {
      newPeer.destroy();
    };
  }, [user]);

  // Handle pending messages when connected
  useEffect(() => {
    if (isConnected && pendingMessages.length > 0 && connRef.current?.open) {
      pendingMessages.forEach(msg => {
        connRef.current?.send(msg);
      });
      setPendingMessages([]);
      localStorage.removeItem('pending_messages');
    }
  }, [isConnected, pendingMessages]);

  useEffect(() => {
    if (pendingMessages.length > 0) {
      localStorage.setItem('pending_messages', JSON.stringify(pendingMessages));
    }
  }, [pendingMessages]);

  const connectToPeer = useCallback((remoteId: string) => {
    if (!peer) return;

    const conn = peer.connect(remoteId);

    conn.on('data', (data: any) => {
      setMessages((prev) => [...prev, data as Message]);
    });

    conn.on('open', () => {
      setIsConnected(true);
      setConnection(conn);
      connRef.current = conn;
      // Save partner code for persistence
      localStorage.setItem('partner_code', remoteId);
    });

    conn.on('close', () => {
      setIsConnected(false);
      setConnection(null);
      connRef.current = null;
    });
  }, [peer]);

  const sendMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);

    if (connRef.current && connRef.current.open) {
      connRef.current.send(message);
      return true;
    } else {
      // Queue message if offline
      setPendingMessages((prev) => [...prev, message]);
      return false;
    }
  }, []);

  const markMediaAsViewed = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map(m => m.id === messageId ? { ...m, media: m.media ? { ...m.media, viewed: true } : undefined } : m)
    );
  }, []);

  return {
    peer,
    connection,
    isConnected,
    messages,
    setMessages,
    connectToPeer,
    sendMessage,
    markMediaAsViewed
  };
};
