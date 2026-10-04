"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "@/lib/content";
import { attachAudio, resumeAudio } from "@/lib/audio-meter";
import { cn } from "@/lib/utils";

function fmt(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Resident CD player — lives in the root layout so music survives page
 * changes. Spinning disc (spin = playing), click for the playlist modal.
 * Self-hosted tracks get the full custom transport; a Spotify playlist
 * URL (admin settings) embeds the licensed player below. Starts paused;
 * mute + volume persist in localStorage.
 */
export function CdPlayer({
  tracks,
  spotifyUrl,
}: {
  tracks: Track[];
  spotifyUrl?: string;
}) {
  const reduce = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  // Playback intent + position live OUTSIDE the <audio> element so a
  // rebuild (cross-page layout swap) auto-resumes instead of dying.
  const wantPlaying = useRef(false);
  const savedTime = useRef(0);
  const [open, setOpen] = useState(false);
  const [tapSeen, setTapSeen] = useState(true);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        if (window.localStorage.getItem("vidun-muted") === "1") setMuted(true);
        if (!window.localStorage.getItem("vidun-tap-seen")) setTapSeen(false);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  function retireTapStamp() {
    setTapSeen(true);
    try {
      window.localStorage.setItem("vidun-tap-seen", "1");
    } catch {
      /* ignore */
    }
  }

  function onDiscClick() {
    retireTapStamp();
    if (tracks.length > 0 && !playing) playAt(index);
    setOpen(true);
  }

  const track = tracks[index];

  const setAudioEl = useCallback((el: HTMLAudioElement | null) => {
    if (el) {
      audioRef.current = el;
      attachAudio(el);
      if (savedTime.current > 0) {
        try {
          el.currentTime = savedTime.current;
        } catch {
          /* metadata not ready yet */
        }
      }
      if (wantPlaying.current && el.paused) {
        el.play().then(() => setPlaying(true)).catch(() => {});
      }
      return;
    }
    const prev = audioRef.current;
    if (prev) {
      try {
        savedTime.current = prev.currentTime;
      } catch {
        /* ignore */
      }
    }
    audioRef.current = null;
  }, []);

  const playAt = useCallback(
    (i: number, autoplay = true) => {
      const next = (i + tracks.length) % tracks.length;
      setIndex(next);
      setTime(0);
      savedTime.current = 0;
      if (autoplay) {
        wantPlaying.current = true;
        // Let the src swap commit first.
        window.setTimeout(() => {
          resumeAudio();
          audioRef.current?.play().then(() => {
            retireTapStamp();
            setPlaying(true);
          }).catch(() => {
            wantPlaying.current = false;
            setPlaying(false);
          });
        }, 30);
        setPlaying(true);
      }
    },
    [tracks.length],
  );

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      wantPlaying.current = false;
      el.pause();
      setPlaying(false);
    } else {
      wantPlaying.current = true;
      resumeAudio();
      el.play().then(() => {
        retireTapStamp();
        setPlaying(true);
      }).catch(() => {
        wantPlaying.current = false;
        setPlaying(false);
      });
      setPlaying(true);
    }
  }

  function toggleMute() {
    setMuted((m) => {
      try {
        window.localStorage.setItem("vidun-muted", m ? "0" : "1");
      } catch {
        /* ignore */
      }
      return !m;
    });
  }

  // First-interaction autostart: browsers require a real user gesture
  // before any sound, so the first pointer/key interaction kicks off
  // playback (once). Respects mute. Spotify embeds always need their
  // own click and are unaffected.
  useEffect(() => {
    if (!tracks.length) return;
    function kick() {
      const el = audioRef.current;
      if (!el || !el.paused || el.muted) return;
      resumeAudio();
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
      cleanup();
    }
    function cleanup() {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
      window.removeEventListener("touchend", kick);
    }
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
    window.addEventListener("touchend", kick);
    return cleanup;
  }, [tracks.length]);

  // Lock scroll while the playlist modal is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const embedSrc = (() => {
    if (!spotifyUrl) return null;
    // open.spotify.com/playlist/ID (or album/track) → embed form.
    const m = spotifyUrl.match(
      /open\.spotify\.com\/(playlist|album|track)\/([A-Za-z0-9]+)/,
    );
    if (!m) return null;
    return `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0`;
  })();

  if (!tracks.length && !embedSrc) return null;

  return (
    <>
      {tracks.length > 0 && (
        <audio
          ref={setAudioEl}
          crossOrigin="anonymous"
          src={track?.audio_url}
          muted={muted}
          preload="metadata"
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
          onEnded={() => playAt(index + 1)}
          onPause={() => setPlaying(false)}
        />
      )}

      {/* floating disc */}
      <div className="fixed right-4 bottom-4 z-[120] flex flex-col items-center gap-2 md:right-6 md:bottom-6">
        <button
          type="button"
          onClick={onDiscClick}
          aria-label="Open playlist"
          title={track ? `${track.title} — open playlist` : "Open playlist"}
          className="group relative block outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          {!tapSeen && !playing && (
            <motion.span
              aria-hidden
              animate={reduce ? undefined : { scale: [1, 1.18, 1], rotate: [-6, 6, -6] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="border-ink bg-brand-pink shadow-brutal absolute -top-3 -left-4 z-10 rounded-md border-2 px-1.5 py-0.5 font-mono text-[10px] font-bold"
            >
              TAP
            </motion.span>
          )}
          <span
            aria-hidden
            className={cn(
              "border-ink bg-ink block size-16 rounded-full border-2 bg-[repeating-radial-gradient(circle_at_center,#2b2b2b_0px,#2b2b2b_1px,#101010_2px,#101010_4px)] transition-transform group-hover:scale-105 md:size-20",
              playing && !reduce && "animate-[spin_5s_linear_infinite]",
            )}
          />
          <span
            aria-hidden
            className="border-ink bg-brand-yellow absolute top-1/2 left-1/2 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 md:size-7"
          >
            <span className="bg-ink size-1.5 rounded-full" />
          </span>
          <span
            aria-hidden
            className={cn(
              "border-ink absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full border-2",
              playing ? "bg-success" : "bg-white",
            )}
          >
            {playing ? (
              <span className="flex items-end gap-[2px]">
                {[0, 1, 2].map((b) => (
                  <motion.span
                    key={b}
                    animate={reduce ? undefined : { height: [4, 10, 4] }}
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      delay: b * 0.18,
                    }}
                    className="bg-ink w-[3px] rounded-sm"
                  />
                ))}
              </span>
            ) : (
              <Play size={12} strokeWidth={3} className="ml-px" />
            )}
          </span>
        </button>
      </div>

      {/* playlist modal */}
      <AnimatePresence>
        {open && (
          <div
            key="playlist"
            className="fixed inset-0 z-[130] flex items-center justify-center p-6"
          >
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="bg-ink/70 absolute inset-0"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Featured playlist"
              initial={
                reduce ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.97 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }
              }
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="border-ink bg-cream shadow-brutal-lg rounded-brutal-lg relative max-h-[88vh] w-full max-w-md overflow-y-auto border-2 p-5 md:p-6"
              data-lenis-prevent
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] font-bold tracking-widest text-black/50">
                    NOW SPINNING ✦ MY TASTE
                  </p>
                  <p className="mt-1 truncate text-xl font-bold">
                    {track ? (
                      <>
                        {track.title}
                        {track.artist && (
                          <span className="font-mono text-sm font-normal text-black/60">
                            {" "}
                            — {track.artist}
                          </span>
                        )}
                      </>
                    ) : (
                      "MY ROTATION"
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close playlist"
                  className="border-ink shrink-0 rounded-lg border-2 bg-white p-1.5 transition-transform hover:-translate-y-0.5"
                >
                  <X size={18} />
                </button>
              </div>

              {tracks.length > 0 && (
                <>
                  {/* progress */}
                  <button
                    type="button"
                    aria-label="Seek"
                    onClick={(e) => {
                      const el = audioRef.current;
                      const bar = e.currentTarget.getBoundingClientRect();
                      const ratio = Math.min(
                        1,
                        Math.max(0, (e.clientX - bar.left) / bar.width),
                      );
                      if (el && Number.isFinite(el.duration)) {
                        el.currentTime = ratio * el.duration;
                        setTime(el.currentTime);
                      }
                    }}
                    className="border-ink mt-4 block h-3.5 w-full overflow-hidden rounded-full border-2 bg-white"
                  >
                    <span
                      className="bg-brand-yellow block h-full"
                      style={{
                        width: `${dur ? Math.min(100, (time / dur) * 100) : 0}%`,
                      }}
                    />
                  </button>
                  <div className="mt-1 flex justify-between font-mono text-[11px] font-bold text-black/50">
                    <span>{fmt(time)}</span>
                    <span>{fmt(dur)}</span>
                  </div>

                  {/* transport */}
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <button
                      onClick={() => playAt(index - 1)}
                      aria-label="Previous track"
                      className="border-ink rounded-full border-2 bg-white p-2.5 transition-transform hover:-translate-y-0.5"
                    >
                      <SkipBack size={18} />
                    </button>
                    <button
                      onClick={toggle}
                      aria-label={playing ? "Pause" : "Play"}
                      className="border-ink bg-brand-yellow shadow-brutal rounded-full border-2 p-3.5 transition-transform hover:-translate-y-0.5"
                    >
                      {playing ? (
                        <Pause size={22} />
                      ) : (
                        <Play size={22} className="ml-0.5" />
                      )}
                    </button>
                    <button
                      onClick={() => playAt(index + 1)}
                      aria-label="Next track"
                      className="border-ink rounded-full border-2 bg-white p-2.5 transition-transform hover:-translate-y-0.5"
                    >
                      <SkipForward size={18} />
                    </button>
                    <button
                      onClick={toggleMute}
                      aria-label={muted ? "Unmute" : "Mute"}
                      className="border-ink rounded-full border-2 bg-white p-2.5 transition-transform hover:-translate-y-0.5"
                    >
                      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                  </div>

                  {/* playlist */}
                  <ul
                    className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1"
                    data-lenis-prevent
                  >
                    {tracks.map((t, i) => (
                      <li key={`${t.audio_url}-${i}`}>
                        <button
                          onClick={() => playAt(i)}
                          className={cn(
                            "border-ink flex w-full items-center gap-2.5 rounded-lg border-2 px-3 py-2 text-left transition-all",
                            i === index
                              ? "bg-ink text-cream shadow-brutal"
                              : "hover:shadow-brutal bg-white hover:-translate-y-0.5",
                          )}
                        >
                          <span className="font-mono text-[11px] font-bold opacity-50">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold">
                              {t.title}
                            </span>
                            {t.artist && (
                              <span className="block truncate font-mono text-[11px] opacity-60">
                                {t.artist}
                              </span>
                            )}
                          </span>
                          {i === index && playing && (
                            <span
                              className="flex items-end gap-[2px]"
                              aria-hidden
                            >
                              {[0, 1, 2].map((b) => (
                                <motion.span
                                  key={b}
                                  animate={
                                    reduce ? undefined : { height: [4, 12, 4] }
                                  }
                                  transition={{
                                    duration: 0.7,
                                    repeat: Infinity,
                                    delay: b * 0.18,
                                  }}
                                  className="bg-brand-yellow w-[3px] rounded-sm"
                                />
                              ))}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* licensed Spotify rotation */}
              {embedSrc && (
                <div className="mt-4">
                  <p className="mb-2 font-mono text-[11px] font-bold tracking-widest text-black/50">
                    ON SPOTIFY ✦ LICENSED STREAM
                  </p>
                  <div className="border-ink overflow-hidden rounded-xl border-2">
                    <iframe
                      title="Spotify playlist"
                      src={embedSrc}
                      width="100%"
                      height="352"
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      className="block"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
