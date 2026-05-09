import React from 'react';
import { Download, Shield, Zap, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Lock size={18} />
          </div>
          GhostChat
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Ephemeral P2P <br /> Messaging
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            The most private way to chat. Peer-to-peer connection, 12-hour auto-delete,
            and view-once media that self-destructs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/downloads/dochat.apk"
              download
              className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all scale-105 active:scale-95"
            >
              <Download size={20} />
              Download APK
            </a>
            <button
              onClick={() => window.location.href = '/app'}
              className="bg-zinc-900 border border-zinc-800 px-8 py-4 rounded-full font-bold hover:bg-zinc-800 transition-all"
            >
              Launch Web App
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-32 w-full">
          {[
            { icon: <Shield className="text-indigo-500" />, title: "Serverless", desc: "Your device is the server. No data is stored on external servers." },
            { icon: <Zap className="text-indigo-500" />, title: "Self-Destruct", desc: "Messages vanish after 12 hours. Media disappears after one view." },
            { icon: <Lock className="text-indigo-500" />, title: "Secure", desc: "End-to-end encrypted peer connection via WebRTC." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 text-left"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
