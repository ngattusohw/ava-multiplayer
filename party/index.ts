import type * as Party from "partykit/server";

// Game state shared across all players in a room
interface GameRoom {
  players: Player[];
  phase: 'lobby' | 'countdown' | 'playing' | 'results';
  currentScenario: number;
  roundNumber: number;
  totalRounds: number;
  startTime: number | null;
  timeLimit: number;
  hostId: string | null;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isReady: boolean;
  hasSubmitted: boolean;
  chainLength: number;
}

// Message types
type ClientMessage =
  | { type: 'join'; name: string; avatar: string }
  | { type: 'ready' }
  | { type: 'start-game' }
  | { type: 'submit-score'; score: number; chainLength: number }
  | { type: 'next-round' }
  | { type: 'leave' };

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

const AVATARS = ['🦊', '🐸', '🦉', '🐙', '🦋', '🌸', '🔥', '⚡', '🌈', '🎮', '🚀', '💎'];
const TIME_LIMIT = 90; // seconds per round
const TOTAL_ROUNDS = 3;
const COUNTDOWN_SECONDS = 5;
const TOTAL_SCENARIOS = 19; // Update this when adding more scenarios

export default class GameServer implements Party.Server {
  room: GameRoom;
  countdownTimer: ReturnType<typeof setInterval> | null = null;
  gameTimer: ReturnType<typeof setInterval> | null = null;
  usedScenarios: number[] = []; // Track used scenarios to prevent repeats

  constructor(readonly party: Party.Party) {
    this.room = {
      players: [],
      phase: 'lobby',
      currentScenario: 0,
      roundNumber: 0,
      totalRounds: TOTAL_ROUNDS,
      startTime: null,
      timeLimit: TIME_LIMIT,
      hostId: null,
    };
  }

  // Get a random scenario that hasn't been used yet
  getNextScenario(): number {
    const availableScenarios = [];
    for (let i = 0; i < TOTAL_SCENARIOS; i++) {
      if (!this.usedScenarios.includes(i)) {
        availableScenarios.push(i);
      }
    }

    // If all scenarios used, reset the pool (shouldn't happen with enough scenarios)
    if (availableScenarios.length === 0) {
      this.usedScenarios = [];
      return Math.floor(Math.random() * TOTAL_SCENARIOS);
    }

    const scenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
    this.usedScenarios.push(scenario);
    return scenario;
  }

  // Generate a random avatar not already in use
  getAvatar(): string {
    const usedAvatars = this.room.players.map(p => p.avatar);
    const available = AVATARS.filter(a => !usedAvatars.includes(a));
    return available[Math.floor(Math.random() * available.length)] || AVATARS[0];
  }

  // Broadcast to all connections
  broadcast(message: ServerMessage) {
    this.party.broadcast(JSON.stringify(message));
  }

  // Send to specific connection
  send(conn: Party.Connection, message: ServerMessage) {
    conn.send(JSON.stringify(message));
  }

  onConnect(conn: Party.Connection) {
    // Send current room state to new connection
    this.send(conn, { type: 'room-state', room: this.room });
  }

  onClose(conn: Party.Connection) {
    const player = this.room.players.find(p => p.id === conn.id);
    if (player) {
      this.room.players = this.room.players.filter(p => p.id !== conn.id);

      // If host left, assign new host
      if (this.room.hostId === conn.id && this.room.players.length > 0) {
        this.room.hostId = this.room.players[0].id;
      }

      this.broadcast({ type: 'player-left', playerId: conn.id });
      this.broadcast({ type: 'room-state', room: this.room });
    }
  }

  onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message) as ClientMessage;

    switch (data.type) {
      case 'join': {
        // Check if player already exists
        if (this.room.players.find(p => p.id === sender.id)) {
          this.send(sender, { type: 'error', message: 'Already joined' });
          return;
        }

        // Don't allow joining mid-game
        if (this.room.phase !== 'lobby') {
          this.send(sender, { type: 'error', message: 'Game in progress' });
          return;
        }

        const player: Player = {
          id: sender.id,
          name: data.name || `Player ${this.room.players.length + 1}`,
          avatar: data.avatar || this.getAvatar(),
          score: 0,
          isReady: false,
          hasSubmitted: false,
          chainLength: 0,
        };

        this.room.players.push(player);

        // First player is host
        if (this.room.players.length === 1) {
          this.room.hostId = player.id;
        }

        this.broadcast({ type: 'player-joined', player });
        this.broadcast({ type: 'room-state', room: this.room });
        break;
      }

      case 'ready': {
        const player = this.room.players.find(p => p.id === sender.id);
        if (player) {
          player.isReady = !player.isReady;
          this.broadcast({ type: 'player-ready', playerId: sender.id });
          this.broadcast({ type: 'room-state', room: this.room });
        }
        break;
      }

      case 'start-game': {
        // Only host can start
        if (sender.id !== this.room.hostId) {
          this.send(sender, { type: 'error', message: 'Only host can start' });
          return;
        }

        // Need at least 1 player (for testing) or 2 for real games
        if (this.room.players.length < 1) {
          this.send(sender, { type: 'error', message: 'Need more players' });
          return;
        }

        this.startCountdown();
        break;
      }

      case 'submit-score': {
        const player = this.room.players.find(p => p.id === sender.id);
        if (player && !player.hasSubmitted) {
          player.score += data.score;
          player.chainLength = data.chainLength;
          player.hasSubmitted = true;

          this.broadcast({
            type: 'player-submitted',
            playerId: sender.id,
            score: data.score,
            chainLength: data.chainLength
          });
          this.broadcast({ type: 'room-state', room: this.room });

          // Check if all players have submitted
          if (this.room.players.every(p => p.hasSubmitted)) {
            this.endRound();
          }
        }
        break;
      }

      case 'next-round': {
        if (sender.id === this.room.hostId) {
          if (this.room.roundNumber >= this.room.totalRounds) {
            this.endGame();
          } else {
            this.startCountdown();
          }
        }
        break;
      }

      case 'leave': {
        this.room.players = this.room.players.filter(p => p.id !== sender.id);
        this.broadcast({ type: 'player-left', playerId: sender.id });
        this.broadcast({ type: 'room-state', room: this.room });
        break;
      }
    }
  }

  startCountdown() {
    this.room.phase = 'countdown';
    this.room.roundNumber++;

    // Reset used scenarios at start of new game
    if (this.room.roundNumber === 1) {
      this.usedScenarios = [];
    }

    // Get a scenario that hasn't been used this game
    this.room.currentScenario = this.getNextScenario();

    // Reset player submission state
    this.room.players.forEach(p => {
      p.hasSubmitted = false;
      p.chainLength = 0;
    });

    let countdown = COUNTDOWN_SECONDS;
    this.broadcast({ type: 'game-starting', countdown });
    this.broadcast({ type: 'room-state', room: this.room });

    this.countdownTimer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        if (this.countdownTimer) clearInterval(this.countdownTimer);
        this.startRound();
      } else {
        this.broadcast({ type: 'game-starting', countdown });
      }
    }, 1000);
  }

  startRound() {
    this.room.phase = 'playing';
    this.room.startTime = Date.now();

    this.broadcast({
      type: 'round-start',
      scenario: this.room.currentScenario,
      timeLimit: TIME_LIMIT
    });
    this.broadcast({ type: 'room-state', room: this.room });

    // Auto-end round after time limit
    this.gameTimer = setTimeout(() => {
      this.endRound();
    }, TIME_LIMIT * 1000);
  }

  endRound() {
    if (this.gameTimer) clearTimeout(this.gameTimer);

    this.room.phase = 'results';
    const leaderboard = [...this.room.players].sort((a, b) => b.score - a.score);

    if (this.room.roundNumber >= this.room.totalRounds) {
      this.broadcast({ type: 'game-over', leaderboard });
    } else {
      this.broadcast({ type: 'round-end', leaderboard });
    }
    this.broadcast({ type: 'room-state', room: this.room });
  }

  endGame() {
    this.room.phase = 'results';
    const leaderboard = [...this.room.players].sort((a, b) => b.score - a.score);
    this.broadcast({ type: 'game-over', leaderboard });
    this.broadcast({ type: 'room-state', room: this.room });
  }
}

