import React, { useState } from 'react';
import type { User } from '../types';
import { Share2, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConnectionManagerProps {
  user: User;
  onConnect: (remoteCode: string) => void;
  isConnected: boolean;
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({ user, onConnect, isConnected }) => {
  const [remoteCode, setRemoteCode] = useState('');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(user.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (remoteCode.trim()) {
      onConnect(remoteCode.trim());
    }
  };

  if (isConnected) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Connect to Partner</h2>
          <p className="text-zinc-400 text-sm">Share your code or enter theirs to start chatting</p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-zinc-400 mb-2">Your Unique Code</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-4 text-white font-mono text-center tracking-widest">
              {user.code}
            </div>
            <button
              onClick={copyCode}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg p-3 text-zinc-400 transition-colors"
            >
              {copied ? <Check className="text-green-500" size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-2 text-zinc-500">OR</span>
          </div>
        </div>

        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Partner's Code</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                value={remoteCode}
                onChange={(e) => setRemoteCode(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Paste code here"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Share2 size={20} />
            Connect & Chat
          </button>
        </form>
      </motion.div>
    </div>
  );
};
