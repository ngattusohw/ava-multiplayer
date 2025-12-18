// Chill sound effects using Web Audio API
// No external files needed - generates pleasant synth tones

let audioContext: AudioContext | null = null;
let isMuted = false;

// Load mute preference from localStorage
if (typeof window !== 'undefined') {
  isMuted = localStorage.getItem('ava-architect-muted') === 'true';
}

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function setMuted(muted: boolean) {
  isMuted = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('ava-architect-muted', String(muted));
  }
}

export function getMuted(): boolean {
  return isMuted;
}

export function toggleMuted(): boolean {
  setMuted(!isMuted);
  return isMuted;
}

// Helper to create a gentle oscillator sound
function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.15,
  delay: number = 0
) {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

    // Gentle envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
  } catch (e) {
    // Audio not available, fail silently
  }
}

// Soft click for UI interactions
export function playClick() {
  playTone(800, 0.08, 'sine', 0.1);
}

// Countdown tick - soft chime
export function playCountdownTick() {
  playTone(440, 0.15, 'sine', 0.12);
}

// Countdown final "GO" - rising chord
export function playGo() {
  playTone(523, 0.3, 'sine', 0.15, 0);      // C5
  playTone(659, 0.3, 'sine', 0.12, 0.05);   // E5
  playTone(784, 0.4, 'sine', 0.1, 0.1);     // G5
}

// Add tool to chain - gentle pluck
export function playAddTool() {
  playTone(600 + Math.random() * 200, 0.12, 'triangle', 0.1);
}

// Remove tool - soft descending
export function playRemoveTool() {
  playTone(400, 0.1, 'sine', 0.08);
}

// Submit answer - satisfying confirmation
export function playSubmit() {
  playTone(523, 0.15, 'sine', 0.12, 0);     // C5
  playTone(659, 0.2, 'sine', 0.1, 0.1);     // E5
}

// Player joined - welcoming chime
export function playPlayerJoined() {
  playTone(392, 0.2, 'sine', 0.1, 0);       // G4
  playTone(523, 0.25, 'sine', 0.1, 0.1);    // C5
}

// Player ready - confirmation
export function playReady() {
  playTone(659, 0.15, 'triangle', 0.1);     // E5
}

// Round end - gentle resolution
export function playRoundEnd() {
  playTone(523, 0.3, 'sine', 0.1, 0);       // C5
  playTone(659, 0.3, 'sine', 0.08, 0.15);   // E5
  playTone(784, 0.4, 'sine', 0.08, 0.3);    // G5
  playTone(1047, 0.5, 'sine', 0.06, 0.45);  // C6
}

// Victory fanfare - triumphant but chill
export function playVictory() {
  // Major chord arpeggio
  playTone(523, 0.4, 'sine', 0.12, 0);      // C5
  playTone(659, 0.4, 'sine', 0.1, 0.12);    // E5
  playTone(784, 0.4, 'sine', 0.1, 0.24);    // G5
  playTone(1047, 0.6, 'sine', 0.08, 0.36);  // C6
  // Harmony
  playTone(392, 0.8, 'sine', 0.05, 0.1);    // G4 (bass)
}

// Timer warning - subtle pulse
export function playTimerWarning() {
  playTone(330, 0.1, 'sine', 0.08);         // E4
}

// Hint revealed
export function playHint() {
  playTone(440, 0.15, 'triangle', 0.08, 0);
  playTone(554, 0.15, 'triangle', 0.06, 0.08);
}

// Error/wrong - gentle low tone
export function playError() {
  playTone(220, 0.2, 'sine', 0.1);
}

