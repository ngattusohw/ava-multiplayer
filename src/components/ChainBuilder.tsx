import { useEffect, useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Timer, Zap, Check, X, ArrowRight, Trophy, Lightbulb, Play, Trash2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { TOOLS, getToolById } from '../data/gameData';

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
        className="text-9xl font-black text-neon-pink"
      >
        {count === 0 ? 'GO!' : count}
      </motion.div>
    </div>
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
      {/* Category tabs */}
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

      {/* Tools grid */}
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

function ChainDisplay({ 
  chain, 
  onRemove, 
  onReorder 
}: { 
  chain: string[];
  onRemove: (index: number) => void;
  onReorder: (newChain: string[]) => void;
}) {
  if (chain.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 border-2 border-dashed border-surface-600 rounded-2xl">
        <div className="text-center">
          <div className="text-slate-500 mb-2">Your investigation chain</div>
          <div className="text-sm text-slate-600">Add tools from the palette below</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-800/50 border border-surface-600 rounded-2xl p-4">
      <Reorder.Group 
        axis="x" 
        values={chain} 
        onReorder={onReorder}
        className="flex items-center gap-2 overflow-x-auto pb-2"
      >
        {chain.map((toolId, index) => {
          const tool = getToolById(toolId);
          if (!tool) return null;

          return (
            <Reorder.Item key={toolId} value={toolId}>
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                {index > 0 && (
                  <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
                <div 
                  className="relative group bg-surface-700 border rounded-xl p-3 cursor-grab active:cursor-grabbing flex-shrink-0"
                  style={{ borderColor: tool.color + '40' }}
                >
                  <button
                    onClick={() => onRemove(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{tool.icon}</span>
                    <div>
                      <div className="text-xs text-slate-400">Step {index + 1}</div>
                      <div className="font-mono text-sm" style={{ color: tool.color }}>
                        {tool.name}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
}

export function ChainBuilder() {
  const {
    phase,
    currentScenario,
    playerChain,
    players,
    currentPlayerId,
    timeRemaining,
    roundNumber,
    totalRounds,
    addToChain,
    removeFromChain,
    submitChain,
    decrementTime,
    nextRound,
    setPhase,
    resetGame,
  } = useGameStore();

  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [score, setScore] = useState<number | null>(null);

  const currentPlayer = players.find(p => p.id === currentPlayerId);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(decrementTime, 1000);
    return () => clearInterval(timer);
  }, [phase, decrementTime]);

  const handleSubmit = () => {
    const earnedScore = submitChain();
    setScore(earnedScore);
  };

  const handleReorder = (newChain: string[]) => {
    // Clear and rebuild chain
    while (playerChain.length > 0) {
      removeFromChain(0);
    }
    newChain.forEach((toolId) => addToChain(toolId));
  };

  const revealHint = () => {
    if (currentScenario && hintIndex < currentScenario.hints.length) {
      setShowHint(true);
      setHintIndex(hintIndex + 1);
    }
  };

  if (!currentScenario) {
    return <div>Loading scenario...</div>;
  }

  return (
    <div className="min-h-screen grid-bg relative">
      {/* Countdown overlay */}
      <AnimatePresence>
        {phase === 'countdown' && (
          <Countdown onComplete={() => setPhase('playing')} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface-900/80 backdrop-blur-xl border-b border-surface-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">
                Round <span className="text-white font-bold">{roundNumber}</span> of {totalRounds}
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

      {/* Scenario */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-neon-pink/10 to-neon-cyan/10 border border-neon-pink/30 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-neon-pink font-medium mb-2">{currentScenario.title}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{currentScenario.question}</h2>
              <p className="text-slate-400">{currentScenario.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-3xl font-black text-neon-yellow">
                {currentScenario.points}
              </div>
              <div className="text-xs text-slate-400">bonus points</div>
            </div>
          </div>
        </motion.div>

        {/* Hint button */}
        <div className="flex justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={revealHint}
            disabled={hintIndex >= currentScenario.hints.length}
            className="flex items-center gap-2 px-4 py-2 bg-surface-700 hover:bg-surface-600 rounded-full text-sm text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lightbulb className="w-4 h-4" />
            Get Hint ({currentScenario.hints.length - hintIndex} remaining)
          </motion.button>
        </div>

        {/* Hints display */}
        <AnimatePresence>
          {showHint && hintIndex > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-surface-800/50 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium mb-2">
                  <Lightbulb className="w-4 h-4" />
                  Hints
                </div>
                <div className="space-y-2">
                  {currentScenario.hints.slice(0, hintIndex).map((hint, i) => (
                    <div key={i} className="text-slate-300 text-sm">
                      {i + 1}. {hint}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chain display */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white">Your Investigation Chain</h3>
            <div className="text-sm text-slate-400">
              {playerChain.length} / {currentScenario.correctChain.length} steps
            </div>
          </div>
          <ChainDisplay
            chain={playerChain}
            onRemove={removeFromChain}
            onReorder={handleReorder}
          />
        </div>

        {/* Tool palette */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-3">Tool Palette</h3>
          <ToolPalette
            onAddTool={addToChain}
            usedTools={playerChain}
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              while (playerChain.length > 0) {
                removeFromChain(0);
              }
            }}
            className="px-6 py-3 bg-surface-700 hover:bg-surface-600 text-white font-medium rounded-xl flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Clear
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={playerChain.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-neon-pink to-neon-cyan text-surface-900 font-bold rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            Submit Chain
          </motion.button>
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
              className="bg-surface-800 border border-surface-600 rounded-3xl p-8 max-w-lg w-full mx-4 text-center"
            >
              <div className="w-20 h-20 bg-neon-pink/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-neon-pink" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Round Complete!</h2>

              {/* Show comparison */}
              <div className="mb-6 text-left">
                <div className="text-sm text-slate-400 mb-2">Correct chain:</div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {currentScenario?.correctChain.map((toolId, i) => {
                    const tool = getToolById(toolId);
                    const isCorrect = playerChain[i] === toolId;
                    return (
                      <div key={i} className="flex items-center gap-1">
                        {i > 0 && <ArrowRight className="w-3 h-3 text-slate-600" />}
                        <div className={`px-2 py-1 rounded-lg text-xs font-mono flex items-center gap-1 ${
                          isCorrect ? 'bg-neon-green/20 text-neon-green' : 'bg-surface-700 text-slate-300'
                        }`}>
                          {isCorrect && <Check className="w-3 h-3" />}
                          {tool?.icon} {tool?.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-5xl font-black text-neon-pink mb-8">
                +{score || 0} pts
              </div>

              <div className="flex gap-4">
                {roundNumber < totalRounds ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setScore(null);
                      setHintIndex(0);
                      setShowHint(false);
                      nextRound();
                    }}
                    className="flex-1 py-4 bg-gradient-to-r from-neon-pink to-neon-cyan text-surface-900 font-bold rounded-xl"
                  >
                    Next Round
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetGame}
                    className="flex-1 py-4 bg-gradient-to-r from-neon-pink to-neon-cyan text-surface-900 font-bold rounded-xl"
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

