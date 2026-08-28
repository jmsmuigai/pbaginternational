"use client";

import { useState, useRef, useEffect } from "react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (audioRef.current && !isPlaying) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="glass flex items-center gap-3 rounded-full p-2 shadow-glow transition hover:shadow-glow-gold">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-gold transition hover:bg-gold hover:text-ink"
          aria-label={isPlaying ? "Pause background music" : "Play background music"}
        >
          {isPlaying ? (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <span className="pr-4 text-xs font-semibold tracking-wide text-cream">
          {isPlaying ? "African Vibes Playing" : "Play Music"}
        </span>
        <audio
          ref={audioRef}
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
          loop
          className="hidden"
        />
      </div>
    </div>
  );
}
