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
          <h2 className="text-2xl font-bold text-white mb-2">Connect to a Partner</h2>
          <p className="text-zinc-400 text-sm">Share your code or enter your partner's code to start chatting</p>
        </div>

        {/* Your code */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Your Unique Code</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-4 text-white font-mono text-center tracking-widest text-lg select-all">
              {user.code}
            </div>
            <button
              onClick={copyCode}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-4 text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="text-green-500" size={18} /> : <Copy size={18} />}
              <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-zinc-600 text-xs mt-2 text-center">Share this code with the person you want to chat with</p>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-3 text-zinc-500 font-semibold tracking-wider">or</span>
          </div>
        </div>

        {/* Connect form */}
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Partner's Code</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                value={remoteCode}
                onChange={(e) => setRemoteCode(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white font-mono placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Paste their code here"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!remoteCode.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Connect & Start Chatting
          </button>
        </form>
      </motion.div>
    </div>
  );
};
