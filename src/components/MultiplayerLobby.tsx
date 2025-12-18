import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Copy,
  Check,
  Crown,
  Play,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Circle
} from 'lucide-react';
import { useMultiplayer, generateRoomCode } from '../hooks/useMultiplayer';
import { MultiplayerGame } from './MultiplayerGame';
import { playClick, playPlayerJoined, playReady, playGo } from '../utils/sounds';
import { SoundToggle } from './SoundToggle';

interface MultiplayerLobbyProps {
  onBack: () => void;
}

export function MultiplayerLobby({ onBack }: MultiplayerLobbyProps) {
  const [view, setView] = useState<'menu' | 'create' | 'join' | 'room'>('menu');
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [copied, setCopied] = useState(false);

  const {
    room,
    playerId,
    currentPlayer,
    isHost,
    countdown,
    leaderboard,
    isGameOver,
    error,
    isConnected,
    join,
    toggleReady,
    startGame,
    submitScore,
    nextRound,
    leave,
  } = useMultiplayer(roomCode);

  const handleExit = () => {
    leave();
    setRoomCode(null);
    setView('menu');
  };

  // Track player count for join sounds - must be before any early returns!
  const prevPlayerCount = useRef(room?.players.length ?? 0);

  useEffect(() => {
    const currentCount = room?.players.length ?? 0;
    if (currentCount > prevPlayerCount.current) {
      playPlayerJoined();
    }
    prevPlayerCount.current = currentCount;
  }, [room?.players.length]);

  // If game has started (phase is not lobby), render the game
  if (room && room.phase !== 'lobby' && roomCode) {
    return (
      <>
        <SoundToggle />
        <MultiplayerGame
          room={room}
          playerId={playerId}
          currentPlayer={currentPlayer}
          isHost={isHost}
          countdown={countdown}
          leaderboard={leaderboard}
          isGameOver={isGameOver}
          submitScore={submitScore}
          nextRound={nextRound}
          onExit={handleExit}
        />
      </>
    );
  }

  const handleCreateRoom = () => {
    playClick();
    const code = generateRoomCode();
    setRoomCode(code);
    setView('room');
  };

  const handleJoinRoom = () => {
    if (joinCode.length === 4) {
      playClick();
      setRoomCode(joinCode.toUpperCase());
      setView('room');
    }
  };

  const handleJoinGame = () => {
    if (playerName.trim()) {
      playClick();
      join(playerName.trim());
    }
  };

  const handleToggleReady = () => {
    playReady();
    toggleReady();
  };

  const handleStartGame = () => {
    playGo();
    startGame();
  };

  const copyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBack = () => {
    if (view === 'room') {
      leave();
      setRoomCode(null);
      setView('menu');
    } else if (view !== 'menu') {
      setView('menu');
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen grid-bg relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-neon-pink/5 blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-neon-cyan/5 blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, 100, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          style={{ bottom: '20%', right: '15%' }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="p-3 bg-surface-700 hover:bg-surface-600 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {view === 'room' ? 'Game Lobby' : 'Multiplayer'}
            </h1>
            <p className="text-slate-400 text-sm">Chain Builder - Compete in real-time</p>
          </div>
        </div>

        {/* Error toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-500 text-white rounded-full font-medium z-50"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Menu */}
            {view === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateRoom}
                  className="w-full bg-gradient-to-r from-neon-pink to-neon-cyan p-[2px] rounded-2xl"
                >
                  <div className="bg-surface-800 rounded-2xl p-8 flex items-center gap-6">
                    <div className="w-16 h-16 bg-neon-pink/20 rounded-2xl flex items-center justify-center">
                      <Crown className="w-8 h-8 text-neon-pink" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-white">Create Room</h3>
                      <p className="text-slate-400">Host a game and invite your team</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('join')}
                  className="w-full bg-surface-800 border border-surface-600 hover:border-neon-cyan/50 rounded-2xl p-8 flex items-center gap-6 transition-colors"
                >
                  <div className="w-16 h-16 bg-neon-cyan/20 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-neon-cyan" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">Join Room</h3>
                    <p className="text-slate-400">Enter a room code to join</p>
                  </div>
                </motion.button>
              </motion.div>
            )}

            {/* Join */}
            {view === 'join' && (
              <motion.div
                key="join"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-surface-800 border border-surface-600 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Enter Room Code</h2>
                <div className="flex gap-2 justify-center mb-8">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={joinCode[i] || ''}
                      onChange={(e) => {
                        const char = e.target.value.toUpperCase();
                        const newCode = joinCode.split('');
                        newCode[i] = char;
                        setJoinCode(newCode.join(''));
                        // Auto-focus next input
                        if (char && i < 3) {
                          const next = e.target.nextElementSibling as HTMLInputElement;
                          next?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !joinCode[i] && i > 0) {
                          const prev = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement;
                          prev?.focus();
                        }
                      }}
                      className="w-16 h-20 text-center text-3xl font-bold bg-surface-700 border border-surface-600 rounded-xl text-white focus:border-neon-cyan focus:outline-none transition-colors"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleJoinRoom}
                  disabled={joinCode.length !== 4}
                  className="w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-green text-surface-900 font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join Game
                </motion.button>
              </motion.div>
            )}

            {/* Room */}
            {view === 'room' && (
              <motion.div
                key="room"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Room code */}
                <div className="bg-surface-800 border border-surface-600 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-slate-400">Room Code</div>
                    <div className="flex items-center gap-2">
                      {isConnected ? (
                        <span className="flex items-center gap-1 text-neon-green text-sm">
                          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                          Connected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-400 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Connecting...
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 flex gap-2">
                      {roomCode?.split('').map((char, i) => (
                        <div
                          key={i}
                          className="w-14 h-16 bg-surface-700 rounded-xl flex items-center justify-center text-2xl font-bold text-neon-cyan"
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyCode}
                      className="p-3 bg-surface-700 hover:bg-surface-600 rounded-xl transition-colors"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-neon-green" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Join form or player list */}
                {!currentPlayer ? (
                  <div className="bg-surface-800 border border-surface-600 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Enter Your Name</h3>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleJoinGame()}
                        placeholder="Your name..."
                        className="flex-1 px-4 py-3 bg-surface-700 border border-surface-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan"
                        autoFocus
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleJoinGame}
                        disabled={!playerName.trim()}
                        className="px-6 py-3 bg-neon-cyan text-surface-900 font-bold rounded-xl disabled:opacity-50"
                      >
                        Join
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Players */}
                    <div className="bg-surface-800 border border-surface-600 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">
                        Players ({room?.players.length || 0})
                      </h3>
                      <div className="space-y-3">
                        {room?.players.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center gap-4 p-3 bg-surface-700 rounded-xl"
                          >
                            <div className="w-12 h-12 bg-surface-600 rounded-xl flex items-center justify-center text-2xl">
                              {player.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white">{player.name}</span>
                                {player.id === room.hostId && (
                                  <Crown className="w-4 h-4 text-neon-yellow" />
                                )}
                                {player.id === currentPlayer?.id && (
                                  <span className="text-xs text-slate-400">(you)</span>
                                )}
                              </div>
                            </div>
                            {player.isReady ? (
                              <CheckCircle className="w-6 h-6 text-neon-green" />
                            ) : (
                              <Circle className="w-6 h-6 text-slate-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleToggleReady}
                        className={`flex-1 py-4 font-bold rounded-xl transition-colors ${
                          currentPlayer?.isReady
                            ? 'bg-neon-green text-surface-900'
                            : 'bg-surface-700 text-white hover:bg-surface-600'
                        }`}
                      >
                        {currentPlayer?.isReady ? '✓ Ready!' : 'Ready Up'}
                      </motion.button>

                      {isHost && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleStartGame}
                          disabled={(room?.players.length || 0) < 1}
                          className="flex-1 py-4 bg-gradient-to-r from-neon-pink to-neon-cyan text-surface-900 font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Play className="w-5 h-5" />
                          Start Game
                        </motion.button>
                      )}
                    </div>

                    {!isHost && (
                      <p className="text-center text-slate-400 text-sm">
                        Waiting for host to start the game...
                      </p>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

