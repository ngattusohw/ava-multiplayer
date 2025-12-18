import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, ArrowRight, Trophy, Lightbulb, Play, Trash2, Users } from 'lucide-react';
import type { Player, GameRoom } from '../hooks/useMultiplayer';
import { TOOLS, SCENARIOS, getToolById } from '../data/gameData';
import {
  playCountdownTick,
  playGo,
  playAddTool,
  playRemoveTool,
  playSubmit,
  playRoundEnd,
  playVictory,
  playTimerWarning,
  playHint
} from '../utils/sounds';

// Props interface - receives multiplayer state from parent
export interface MultiplayerGameProps {
  room: GameRoom;
  playerId: string | null;
  currentPlayer: Player | null;
  isHost: boolean;
  countdown: number;
  leaderboard: Player[];
  isGameOver: boolean;
  submitScore: (score: number, chainLength: number) => void;
  nextRound: () => void;
  onExit: () => void;
}

function Countdown({ count }: { count: number }) {
  const lastCountRef = useRef(count);

  useEffect(() => {
    if (count !== lastCountRef.current) {
      if (count === 0) {
        playGo();
      } else if (count > 0) {
        playCountdownTick();
      }
      lastCountRef.current = count;
    }
  }, [count]);

  return (
    <motion.div
      key={count}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.5, opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 z-50 flex items-center justify-center"
    >
      {/* Pulsing background rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0.3 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-64 h-64 rounded-full border-4 border-neon-pink absolute"
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0.3 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          className="w-48 h-48 rounded-full border-4 border-neon-cyan absolute"
        />
      </div>
      <div className="text-center relative z-10">
        <motion.div
          key={count}
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className="text-9xl font-black mb-4"
          style={{
            color: count === 0 ? '#00ff88' : '#ff00ff',
            textShadow: count === 0
              ? '0 0 60px rgba(0,255,136,0.5)'
              : '0 0 60px rgba(255,0,255,0.5)',
          }}
        >
          {count === 0 ? 'GO!' : count}
        </motion.div>
        <div className="text-xl text-slate-300">Get ready to build your chain!</div>
      </div>
    </motion.div>
  );
}

function PlayerScoreboard({ players, currentPlayerId }: { players: Player[]; currentPlayerId: string | null }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-surface-800/80 backdrop-blur-xl border border-surface-600 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-400">Live Scores</span>
      </div>
      <div className="space-y-2">
        {sorted.map((player, i) => (
          <div
            key={player.id}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              player.id === currentPlayerId ? 'bg-neon-cyan/10 border border-neon-cyan/30' : 'bg-surface-700/50'
            }`}
          >
            <div className="w-6 text-center font-bold text-slate-400">
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
            </div>
            <div className="w-8 h-8 bg-surface-600 rounded-lg flex items-center justify-center text-lg">
              {player.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{player.name}</div>
              <div className="text-xs text-slate-400">
                {player.hasSubmitted ? '✓ Submitted' : 'Building...'}
              </div>
            </div>
            <div className="font-bold text-neon-yellow">{player.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Leaderboard({
  players,
  isGameOver,
  isHost,
  scenario,
  onNextRound,
  onExit
}: {
  players: Player[];
  isGameOver: boolean;
  isHost: boolean;
  scenario: { title: string; question: string; correctChain: string[] } | null;
  onNextRound: () => void;
  onExit: () => void;
}) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-surface-900/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-surface-800 border border-surface-600 rounded-3xl p-8 max-w-lg w-full my-8"
      >
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-neon-yellow to-neon-pink rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-surface-900" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isGameOver ? 'Game Over!' : 'Round Complete!'}
          </h2>
          {winner && (
            <p className="text-lg text-neon-yellow">
              {winner.avatar} {winner.name} leads with {winner.score} pts!
            </p>
          )}
        </div>

        {/* Correct Answer Section */}
        {scenario && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="w-full flex items-center justify-between p-4 bg-surface-700/50 hover:bg-surface-700 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neon-green/20 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-neon-green" />
                </div>
                <span className="font-medium text-white">View Correct Answer</span>
              </div>
              <motion.span
                animate={{ rotate: showAnswer ? 180 : 0 }}
                className="text-slate-400"
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 p-4 bg-neon-green/5 border border-neon-green/20 rounded-xl">
                    <div className="text-sm text-slate-400 mb-2">{scenario.title}</div>
                    <div className="text-white text-sm mb-4">{scenario.question}</div>
                    <div className="text-xs text-neon-green font-medium mb-2">CORRECT CHAIN:</div>
                    <div className="flex flex-wrap items-center gap-2">
                      {scenario.correctChain.map((toolId, i) => {
                        const tool = getToolById(toolId);
                        return (
                          <div key={i} className="flex items-center gap-1">
                            {i > 0 && <ArrowRight className="w-3 h-3 text-slate-500" />}
                            <div
                              className="px-2 py-1 rounded-lg text-xs font-mono"
                              style={{
                                backgroundColor: tool ? `${tool.color}15` : '#333',
                                color: tool?.color || '#888',
                                border: `1px solid ${tool?.color || '#555'}40`,
                              }}
                            >
                              {tool?.icon} {tool?.name || toolId}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="space-y-3 mb-6">
          {sorted.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl ${
                i === 0 ? 'bg-gradient-to-r from-neon-yellow/20 to-neon-pink/20 border border-neon-yellow/30' : 'bg-surface-700'
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center text-2xl">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </div>
              <div className="w-12 h-12 bg-surface-600 rounded-xl flex items-center justify-center text-2xl">
                {player.avatar}
              </div>
              <div className="flex-1">
                <div className="font-bold text-white">{player.name}</div>
                <div className="text-sm text-slate-400">
                  {player.chainLength} tools used
                </div>
              </div>
              <div className="text-2xl font-black text-neon-cyan">{player.score}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4">
          {isHost && !isGameOver && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNextRound}
              className="flex-1 py-4 bg-gradient-to-r from-neon-pink to-neon-cyan text-surface-900 font-bold rounded-xl"
            >
              Next Round
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExit}
            className={`py-4 px-6 bg-surface-700 text-white font-medium rounded-xl ${
              !isHost || isGameOver ? 'flex-1' : ''
            }`}
          >
            {isGameOver ? 'Back to Lobby' : 'Exit Game'}
          </motion.button>
        </div>

        {!isHost && !isGameOver && (
          <p className="text-center text-slate-400 text-sm mt-4">
            Waiting for host to start next round...
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

function ToolPalette({
  onAddTool,
  usedTools
}: {
  onAddTool: (toolId: string) => void;
  usedTools: string[];
}) {
  const categories = ['user', 'mentorship', 'insights', 'messages', 'surveys', 'scoring', 'churn'] as const;
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('insights');

  const categoryColors: Record<typeof categories[number], string> = {
    user: '#00f5ff',
    mentorship: '#ff00ff',
    insights: '#00ff88',
    messages: '#a855f7',
    surveys: '#14b8a6',
    scoring: '#eab308',
    churn: '#ef4444',
  };

  const filteredTools = TOOLS.filter(t => t.category === activeCategory);

  return (
    <div className="bg-surface-800/80 backdrop-blur-xl border border-surface-600 rounded-2xl overflow-hidden">
      <div className="flex overflow-x-auto border-b border-surface-600">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-3 text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'text-white border-b-2'
                : 'text-slate-400 hover:text-white'
            }`}
            style={{
              borderColor: activeCategory === cat ? categoryColors[cat] : 'transparent',
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="p-4 grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
        {filteredTools.map((tool) => {
          const isUsed = usedTools.includes(tool.id);
          return (
            <motion.button
              key={tool.id}
              whileHover={{ scale: isUsed ? 1 : 1.02 }}
              whileTap={{ scale: isUsed ? 1 : 0.98 }}
              onClick={() => !isUsed && onAddTool(tool.id)}
              disabled={isUsed}
              className={`p-3 rounded-xl text-left transition-all ${
                isUsed
                  ? 'bg-surface-700/50 opacity-50 cursor-not-allowed'
                  : 'bg-surface-700 hover:bg-surface-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{tool.icon}</span>
                <span className="font-mono text-xs truncate" style={{ color: tool.color }}>
                  {tool.name}
                </span>
              </div>
              <div className="text-xs text-slate-400 line-clamp-2">
                {tool.description}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function MultiplayerGame({
  room,
  playerId,
  currentPlayer,
  isHost,
  countdown,
  leaderboard,
  isGameOver,
  submitScore,
  nextRound,
  onExit,
}: MultiplayerGameProps) {
  const [playerChain, setPlayerChain] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [lastRoundNumber, setLastRoundNumber] = useState(room.roundNumber);

  const currentScenario = room.currentScenario !== undefined ? SCENARIOS[room.currentScenario] : null;

  // Reset state when round changes
  useEffect(() => {
    if (room.roundNumber !== lastRoundNumber) {
      setPlayerChain([]);
      setHasSubmitted(false);
      setShowHint(false);
      setHintIndex(0);
      setTimeRemaining(room.timeLimit);
      setLastRoundNumber(room.roundNumber);
    }
  }, [room.roundNumber, lastRoundNumber, room.timeLimit]);

  // Reset when phase changes to playing
  useEffect(() => {
    if (room.phase === 'playing' && !hasSubmitted) {
      setTimeRemaining(room.timeLimit);
    }
  }, [room.phase, room.timeLimit, hasSubmitted]);

  // Timer
  useEffect(() => {
    if (room.phase !== 'playing' || hasSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [room.phase, hasSubmitted]);

  const addToChain = (toolId: string) => {
    playAddTool();
    setPlayerChain((prev) => [...prev, toolId]);
  };

  const removeFromChain = (index: number) => {
    playRemoveTool();
    setPlayerChain((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = useCallback(() => {
    if (!currentScenario || hasSubmitted) return;

    // Calculate score
    let score = 0;
    const correctChain = currentScenario.correctChain;

    for (let i = 0; i < Math.min(playerChain.length, correctChain.length); i++) {
      if (playerChain[i] === correctChain[i]) {
        score += 50;
      } else if (correctChain.includes(playerChain[i])) {
        score += 20;
      }
    }

    // Bonus for perfect chain
    if (
      playerChain.length === correctChain.length &&
      playerChain.every((t, i) => t === correctChain[i])
    ) {
      score += currentScenario.points;
    }

    // Time bonus
    const timeBonus = Math.floor(timeRemaining / 10) * 5;
    score += timeBonus;

    playSubmit();
    submitScore(score, playerChain.length);
    setHasSubmitted(true);
  }, [currentScenario, playerChain, timeRemaining, hasSubmitted, submitScore]);

  const revealHint = () => {
    if (currentScenario && hintIndex < currentScenario.hints.length) {
      playHint();
      setShowHint(true);
      setHintIndex(hintIndex + 1);
    }
  };

  // Play warning sound when time is low
  useEffect(() => {
    if (timeRemaining === 15 || timeRemaining === 10 || timeRemaining === 5) {
      playTimerWarning();
    }
  }, [timeRemaining]);

  // Play sound when round ends
  useEffect(() => {
    if (room.phase === 'results' && leaderboard.length > 0) {
      if (isGameOver) {
        playVictory();
      } else {
        playRoundEnd();
      }
    }
  }, [room.phase, leaderboard.length, isGameOver]);

  // Show countdown during countdown phase
  if (room.phase === 'countdown' || countdown > 0) {
    return <Countdown count={countdown} />;
  }

  // Show leaderboard
  if (room.phase === 'results' && leaderboard.length > 0) {
    return (
      <Leaderboard
        players={leaderboard}
        isGameOver={isGameOver}
        isHost={isHost}
        scenario={currentScenario}
        onNextRound={nextRound}
        onExit={onExit}
      />
    );
  }

  if (!currentScenario || room.phase !== 'playing') {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white text-xl font-medium">Starting game...</p>
          <p className="text-slate-400 text-sm mt-2">Phase: {room.phase}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg relative">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface-900/80 backdrop-blur-xl border-b border-surface-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">
                Round <span className="text-white font-bold">{room.roundNumber}</span> of {room.totalRounds}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm capitalize ${
                currentScenario.difficulty === 'easy'
                  ? 'bg-green-500/20 text-green-400'
                  : currentScenario.difficulty === 'medium'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
              }`}>
                {currentScenario.difficulty}
              </div>
            </div>

            <motion.div
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xl ${
                timeRemaining <= 15
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-surface-700 text-white'
              }`}
              animate={timeRemaining <= 15 ? { scale: [1, 1.05, 1] } : undefined}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <Timer className="w-5 h-5" />
              {timeRemaining}s
            </motion.div>

            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-neon-yellow" />
              <span className="text-2xl font-bold text-white">{currentPlayer?.score || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Main game area */}
          <div>
            {/* Scenario */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-neon-pink/10 to-neon-cyan/10 border border-neon-pink/30 rounded-2xl p-6 mb-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-neon-pink font-medium mb-2">{currentScenario.title}</div>
                  <h2 className="text-2xl font-bold text-white mb-2">{currentScenario.question}</h2>
                  <p className="text-slate-400">{currentScenario.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-neon-yellow">{currentScenario.points}</div>
                  <div className="text-xs text-slate-400">bonus pts</div>
                </div>
              </div>
            </motion.div>

            {/* Hint button */}
            <div className="flex justify-center mb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={revealHint}
                disabled={hintIndex >= currentScenario.hints.length || hasSubmitted}
                className="flex items-center gap-2 px-4 py-2 bg-surface-700 hover:bg-surface-600 rounded-full text-sm text-slate-300 disabled:opacity-50"
              >
                <Lightbulb className="w-4 h-4" />
                Hint ({currentScenario.hints.length - hintIndex})
              </motion.button>
            </div>

            {/* Hints */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6"
                >
                  <div className="bg-surface-800/50 border border-yellow-500/30 rounded-xl p-4">
                    {currentScenario.hints.slice(0, hintIndex).map((hint, i) => (
                      <div key={i} className="text-slate-300 text-sm">
                        {i + 1}. {hint}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chain display */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">Your Chain</h3>
                <span className="text-sm text-slate-400">
                  {playerChain.length} / {currentScenario.correctChain.length} steps
                </span>
              </div>

              {playerChain.length === 0 ? (
                <div className="flex items-center justify-center h-24 border-2 border-dashed border-surface-600 rounded-xl">
                  <span className="text-slate-500">Add tools from below</span>
                </div>
              ) : (
                <div className="bg-surface-800/50 border border-surface-600 rounded-xl p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {playerChain.map((toolId, i) => {
                      const tool = getToolById(toolId);
                      if (!tool) return null;
                      return (
                        <div key={i} className="flex items-center gap-2">
                          {i > 0 && <ArrowRight className="w-4 h-4 text-slate-500" />}
                          <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group bg-surface-700 border rounded-lg p-2"
                            style={{ borderColor: tool.color + '40' }}
                          >
                            {!hasSubmitted && (
                              <button
                                onClick={() => removeFromChain(i)}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white opacity-0 group-hover:opacity-100"
                              >
                                ×
                              </button>
                            )}
                            <div className="flex items-center gap-2">
                              <span>{tool.icon}</span>
                              <span className="font-mono text-xs" style={{ color: tool.color }}>
                                {tool.name}
                              </span>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Tool palette */}
            {!hasSubmitted && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Tools</h3>
                <ToolPalette onAddTool={addToChain} usedTools={playerChain} />
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-center gap-4">
              {!hasSubmitted ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPlayerChain([])}
                    className="px-6 py-3 bg-surface-700 hover:bg-surface-600 text-white rounded-xl flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={playerChain.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-surface-900 font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
                  >
                    <Play className="w-5 h-5" />
                    Submit
                  </motion.button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-neon-green text-xl font-bold mb-2">✓ Submitted!</div>
                  <p className="text-slate-400">Waiting for other players...</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Live scores */}
          <div>
            <PlayerScoreboard players={room.players} currentPlayerId={playerId} />
          </div>
        </div>
      </div>
    </div>
  );
}
