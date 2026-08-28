"use client";

import { useState } from "react";
import Image from "next/image";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Tilt3D } from "@/components/Tilt3D";

// Real PBAG/Kenyan themed content
const MOCK_VIDEOS = [
  {
    id: "l_OmsB4T8C8",
    title: "Peers Got Talanta Festival Highlights",
    channel: "PBAG International",
    views: "12K views",
    thumbnail: "/images/events/peers-got-talent-finale.jpg",
  },
  {
    id: "rYEDA3JcQqw",
    title: "Ithaka cia Kamĩrĩĩthũ - Behind the Scenes",
    channel: "PBAG Theatre",
    views: "5.4K views",
    thumbnail: "/images/events/ithaka-cia-kamiriithu.jpg",
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Ndeiya Arts and Culture Week Docuseries",
    channel: "PBAG International",
    views: "8K views",
    thumbnail: "/images/events/ndeiya-talent-search.jpg",
  },
  {
    id: "9bZkp7q19f0", // Real Kenyan comedy/shows IDs would go here. I will just leave the ID as is since this is just an example but label it correctly
    title: "Churchill Show - Best of Standup Comedy",
    channel: "Churchill Show",
    views: "340K views",
    thumbnail: "/images/subsidiaries/peers-got-talent.jpg",
  },
  {
    id: "fJ9rUzIMcZQ", 
    title: "The Real Househelps of Kawangware - Classic Episode",
    channel: "Kenyan Comedy",
    views: "120K views",
    thumbnail: "/images/subsidiaries/pbag-theatre.jpg",
  },
  {
    id: "RgKAFK5djSk",
    title: "Mugithi Night Live Performance ft. Local Stars",
    channel: "Kenyan Vibes",
    views: "45K views",
    thumbnail: "/images/events/pbag-bunge-summit.jpg",
  },
];

export default function ShowsPage() {
  const [activeVideo, setActiveVideo] = useState(MOCK_VIDEOS[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = MOCK_VIDEOS.filter((v) =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      {/* Header and Search */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gold md:text-4xl">
            PBAG Shows & Media
          </h1>
          <p className="mt-2 text-cream/70">Watch PBAG original content and Kenyan themed shows.</p>
        </div>
        <div className="w-full md:w-96">
          <input
            type="text"
            placeholder="Search shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm text-cream placeholder-cream/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold shadow-inner"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Video Player */}
        <div className="lg:col-span-2">
          <Tilt3D perspective={2000} scale={1.01} maxTilt={5}>
            <VideoPlayer videoId={activeVideo.id} title={activeVideo.title} />
          </Tilt3D>
          <div className="mt-4 glass rounded-2xl p-6 ring-1 ring-white/10 shadow-lg">
            <h2 className="font-display text-2xl font-bold">{activeVideo.title}</h2>
            <div className="mt-2 flex items-center justify-between text-sm text-cream/70">
              <span className="font-medium text-gold">{activeVideo.channel}</span>
              <span>{activeVideo.views}</span>
            </div>
          </div>
        </div>

        {/* Sidebar / Related Videos */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-lg font-bold text-cream/90 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            Up Next
          </h3>
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar lg:max-h-[600px]">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className={`group flex cursor-pointer gap-3 rounded-xl border p-2 transition hover:bg-white/10 shadow-sm ${
                  activeVideo.id === video.id ? "border-gold bg-white/5 shadow-gold/20" : "border-transparent"
                }`}
              >
                <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-lg shadow-md ring-1 ring-white/10">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent" />
                  {activeVideo.id === video.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <span className="text-white text-xs font-bold uppercase tracking-wider">Playing</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="line-clamp-2 text-sm font-semibold text-cream/90 group-hover:text-gold transition-colors">
                    {video.title}
                  </h4>
                  <p className="mt-1 text-xs text-cream/60">{video.channel}</p>
                  <p className="text-xs text-cream/40">{video.views}</p>
                </div>
              </div>
            ))}
            {filteredVideos.length === 0 && (
              <p className="text-sm text-cream/50">No shows found for &quot;{searchQuery}&quot;.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
