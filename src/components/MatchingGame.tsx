import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, Check, X, ArrowRight, Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { DataSource, Tool, checkMatch } from '../data/gameData';

function DataSourceCard({ 
  dataSource, 
  isMatched,
  onDragStart,
  onDragEnd,
}: { 
  dataSource: DataSource;
  isMatched: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isMatched ? 0.5 : 1, 
        y: 0,
        scale: isMatched ? 0.95 : 1,
      }}
      draggable={!isMatched}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`relative p-4 rounded-xl border-2 cursor-grab active:cursor-grabbing transition-all ${
        isMatched 
          ? 'bg-neon-green/10 border-neon-green/30' 
          : 'bg-surface-700 border-surface-600 hover:border-neon-cyan/50'
      }`}
      style={{ 
        borderColor: isMatched ? undefined : dataSource.color + '40',
      }}
      whileHover={!isMatched ? { scale: 1.02 } : undefined}
      whileTap={!isMatched ? { scale: 0.98 } : undefined}
    >
      {isMatched && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-neon-green rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-surface-900" />
        </div>
      )}
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: dataSource.color + '20' }}
        >
          {dataSource.icon}
        </div>
        <div>
          <div className="font-semibold text-white">{dataSource.displayName}</div>
          <div className="text-sm text-slate-400">{dataSource.description}</div>
        </div>
      </div>
    </motion.div>
  );
}

function ToolCard({ 
  tool, 
  isTarget,
  hasMatch,
  onDrop,
}: { 
  tool: Tool;
  isTarget: boolean;
  hasMatch: boolean;
  onDrop: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`relative p-4 rounded-xl border-2 transition-all ${
        isTarget 
          ? 'bg-neon-cyan/20 border-neon-cyan scale-105' 
          : hasMatch
            ? 'bg-neon-green/10 border-neon-green/30'
            : 'bg-surface-700 border-surface-600'
      }`}
    >
      {hasMatch && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-neon-green rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-surface-900" />
        </div>
      )}
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: tool.color + '20' }}
        >
          {tool.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-sm text-neon-cyan truncate">{tool.name}</div>
          <div className="text-sm text-slate-400 truncate">{tool.description}</div>
        </div>
      </div>
    </motion.div>
  );
}

function Countdown({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 bg-surface-900/90 backdrop-blur-xl z-50 flex items-center justify-center">
      <motion.div
        key={count}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.5, opacity: 0 }}
        className="text-9xl font-black text-neon-cyan"
      >
        {count === 0 ? 'GO!' : count}
      </motion.div>
    </div>
  );
}

function FeedbackPopup({ correct, message }: { correct: boolean; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full font-bold flex items-center gap-2 z-50 ${
        correct 
          ? 'bg-neon-green text-surface-900' 
          : 'bg-red-500 text-white'
      }`}
    >
      {correct ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
      {message}
    </motion.div>
  );
}

export function MatchingGame() {
  const {
    phase,
    dataSources,
    tools,
    playerMatches,
    players,
    currentPlayerId,
    timeRemaining,
    roundNumber,
    totalRounds,
    difficulty,
    makeMatch,
    decrementTime,
    nextRound,
    setPhase,
    resetGame,
  } = useGameStore();

  const [draggedDataId, setDraggedDataId] = useState<string | null>(null);
  const [targetToolId, setTargetToolId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);

  const currentPlayer = players.find(p => p.id === currentPlayerId);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(decrementTime, 1000);
    return () => clearInterval(timer);
  }, [phase, decrementTime]);

  // Handle drop
  const handleDrop = (toolId: string) => {
    if (!draggedDataId) return;
    
    const isCorrect = makeMatch(draggedDataId, toolId);
    
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? `+${10 * (1 + Math.floor((currentPlayer?.streak || 0) / 3))} points!` : 'Try again!',
    });

    setTimeout(() => setFeedback(null), 1500);
    setDraggedDataId(null);
    setTargetToolId(null);
  };

  // Check for matched tools
  const matchedToolIds = new Set<string>();
  playerMatches.forEach((toolId) => matchedToolIds.add(toolId));

  return (
    <div className="min-h-screen grid-bg relative">
      {/* Countdown overlay */}
      <AnimatePresence>
        {phase === 'countdown' && (
          <Countdown onComplete={() => setPhase('playing')} />
        )}
      </AnimatePresence>

      {/* Feedback popup */}
      <AnimatePresence>
        {feedback && <FeedbackPopup {...feedback} />}
      </AnimatePresence>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface-900/80 backdrop-blur-xl border-b border-surface-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Round info */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">
                Round <span className="text-white font-bold">{roundNumber}</span> of {totalRounds}
              </div>
              <div className="px-3 py-1 bg-surface-700 rounded-full text-sm text-slate-300 capitalize">
                {difficulty}
              </div>
            </div>

            {/* Timer */}
            <motion.div 
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xl ${
                timeRemaining <= 10 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-surface-700 text-white'
              }`}
              animate={timeRemaining <= 10 ? { scale: [1, 1.05, 1] } : undefined}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <Timer className="w-5 h-5" />
              {timeRemaining}s
            </motion.div>

            {/* Score */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon-yellow" />
                <span className="text-2xl font-bold text-white">{currentPlayer?.score || 0}</span>
              </div>
              {(currentPlayer?.streak || 0) >= 3 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-neon-yellow/20 text-neon-yellow rounded-full text-sm font-bold"
                >
                  🔥 x{Math.floor((currentPlayer?.streak || 0) / 3) + 1}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game area */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-neon-cyan">
              {playerMatches.size}
            </div>
            <div className="text-slate-400">Matched</div>
          </div>
          <ArrowRight className="w-8 h-8 text-slate-600" />
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-400">
              {dataSources.length - playerMatches.size}
            </div>
            <div className="text-slate-400">Remaining</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Data Sources */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-neon-cyan rounded-full" />
              Data Sources
            </h2>
            <p className="text-slate-400 mb-6">Drag these to the matching tool →</p>
            <div className="space-y-3">
              {dataSources.map((ds) => (
                <DataSourceCard
                  key={ds.id}
                  dataSource={ds}
                  isMatched={playerMatches.has(ds.id)}
                  onDragStart={() => setDraggedDataId(ds.id)}
                  onDragEnd={() => {
                    setDraggedDataId(null);
                    setTargetToolId(null);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-neon-pink rounded-full" />
              AVA Tools
            </h2>
            <p className="text-slate-400 mb-6">Drop data here to make a match</p>
            <div className="space-y-3">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setTargetToolId(tool.id);
                  }}
                  onDragLeave={() => setTargetToolId(null)}
                  onDrop={() => handleDrop(tool.id)}
                >
                  <ToolCard
                    tool={tool}
                    isTarget={targetToolId === tool.id}
                    hasMatch={matchedToolIds.has(tool.id)}
                    onDrop={() => handleDrop(tool.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Round end overlay */}
      <AnimatePresence>
        {phase === 'round-end' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface-900/95 backdrop-blur-xl z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-surface-800 border border-surface-600 rounded-3xl p-8 max-w-md w-full mx-4 text-center"
            >
              <div className="w-20 h-20 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-neon-green" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Round Complete!</h2>
              <p className="text-slate-400 mb-6">
                You matched {playerMatches.size} of {dataSources.length} items
              </p>
              <div className="text-5xl font-black text-neon-cyan mb-8">
                {currentPlayer?.score || 0} pts
              </div>
              <div className="flex gap-4">
                {roundNumber < totalRounds ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextRound}
                    className="flex-1 py-4 bg-gradient-to-r from-neon-cyan to-neon-green text-surface-900 font-bold rounded-xl"
                  >
                    Next Round
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetGame}
                    className="flex-1 py-4 bg-gradient-to-r from-neon-cyan to-neon-green text-surface-900 font-bold rounded-xl"
                  >
                    Play Again
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetGame}
                  className="py-4 px-6 bg-surface-700 text-white font-medium rounded-xl"
                >
                  Exit
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

