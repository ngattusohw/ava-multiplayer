import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Users, Zap, Brain, Trophy, Settings, ArrowLeft } from 'lucide-react';
import { useGameStore, createLocalPlayer } from '../store/gameStore';

interface LobbyProps {
  onBack?: () => void;
}

export function Lobby({ onBack }: LobbyProps) {
  const [playerName, setPlayerName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const {
    players,
    difficulty,
    addPlayer,
    setCurrentPlayer,
    setDifficulty,
    startMatchingGame,
    startChainBuilder
  } = useGameStore();

  const handleJoin = () => {
    if (!playerName.trim()) return;
    const player = createLocalPlayer(playerName.trim());
    addPlayer(player);
    setCurrentPlayer(player.id);
    setHasJoined(true);
  };

  const currentPlayer = players.find(p => p.isHost);

  return (
    <div className="min-h-screen grid-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-neon-cyan/5 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-neon-pink/5 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          style={{ bottom: '20%', right: '15%' }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Back button */}
        {onBack && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="absolute top-8 left-8 p-3 bg-surface-700/80 hover:bg-surface-600 rounded-xl transition-colors z-20"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-700/50 border border-neon-cyan/20 mb-6">
            <Zap className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm text-neon-cyan font-medium">Somethings Team Game</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-yellow bg-clip-text text-transparent">
              AVA
            </span>
            <br />
            <span className="text-white">ARCHITECT</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-xl mx-auto">
            Learn how AVA's tools work together in a fast-paced puzzle game
          </p>
        </motion.div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!hasJoined ? (
              <motion.div
                key="join"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface-800/80 backdrop-blur-xl border border-surface-600 rounded-3xl p-8 md:p-12"
              >
                <h2 className="text-2xl font-bold mb-6 text-center">Enter Your Name</h2>

                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                    placeholder="Your name..."
                    className="flex-1 px-6 py-4 bg-surface-700 border border-surface-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan transition-colors text-lg"
                    autoFocus
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleJoin}
                    className="px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-green text-surface-900 font-bold rounded-xl flex items-center gap-2 justify-center"
                  >
                    <Users className="w-5 h-5" />
                    Join Game
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="lobby"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {/* Player info */}
                <div className="bg-surface-800/80 backdrop-blur-xl border border-surface-600 rounded-3xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-surface-700 rounded-2xl flex items-center justify-center text-3xl">
                        {currentPlayer?.avatar}
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{currentPlayer?.name}</div>
                        <div className="text-sm text-slate-400">Ready to play!</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-neon-green/10 border border-neon-green/30 rounded-full">
                      <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                      <span className="text-neon-green text-sm font-medium">Connected</span>
                    </div>
                  </div>
                </div>

                {/* Difficulty selector */}
                <div className="bg-surface-800/80 backdrop-blur-xl border border-surface-600 rounded-3xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-400 font-medium">Difficulty</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {(['easy', 'medium', 'hard'] as const).map((d) => (
                      <motion.button
                        key={d}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDifficulty(d)}
                        className={`py-3 px-4 rounded-xl font-medium capitalize transition-all ${
                          difficulty === d
                            ? 'bg-neon-cyan text-surface-900'
                            : 'bg-surface-700 text-slate-300 hover:bg-surface-600'
                        }`}
                      >
                        {d}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Game modes */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Data Matcher */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startMatchingGame}
                    className="group bg-surface-800/80 backdrop-blur-xl border border-neon-cyan/30 hover:border-neon-cyan rounded-3xl p-8 text-left transition-all"
                  >
                    <div className="w-16 h-16 bg-neon-cyan/10 rounded-2xl flex items-center justify-center mb-6 group-hover:glow-cyan transition-all">
                      <Brain className="w-8 h-8 text-neon-cyan" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Data Matcher</h3>
                    <p className="text-slate-400 mb-6">
                      Match data sources to the right AVA tools. Race against time to make the most correct matches!
                    </p>
                    <div className="flex items-center gap-2 text-neon-cyan font-medium">
                      <Play className="w-5 h-5" />
                      Start Game
                    </div>
                  </motion.button>

                  {/* Chain Builder */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startChainBuilder}
                    className="group bg-surface-800/80 backdrop-blur-xl border border-neon-pink/30 hover:border-neon-pink rounded-3xl p-8 text-left transition-all"
                  >
                    <div className="w-16 h-16 bg-neon-pink/10 rounded-2xl flex items-center justify-center mb-6 group-hover:glow-pink transition-all">
                      <Trophy className="w-8 h-8 text-neon-pink" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Chain Builder</h3>
                    <p className="text-slate-400 mb-6">
                      Build investigation chains to solve scenarios. Think like AVA to find the best tool sequence!
                    </p>
                    <div className="flex items-center gap-2 text-neon-pink font-medium">
                      <Play className="w-5 h-5" />
                      Start Game
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

