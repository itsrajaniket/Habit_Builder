/**
 * Tiny Web Audio API sound hook — no external deps, no files.
 * Generates all sounds programmatically so it works offline too.
 */
import { useCallback, useRef } from 'react';

function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!window._habitAudioCtx) {
    try { window._habitAudioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; }
  }
  return window._habitAudioCtx;
}

function playTone(ctx, freq, type, gain, duration, delay = 0) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.05);
}

export function useSound() {
  const enabledRef = useRef(true);

  /** Short satisfying "tick" when completing a habit */
  const playCheck = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || !enabledRef.current) return;
    // Two-note rising chime
    playTone(ctx, 523, 'sine', 0.18, 0.12, 0);
    playTone(ctx, 784, 'sine', 0.14, 0.18, 0.08);
  }, []);

  /** Softer "untick" when unchecking */
  const playUncheck = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || !enabledRef.current) return;
    playTone(ctx, 392, 'sine', 0.08, 0.1, 0);
    playTone(ctx, 330, 'sine', 0.06, 0.12, 0.06);
  }, []);

  /** Level-up fanfare */
  const playLevelUp = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || !enabledRef.current) return;
    [523, 659, 784, 1047].forEach((f, i) => playTone(ctx, f, 'sine', 0.15, 0.22, i * 0.1));
  }, []);

  /** Perfect day celebration */
  const playPerfect = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || !enabledRef.current) return;
    [523, 659, 784, 659, 1047].forEach((f, i) => playTone(ctx, f, 'sine', 0.13, 0.25, i * 0.09));
  }, []);

  const setEnabled = useCallback((v) => { enabledRef.current = v; }, []);

  return { playCheck, playUncheck, playLevelUp, playPerfect, setEnabled };
}
