import React, { useEffect, useRef } from 'react';
import type { Message, User } from '../types';
import { MessageItem } from './MessageItem';
import { ChatInput } from './ChatInput';
import { Lock, ShieldCheck, Info } from 'lucide-react';

interface ChatRoomProps {
  user: User;
  messages: Message[];
  onSendMessage: (message: Message) => void;
  onViewMedia: (id: string) => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ user, messages, onSendMessage, onViewMedia }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-white">Ghost Session</h2>
            <div className="flex items-center gap-1 text-[10px] text-green-500 uppercase font-bold tracking-wider">
              <ShieldCheck size={12} />
              End-to-End Encrypted
            </div>
          </div>
        </div>
        <div className="text-zinc-500 hover:text-zinc-300 cursor-pointer">
          <Info size={20} />
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-indigo-500/10 border-b border-indigo-500/20 px-4 py-2 flex items-center gap-2 text-[11px] text-indigo-300">
        <Lock size={14} />
        <span>Messages are automatically deleted after 12 hours. Media is view-once.</span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
            <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800">
              <Lock size={48} />
            </div>
            <p className="text-sm font-medium">No messages yet. Start a secure conversation.</p>
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
