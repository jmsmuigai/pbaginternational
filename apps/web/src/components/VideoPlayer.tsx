import React from "react";

interface VideoPlayerProps {
  videoId?: string;
  /** A YouTube uploads-playlist id ("UU...", i.e. a channel id with UC→UU)
   * — pass this instead of videoId to embed a channel's real, live latest
   * uploads rather than one fixed video. */
  playlistId?: string;
  title: string;
}

export function VideoPlayer({ videoId, playlistId, title }: VideoPlayerProps) {
  const src = playlistId
    ? `https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`
    : `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black pt-[56.25%] shadow-glow ring-1 ring-white/10">
      <iframe
        className="absolute left-0 top-0 h-full w-full border-0"
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
