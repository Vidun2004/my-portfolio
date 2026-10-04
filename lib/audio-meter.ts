"use client";

// Shared bass meter: the CdPlayer feeds the <audio> element once, the
// cursor (or anything else) reads a smoothed 0..1 bass level per frame.
// Single AudioContext, created lazily and resumed on user gestures.

let ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let data: Uint8Array<ArrayBuffer> | null = null;
const wired = new WeakSet<HTMLMediaElement>();
const blocked = new Set<string>();
let smoothed = 0;

function wire(el: HTMLMediaElement) {
  if (wired.has(el)) return;
  if (!ctx) {
    const AC = window.AudioContext;
    if (!AC) return;
    ctx = new AC();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.72;
    data = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    analyser.connect(ctx.destination);
  }
  if (!analyser) return;
  const src = ctx.createMediaElementSource(el);
  src.connect(analyser);
  wired.add(el);
}

export function attachAudio(el: HTMLMediaElement) {
  try {
    const url = el.currentSrc || el.src;
    if (!url || wired.has(el) || blocked.has(url)) return;
    // Probe CORS the way the element fetches (Range). If the bucket
    // omits ACAO the fetch rejects and we NEVER hijack the element —
    // hijacking without CORS would silence playback entirely.
    fetch(url, { headers: { Range: "bytes=0-0" } }).then(
      (res) => {
        if (res.ok || res.status === 206) {
          try {
            wire(el);
          } catch {
            blocked.add(url);
          }
        } else {
          blocked.add(url);
        }
      },
      () => blocked.add(url),
    );
  } catch {
    /* analysis unavailable — playback untouched */
  }
}

export function resumeAudio() {
  try {
    if (ctx && ctx.state === "suspended") void ctx.resume();
  } catch {
    /* ignore */
  }
}

/** Bass level 0..1 with punchy attack, lazy release. 0 when idle. */
export function bassLevel(): number {
  try {
    if (!ctx || !analyser || !data || ctx.state !== "running") {
      smoothed = Math.max(0, smoothed - 0.08);
      return smoothed;
    }
    analyser.getByteFrequencyData(data);
    let sum = 0;
    const n = Math.min(6, data.length - 1);
    for (let i = 1; i <= n; i++) sum += data[i];
    const target = Math.pow(sum / n / 255, 1.35);
    smoothed += (target - smoothed) * (target > smoothed ? 0.55 : 0.12);
    return Math.min(1, Math.max(0, smoothed));
  } catch {
    return 0;
  }
}
