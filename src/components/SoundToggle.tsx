import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { getMuted, toggleMuted, playClick } from '../utils/sounds';

export function SoundToggle() {
  const [muted, setMuted] = useState(true); // Start assuming muted until we check

  useEffect(() => {
    setMuted(getMuted());
  }, []);

  const handleToggle = () => {
    const nowMuted = toggleMuted();
    setMuted(nowMuted);
    if (!nowMuted) {
      playClick(); // Play a sound to confirm unmuted
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`fixed top-4 right-4 z-50 p-3 rounded-xl transition-colors ${
        muted
          ? 'bg-surface-700/80 text-slate-400 hover:text-white'
          : 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
      } backdrop-blur-sm`}
      title={muted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {muted ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </motion.button>
  );
}

