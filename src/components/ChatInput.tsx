import React, { useState, useRef } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import type { Message, User } from '../types';

interface ChatInputProps {
  user: User;
  onSendMessage: (message: Message) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ user, onSendMessage }) => {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() && !preview) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      senderName: user.name,
      text: text.trim() || undefined,
      media: preview ? {
        type: preview.type,
        url: preview.url,
        viewed: false
      } : undefined,
      timestamp: Date.now()
    };

    onSendMessage(newMessage);
    setText('');
    setPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview({
          url: reader.result as string,
          type: file.type.startsWith('video') ? 'video' : 'image'
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-3 bg-zinc-900 border-t border-zinc-800">
      {preview && (
        <div className="mb-3 relative inline-block">
          {preview.type === 'image' ? (
            <img src={preview.url} alt="Preview" className="h-28 rounded-lg border border-zinc-700 object-cover" />
          ) : (
            <video src={preview.url} className="h-28 rounded-lg border border-zinc-700" />
          )}
          <button
            onClick={() => setPreview(null)}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1 text-white transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-zinc-400 hover:text-indigo-400 transition-colors flex-shrink-0"
          title="Attach image or video"
        >
          <ImageIcon size={22} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />

        <button
          type="submit"
          disabled={!text.trim() && !preview}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors flex-shrink-0"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
