import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { Lobby } from './components/Lobby';
import { MatchingGame } from './components/MatchingGame';
import { ChainBuilder } from './components/ChainBuilder';
import { MultiplayerLobby } from './components/MultiplayerLobby';
import { SoundToggle } from './components/SoundToggle';
import { playClick } from './utils/sounds';

type AppMode = 'home' | 'singleplayer' | 'multiplayer-lobby' | 'multiplayer-game';

function App() {
  const { mode, resetGame } = useGameStore();
  const [appMode, setAppMode] = useState<AppMode>('home');

  // Home screen with mode selection
  if (appMode === 'home') {
    return (
      <>
        <SoundToggle />
        <HomeScreen onSelectMode={setAppMode} />
      </>
    );
  }

  // Multiplayer lobby
  if (appMode === 'multiplayer-lobby') {
    return (
      <>
        <SoundToggle />
        <MultiplayerLobby onBack={() => setAppMode('home')} />
      </>
    );
  }

  // Note: Multiplayer game is now handled inside MultiplayerLobby

  // Single player modes
  if (appMode === 'singleplayer') {
    if (mode === 'lobby' || mode === 'results') {
      return <Lobby onBack={() => { resetGame(); setAppMode('home'); }} />;
    }
    if (mode === 'matching') {
      return <MatchingGame />;
    }
    if (mode === 'chain-builder') {
      return <ChainBuilder />;
    }
  }

  return <HomeScreen onSelectMode={setAppMode} />;
}

function HomeScreen({ onSelectMode }: { onSelectMode: (mode: AppMode) => void }) {
  return (
    <div className="min-h-screen grid-bg relative overflow-hidden flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-neon-cyan/5 blur-3xl animate-pulse"
          style={{ top: '10%', left: '5%' }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-neon-pink/5 blur-3xl animate-pulse"
          style={{ bottom: '10%', right: '10%', animationDelay: '1s' }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full bg-neon-yellow/5 blur-3xl animate-pulse"
          style={{ top: '40%', right: '30%', animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Logo */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-700/50 border border-neon-cyan/20 mb-6">
            <span className="text-sm text-neon-cyan font-medium">Somethings Team Game</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-yellow bg-clip-text text-transparent">
              AVA
            </span>
          </h1>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">ARCHITECT</h2>
          <p className="text-xl text-slate-400 max-w-xl mx-auto">
            Learn how AVA's AI tools work together through puzzle challenges
          </p>
        </div>

        {/* Mode selection */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Single Player */}
          <button
            onClick={() => { playClick(); onSelectMode('singleplayer'); }}
            className="group relative bg-surface-800/80 backdrop-blur-xl border border-surface-600 hover:border-neon-cyan/50 rounded-3xl p-8 text-left transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-16 h-16 bg-neon-cyan/10 rounded-2xl flex items-center justify-center mb-6 text-4xl">
                🎯
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Practice Mode</h3>
              <p className="text-slate-400 mb-4">
                Play solo to learn the tools. Two game modes: Data Matcher & Chain Builder.
              </p>
              <div className="flex items-center gap-2 text-neon-cyan font-medium">
                <span>Start Playing</span>
                <span>→</span>
              </div>
            </div>
          </button>

          {/* Multiplayer */}
          <button
            onClick={() => { playClick(); onSelectMode('multiplayer-lobby'); }}
            className="group relative bg-surface-800/80 backdrop-blur-xl border border-surface-600 hover:border-neon-pink/50 rounded-3xl p-8 text-left transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-16 h-16 bg-neon-pink/10 rounded-2xl flex items-center justify-center mb-6 text-4xl">
                🏆
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Multiplayer</h3>
              <p className="text-slate-400 mb-4">
                Compete with your team in real-time Chain Builder battles. Live leaderboard!
              </p>
              <div className="flex items-center gap-2 text-neon-pink font-medium">
                <span>Play Together</span>
                <span>→</span>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-slate-500 text-sm">
          Built with 💜 for the Somethings team
        </div>
      </div>
    </div>
  );
}

export default App;
