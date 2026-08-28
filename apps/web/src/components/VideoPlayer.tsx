import React from "react";

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

export function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black pt-[56.25%] shadow-glow ring-1 ring-white/10">
      <iframe
        className="absolute left-0 top-0 h-full w-full border-0"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
