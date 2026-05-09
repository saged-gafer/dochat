import React from 'react';
import { motion } from 'framer-motion';
import { Download, Shield, Zap, MessageCircle, Lock } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-between p-6">
      <div className="w-full max-w-md flex flex-col items-center gap-10 mt-10">

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-900">
            <MessageCircle className="text-white" size={48} />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">DoChat</h1>
          <p className="text-zinc-400 text-center text-sm">Secure, ephemeral messaging — just between you two</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full flex flex-col gap-4"
        >
          {[
            { icon: Shield, title: 'End-to-End Encrypted', desc: 'Messages never touch a server — fully peer-to-peer' },
            { icon: Zap, title: 'Instant Notifications', desc: 'Get notified even when the app is closed' },
            { icon: Lock, title: 'Auto-Expiring Messages', desc: 'All messages are automatically deleted after 12 hours' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4 bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="text-indigo-400" size={20} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{title}</p>
                <p className="text-zinc-400 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full flex flex-col gap-3"
        >
          <a
            href="/dochat.apk"
            download="dochat.apk"
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-900/50 text-lg"
          >
            <Download size={24} />
            Download for Android
          </a>

          <button
            onClick={onEnterApp}
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 font-semibold py-3 rounded-2xl transition-all border border-zinc-700 text-sm"
          >
            Continue in Browser
          </button>
        </motion.div>
      </div>

      <p className="text-zinc-600 text-xs mt-8">DoChat © 2025 — All rights reserved</p>
    </div>
  );
};
