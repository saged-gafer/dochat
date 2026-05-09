import React, { useState } from 'react';
import type { Message } from '../types';
import { format } from 'date-fns';
import { Eye, EyeOff, PlayCircle } from 'lucide-react';

interface MessageItemProps {
  message: Message;
  isMe: boolean;
  onViewMedia: (id: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isMe, onViewMedia }) => {
  const [showMedia, setShowMedia] = useState(false);

  const handleMediaClick = () => {
    if (!message.media?.viewed) {
      setShowMedia(true);
    }
  };

  // Only mark as viewed when the component unmounts or after a reasonable viewing time
  // Or when the user closes the media. For simplicity, let's add a "Close" button when viewing.

  return (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
        isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-800 text-zinc-100 rounded-tl-none'
      }`}>
        {message.text && <p className="text-sm md:text-base">{message.text}</p>}

        {message.media && (
          <div className="mt-2">
            {message.media.viewed && !isMe ? (
              <div className="flex items-center gap-2 text-zinc-500 italic text-xs py-2">
                <EyeOff size={14} />
                <span>Media viewed and deleted</span>
              </div>
            ) : (
              <div
                onClick={handleMediaClick}
                className="relative cursor-pointer group overflow-hidden rounded-lg border border-zinc-700/50"
              >
                {showMedia || isMe ? (
                  <div className="relative">
                    {message.media.type === 'image' ? (
                      <img src={message.media.url} alt="Shared" className="max-h-60 rounded-lg" />
                    ) : (
                      <video src={message.media.url} autoPlay controls className="max-h-60 rounded-lg" />
                    )}
                    {!isMe && !message.media.viewed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewMedia(message.id);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full shadow-lg font-bold"
                      >
                        CLOSE & DELETE
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-zinc-900/80 w-full h-32 flex flex-col items-center justify-center gap-2 p-4 min-w-[200px]">
                    <div className="bg-indigo-500/20 p-3 rounded-full text-indigo-400 group-hover:scale-110 transition-transform">
                      {message.media.type === 'image' ? <Eye size={24} /> : <PlayCircle size={24} />}
                    </div>
                    <span className="text-xs font-medium text-zinc-400">View once {message.media.type}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <span className="text-[10px] text-zinc-500 mt-1 px-1">
        {format(message.timestamp, 'HH:mm')}
      </span>
    </div>
  );
};
