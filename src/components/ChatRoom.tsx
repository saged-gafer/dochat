import React, { useEffect, useRef } from 'react';
import type { Message, User } from '../types';
import { MessageItem } from './MessageItem';
import { ChatInput } from './ChatInput';
import { Lock, ShieldCheck, LogOut } from 'lucide-react';

interface ChatRoomProps {
  user: User;
  messages: Message[];
  onSendMessage: (message: Message) => void;
  onViewMedia: (id: string) => void;
  onLogout: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ user, messages, onSendMessage, onViewMedia, onLogout }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900/60 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-white text-sm leading-tight">{user.name}</h2>
            <div className="flex items-center gap-1 text-[10px] text-green-500 uppercase font-bold tracking-wider">
              <ShieldCheck size={10} />
              End-to-End Encrypted
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Sign out"
          className="flex items-center gap-1.5 text-zinc-500 hover:text-red-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-500/10"
        >
          <LogOut size={16} />
          <span className="text-xs font-medium">Sign Out</span>
        </button>
      </header>

      {/* Info Banner */}
      <div className="bg-indigo-500/10 border-b border-indigo-500/20 px-4 py-2 flex items-center gap-2 text-[11px] text-indigo-300">
        <Lock size={12} />
        <span>Messages auto-delete after 12 hours · Media is view-once</span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
            <div className="p-5 rounded-full bg-zinc-900 border border-zinc-800">
              <Lock size={40} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-500">No messages yet</p>
              <p className="text-xs text-zinc-600 mt-1">Start a secure, encrypted conversation</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              isMe={msg.senderId === user.id}
              onViewMedia={onViewMedia}
            />
          ))
        )}
      </div>

      {/* Input */}
      <ChatInput user={user} onSendMessage={onSendMessage} />
    </div>
  );
};
