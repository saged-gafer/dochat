import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';
import { format } from 'date-fns';
import { Eye, EyeOff, PlayCircle, Clock, Trash2 } from 'lucide-react';

interface MessageItemProps {
  message: Message;
  isMe: boolean;
  onViewMedia: (id: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isMe, onViewMedia }) => {
  const [showMedia, setShowMedia] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMediaClick = () => {
    if (!message.media?.viewed) {
      setShowMedia(true);
      if (message.media?.type === 'image') {
        setTimeLeft(15);
      }
    }
  };

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      onViewMedia(message.id);
      setShowMedia(false);
      setTimeLeft(null);
    }
  }, [timeLeft, message.id, onViewMedia]);

  const handleVideoEnded = () => {
    if (!isMe) {
      onViewMedia(message.id);
      setShowMedia(false);
    }
  };

  return (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-3`}>
      {!isMe && (
        <span className="text-[10px] text-zinc-500 mb-1 px-1">{message.senderName}</span>
      )}
      <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${
        isMe
          ? 'bg-indigo-600 text-white rounded-tr-sm'
          : 'bg-zinc-800 text-zinc-100 rounded-tl-sm'
      }`}>
        {message.text && (
          <p className="text-sm leading-relaxed">{message.text}</p>
        )}

        {message.media && (
          <div className="mt-2">
            {message.media.viewed && !isMe ? (
              <div className="flex items-center gap-2 text-zinc-500 italic text-xs py-1">
                <EyeOff size={13} />
                <span>Media viewed and removed</span>
              </div>
            ) : (
              <div
                onClick={handleMediaClick}
                className="relative cursor-pointer group overflow-hidden rounded-xl border border-white/10"
              >
                {showMedia || isMe ? (
                  <div className="relative">
                    {message.media.type === 'image' ? (
                      <>
                        <img src={message.media.url} alt="Shared" className="max-h-60 w-full object-cover rounded-xl" />
                        {timeLeft !== null && (
                          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-[10px] text-white font-bold">
                            <Clock size={10} />
                            {timeLeft}s
                          </div>
                        )}
                      </>
                    ) : (
                      <video
                        ref={videoRef}
                        src={message.media.url}
                        autoPlay
                        controls
                        onEnded={handleVideoEnded}
                        className="max-h-60 w-full rounded-xl"
                      />
                    )}
                    {!isMe && !message.media.viewed && timeLeft === null && message.media.type === 'image' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewMedia(message.id);
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-[10px] px-2 py-1 rounded-full shadow-lg font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={10} />
                        Remove
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-zinc-900/90 w-full h-32 flex flex-col items-center justify-center gap-2 p-4 min-w-[200px]">
                    <div className="bg-indigo-500/20 p-3 rounded-full text-indigo-400 group-hover:scale-110 transition-transform">
                      {message.media.type === 'image' ? <Eye size={22} /> : <PlayCircle size={22} />}
                    </div>
                    <span className="text-xs font-medium text-zinc-400">
                      Tap to view · {message.media.type === 'image' ? 'View-once image' : 'View-once video'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <span className="text-[10px] text-zinc-600 mt-1 px-1">
        {format(message.timestamp, 'hh:mm a')}
      </span>
    </div>
  );
};
