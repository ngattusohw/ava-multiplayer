import { useEffect, useState, useCallback, useRef } from 'react';
import PartySocket from 'partysocket';

// Types matching the server
export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isReady: boolean;
  hasSubmitted: boolean;
  chainLength: number;
}

export interface GameRoom {
  players: Player[];
  phase: 'lobby' | 'countdown' | 'playing' | 'results';
  currentScenario: number;
  roundNumber: number;
  totalRounds: number;
  startTime: number | null;
  timeLimit: number;
  hostId: string | null;
}

type ServerMessage =
  | { type: 'room-state'; room: GameRoom }
  | { type: 'player-joined'; player: Player }
  | { type: 'player-left'; playerId: string }
  | { type: 'player-ready'; playerId: string }
  | { type: 'game-starting'; countdown: number }
  | { type: 'round-start'; scenario: number; timeLimit: number }
  | { type: 'player-submitted'; playerId: string; score: number; chainLength: number }
  | { type: 'round-end'; leaderboard: Player[] }
  | { type: 'game-over'; leaderboard: Player[] }
  | { type: 'error'; message: string };

// PartyKit host - use localhost in dev, deployed URL in production
const PARTYKIT_HOST = import.meta.env.DEV
  ? 'localhost:1999'
  : 'ava-architect.ngattusohw.partykit.dev';

export function useMultiplayer(roomId: string | null) {
  const socketRef = useRef<PartySocket | null>(null);
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Connect to room
  useEffect(() => {
    if (!roomId) return;

    const ws = new PartySocket({
      host: PARTYKIT_HOST,
      room: roomId,
    });

    socketRef.current = ws;

    ws.addEventListener('open', () => {
      setIsConnected(true);
      setPlayerId(ws.id);
    });

    ws.addEventListener('close', () => {
      setIsConnected(false);
    });

    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data) as ServerMessage;

      switch (message.type) {
        case 'room-state':
          setRoom(message.room);
          break;
        case 'player-joined':
          // Handled by room-state update
          break;
        case 'player-left':
          // Handled by room-state update
          break;
        case 'game-starting':
          setCountdown(message.countdown);
          setIsGameOver(false);
          break;
        case 'round-start':
          setCountdown(0);
          break;
        case 'round-end':
          setLeaderboard(message.leaderboard);
          break;
        case 'game-over':
          setLeaderboard(message.leaderboard);
          setIsGameOver(true);
          break;
        case 'error':
          setError(message.message);
          setTimeout(() => setError(null), 3000);
          break;
      }
    });

    return () => {
      ws.close();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [roomId]);

  // Join the room with a name
  const join = useCallback((name: string, avatar?: string) => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: 'join', name, avatar }));
    }
  }, []);

  // Toggle ready state
  const toggleReady = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: 'ready' }));
    }
  }, []);

  // Start the game (host only)
  const startGame = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: 'start-game' }));
    }
  }, []);

  // Submit score for the round
  const submitScore = useCallback((score: number, chainLength: number) => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: 'submit-score', score, chainLength }));
    }
  }, []);

  // Move to next round (host only)
  const nextRound = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: 'next-round' }));
    }
  }, []);

  // Leave the room
  const leave = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: 'leave' }));
      socketRef.current.close();
    }
  }, []);

  // Get current player
  const currentPlayer = room?.players.find((p) => p.id === playerId) || null;
  const isHost = room?.hostId === playerId;
  const allReady = room?.players.every((p) => p.isReady) || false;

  return {
    // State
    room,
    playerId,
    currentPlayer,
    isHost,
    allReady,
    countdown,
    leaderboard,
    isGameOver,
    error,
    isConnected,

    // Actions
    join,
    toggleReady,
    startGame,
    submitScore,
    nextRound,
    leave,
  };
}

// Generate a random room code
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
