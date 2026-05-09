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
  };

  return (
    <div className="p-4 bg-zinc-900 border-t border-zinc-800">
      {preview && (
        <div className="mb-4 relative inline-block">
          {preview.type === 'image' ? (
            <img src={preview.url} alt="Preview" className="h-32 rounded-lg border border-zinc-700" />
          ) : (
            <video src={preview.url} className="h-32 rounded-lg border border-zinc-700" />
          )}
          <button
            onClick={() => setPreview(null)}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ImageIcon size={24} />
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
          placeholder="Type a message..."
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={!text.trim() && !preview}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white p-2 rounded-lg transition-colors"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};
