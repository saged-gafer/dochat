import { useEffect, useRef, useState, useCallback } from 'react';
import Peer, { type DataConnection } from 'peerjs';
import type { Message, User } from '../types';

export const usePeer = (user: User | null) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [connection, setConnection] = useState<DataConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

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
    });

    conn.on('close', () => {
      setIsConnected(false);
      setConnection(null);
      connRef.current = null;
    });
  }, [peer]);

  const sendMessage = useCallback((message: Message) => {
    if (connRef.current && connRef.current.open) {
      connRef.current.send(message);
      setMessages((prev) => [...prev, message]);
      return true;
    }
    return false;
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
