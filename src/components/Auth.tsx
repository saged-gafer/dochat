import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [savedName, setSavedName] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('dochat_username');
    if (stored) setSavedName(stored);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = savedName || name;
    if (!displayName || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const code = btoa(unescape(encodeURIComponent(displayName + password))).substring(0, 8).toLowerCase();
    if (!savedName) {
      localStorage.setItem('dochat_username', displayName);
    }
    setError('');
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: displayName,
      code
    });
  };

  const handleForgetName = () => {
    localStorage.removeItem('dochat_username');
    setSavedName(null);
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">DoChat</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {savedName ? `Welcome back, ${savedName}` : 'Create your secure account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!savedName && (
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Display Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="••••••••"
                required
                autoFocus={!!savedName}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg"
          >
            {savedName ? 'Sign In' : 'Create Account'}
            <ArrowRight size={18} />
          </button>
        </form>

        {savedName && (
          <button
            onClick={handleForgetName}
            className="w-full mt-4 text-zinc-500 hover:text-zinc-300 text-xs text-center transition-colors"
          >
            Not you? Switch account
          </button>
        )}
      </motion.div>
    </div>
  );
};
