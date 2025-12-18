import { create } from 'zustand';
import type { DataSource, Tool, GameScenario } from '../data/gameData';
import { generateMatchRound, SCENARIOS } from '../data/gameData';

export type GameMode = 'lobby' | 'matching' | 'chain-builder' | 'results';
export type GamePhase = 'waiting' | 'countdown' | 'playing' | 'round-end' | 'game-over';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isHost: boolean;
  isReady: boolean;
  currentMatches: number;
  streak: number;
}

export interface MatchAttempt {
  dataSourceId: string;
  toolId: string;
  correct: boolean;
  timestamp: number;
}

export interface GameState {
  // Game configuration
  mode: GameMode;
  phase: GamePhase;
  difficulty: 'easy' | 'medium' | 'hard';
  roundNumber: number;
  totalRounds: number;
  timeRemaining: number;
  roundTimeLimit: number;

  // Players
  players: Player[];
  currentPlayerId: string | null;

  // Matching game state
  dataSources: DataSource[];
  tools: Tool[];
  correctMatches: Map<string, string>;
  playerMatches: Map<string, string>; // dataSourceId -> toolId
  matchHistory: MatchAttempt[];

  // Chain builder state
  currentScenario: GameScenario | null;
  playerChain: string[]; // Tool IDs in order

  // Drag state
  draggedItem: { type: 'data' | 'tool'; id: string } | null;

  // Actions
  setMode: (mode: GameMode) => void;
  setPhase: (phase: GamePhase) => void;
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  setCurrentPlayer: (playerId: string) => void;

  // Game actions
  startMatchingGame: () => void;
  startChainBuilder: () => void;
  makeMatch: (dataSourceId: string, toolId: string) => boolean;
  addToChain: (toolId: string) => void;
  removeFromChain: (index: number) => void;
  submitChain: () => number;
  nextRound: () => void;
  endGame: () => void;
  resetGame: () => void;

  // Timer
  decrementTime: () => void;

  // Drag and drop
  setDraggedItem: (item: { type: 'data' | 'tool'; id: string } | null) => void;
}

const AVATARS = ['🦊', '🐸', '🦉', '🐙', '🦋', '🌸', '🔥', '⚡', '🌈', '🎮'];

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  mode: 'lobby',
  phase: 'waiting',
  difficulty: 'medium',
  roundNumber: 1,
  totalRounds: 3,
  timeRemaining: 60,
  roundTimeLimit: 60,

  players: [],
  currentPlayerId: null,

  dataSources: [],
  tools: [],
  correctMatches: new Map(),
  playerMatches: new Map(),
  matchHistory: [],

  currentScenario: null,
  playerChain: [],

  draggedItem: null,

  // Mode and phase setters
  setMode: (mode) => set({ mode }),
  setPhase: (phase) => set({ phase }),
  setDifficulty: (difficulty) => set({ difficulty }),

  // Player management
  addPlayer: (player) => set((state) => ({
    players: [...state.players, player],
  })),

  removePlayer: (playerId) => set((state) => ({
    players: state.players.filter((p) => p.id !== playerId),
  })),

  updatePlayer: (playerId, updates) => set((state) => ({
    players: state.players.map((p) =>
      p.id === playerId ? { ...p, ...updates } : p
    ),
  })),

  setCurrentPlayer: (playerId) => set({ currentPlayerId: playerId }),

  // Start matching game
  startMatchingGame: () => {
    const { difficulty } = get();
    const { dataSources, tools, correctMatches } = generateMatchRound(difficulty);

    set({
      mode: 'matching',
      phase: 'countdown',
      dataSources,
      tools,
      correctMatches,
      playerMatches: new Map(),
      matchHistory: [],
      roundNumber: 1,
      timeRemaining: difficulty === 'easy' ? 45 : difficulty === 'medium' ? 60 : 90,
    });

    // Start countdown then switch to playing
    setTimeout(() => {
      set({ phase: 'playing' });
    }, 3000);
  },

  // Start chain builder
  startChainBuilder: () => {
    const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];

    set({
      mode: 'chain-builder',
      phase: 'countdown',
      currentScenario: scenario,
      playerChain: [],
      roundNumber: 1,
      timeRemaining: scenario.difficulty === 'easy' ? 60 : scenario.difficulty === 'medium' ? 90 : 120,
    });

    setTimeout(() => {
      set({ phase: 'playing' });
    }, 3000);
  },

  // Make a match in matching mode
  makeMatch: (dataSourceId, toolId) => {
    const { correctMatches, playerMatches, currentPlayerId, players } = get();
    const isCorrect = correctMatches.get(dataSourceId) === toolId;

    const newPlayerMatches = new Map(playerMatches);
    if (isCorrect) {
      newPlayerMatches.set(dataSourceId, toolId);
    }

    const attempt: MatchAttempt = {
      dataSourceId,
      toolId,
      correct: isCorrect,
      timestamp: Date.now(),
    };

    // Update player score
    const updatedPlayers = players.map((p) => {
      if (p.id === currentPlayerId) {
        const newStreak = isCorrect ? p.streak + 1 : 0;
        const points = isCorrect ? 10 * (1 + Math.floor(newStreak / 3)) : 0;
        return {
          ...p,
          score: p.score + points,
          currentMatches: isCorrect ? p.currentMatches + 1 : p.currentMatches,
          streak: newStreak,
        };
      }
      return p;
    });

    set({
      playerMatches: newPlayerMatches,
      matchHistory: [...get().matchHistory, attempt],
      players: updatedPlayers,
    });

    // Check if round is complete
    if (newPlayerMatches.size === correctMatches.size) {
      set({ phase: 'round-end' });
    }

    return isCorrect;
  },

  // Chain builder actions
  addToChain: (toolId) => {
    set((state) => ({
      playerChain: [...state.playerChain, toolId],
    }));
  },

  removeFromChain: (index) => {
    set((state) => ({
      playerChain: state.playerChain.filter((_, i) => i !== index),
    }));
  },

  submitChain: () => {
    const { currentScenario, playerChain, currentPlayerId, players } = get();
    if (!currentScenario) return 0;

    // Score based on how many correct tools in correct positions
    let score = 0;
    const correctChain = currentScenario.correctChain;

    for (let i = 0; i < Math.min(playerChain.length, correctChain.length); i++) {
      if (playerChain[i] === correctChain[i]) {
        score += 50; // Correct tool in correct position
      } else if (correctChain.includes(playerChain[i])) {
        score += 20; // Correct tool, wrong position
      }
    }

    // Bonus for getting the full chain correct
    if (playerChain.length === correctChain.length &&
        playerChain.every((t, i) => t === correctChain[i])) {
      score += currentScenario.points;
    }

    // Update player score
    const updatedPlayers = players.map((p) => {
      if (p.id === currentPlayerId) {
        return { ...p, score: p.score + score };
      }
      return p;
    });

    set({ players: updatedPlayers, phase: 'round-end' });
    return score;
  },

  nextRound: () => {
    const { roundNumber, totalRounds, mode, difficulty } = get();

    if (roundNumber >= totalRounds) {
      set({ phase: 'game-over' });
      return;
    }

    if (mode === 'matching') {
      const { dataSources, tools, correctMatches } = generateMatchRound(difficulty);
      set({
        dataSources,
        tools,
        correctMatches,
        playerMatches: new Map(),
        roundNumber: roundNumber + 1,
        phase: 'countdown',
        timeRemaining: difficulty === 'easy' ? 45 : difficulty === 'medium' ? 60 : 90,
      });
    } else {
      const scenario = SCENARIOS[roundNumber % SCENARIOS.length];
      set({
        currentScenario: scenario,
        playerChain: [],
        roundNumber: roundNumber + 1,
        phase: 'countdown',
        timeRemaining: scenario.difficulty === 'easy' ? 60 : scenario.difficulty === 'medium' ? 90 : 120,
      });
    }

    setTimeout(() => {
      set({ phase: 'playing' });
    }, 3000);
  },

  endGame: () => {
    set({ phase: 'game-over', mode: 'results' });
  },

  resetGame: () => {
    set({
      mode: 'lobby',
      phase: 'waiting',
      roundNumber: 1,
      dataSources: [],
      tools: [],
      correctMatches: new Map(),
      playerMatches: new Map(),
      matchHistory: [],
      currentScenario: null,
      playerChain: [],
      players: get().players.map((p) => ({
        ...p,
        score: 0,
        currentMatches: 0,
        streak: 0,
        isReady: false,
      })),
    });
  },

  decrementTime: () => {
    const { timeRemaining, phase } = get();
    if (phase !== 'playing') return;

    if (timeRemaining <= 1) {
      set({ timeRemaining: 0, phase: 'round-end' });
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  setDraggedItem: (item) => set({ draggedItem: item }),
}));

// Helper to create a local player
export function createLocalPlayer(name: string): Player {
  return {
    id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    score: 0,
    isHost: true,
    isReady: false,
    currentMatches: 0,
    streak: 0,
  };
}

