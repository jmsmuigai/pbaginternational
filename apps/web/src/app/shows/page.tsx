"use client";

import { useState } from "react";
import Image from "next/image";
import { CONTACT } from "@pbag/shared";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Tilt3D } from "@/components/Tilt3D";

/**
 * Real, verifiable video content only.
 *
 * PBAG's own channel is embedded as a live uploads-playlist (see
 * CONTACT.youtubeUploadsPlaylist below) rather than hard-coded video ids —
 * the channel ("PBAG — Peers Best Art Group") was verified directly against
 * its own YouTube "about" description, which references PBAG RAW, PBAG
 * THEATRE, PBAG GENERATION and PGT FESTIVAL, matching the brief exactly.
 *
 * The shortlist below celebrates the wider Kenyan comedy scene PBAG is part
 * of. Every id/title/channel here was checked against the real public
 * video — nothing is a stand-in ID wearing a made-up title.
 */
const KENYAN_COMEDY_VIDEOS = [
  {
    id: "woSyco8DLm8",
    title: "Churchill Show – All Star Edition | Best Kenyan Comedians",
    channel: "Churchill Show",
    thumbnail: "/images/subsidiaries/peers-got-talent.jpg",
  },
  {
    id: "lp1SEc7pWCQ",
    title: "Try Not To Laugh — Eric Omondi Comedy Compilation",
    channel: "Eric Omondi",
    thumbnail: "/images/subsidiaries/pbag-theatre.jpg",
  },
  {
    id: "nml3nN1fbjM",
    title: "The Calls That Changed My Life Financially || Njugush",
    channel: "Njugush",
    thumbnail: "/images/events/pbag-bunge-summit.jpg",
  },
  {
    id: "4KpaPg0kox8",
    title: "Njugush on Speaking Against Ruto's Regime & 10 Years in Comedy",
    channel: "Njugush",
    thumbnail: "/images/events/ithaka-cia-kamiriithu.jpg",
  },
];

type Tab = "pbag" | "kenyan-comedy";

export default function ShowsPage() {
  const [tab, setTab] = useState<Tab>("pbag");
  const [activeVideo, setActiveVideo] = useState(KENYAN_COMEDY_VIDEOS[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = KENYAN_COMEDY_VIDEOS.filter((v) =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-gold md:text-4xl">PBAG Shows &amp; Media</h1>
          <p className="mt-2 text-cream/70">
            Watch PBAG&apos;s real YouTube content, and the wider Kenyan comedy scene we celebrate.
          </p>
        </div>
        <div className="flex rounded-full border border-white/15 bg-white/5 p-1">
          <button
            onClick={() => setTab("pbag")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === "pbag" ? "bg-gold text-ink" : "text-cream/70 hover:text-cream"
            }`}
          >
            PBAG Channel
          </button>
          <button
            onClick={() => setTab("kenyan-comedy")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === "kenyan-comedy" ? "bg-gold text-ink" : "text-cream/70 hover:text-cream"
            }`}
          >
            Kenyan Comedy Scene
          </button>
        </div>
      </div>

      {tab === "pbag" ? (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tilt3D perspective={2000} scale={1.01} maxTilt={5}>
              <VideoPlayer playlistId={CONTACT.youtubeUploadsPlaylist} title="PBAG (Peers Best Art Group) — Latest Uploads" />
            </Tilt3D>
            <div className="mt-4 glass rounded-2xl p-6 ring-1 ring-white/10 shadow-lg">
              <h2 className="font-display text-2xl font-bold">PBAG&apos;s Real YouTube Channel</h2>
              <p className="mt-2 text-sm text-cream/70">
                This is a live embed of PBAG&apos;s actual YouTube uploads — PBAG RAW, PBAG Theatre, PBAG
                Generation and PGT Festival content, straight from the source, not a fixed video ID.
              </p>
              <a
                href={CONTACT.social.youtube}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full bg-brand-gradient px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5"
              >
                Visit &amp; Subscribe on YouTube →
              </a>
            </div>
          </div>
          <aside className="rounded-3xl border border-white/10 p-6">
            <h3 className="font-display text-lg font-bold text-cream/90">About this feed</h3>
            <p className="mt-3 text-sm text-cream/60">
              We embed PBAG&apos;s official uploads playlist rather than hand-picked video IDs, so this
              tab always shows PBAG&apos;s real, current content — no placeholders, no mislabelled clips.
            </p>
          </aside>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tilt3D perspective={2000} scale={1.01} maxTilt={5}>
              <VideoPlayer videoId={activeVideo.id} title={activeVideo.title} />
            </Tilt3D>
            <div className="mt-4 glass rounded-2xl p-6 ring-1 ring-white/10 shadow-lg">
              <h2 className="font-display text-2xl font-bold">{activeVideo.title}</h2>
              <div className="mt-2 flex items-center justify-between text-sm text-cream/70">
                <span className="font-medium text-gold">{activeVideo.channel}</span>
                <span className="text-xs text-cream/40">Real, publicly available YouTube video</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Search shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm text-cream placeholder-cream/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold shadow-inner"
            />
            <h3 className="font-display text-lg font-bold text-cream/90">Up Next</h3>
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar lg:max-h-[520px]">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className={`group flex cursor-pointer gap-3 rounded-xl border p-2 transition hover:bg-white/10 shadow-sm ${
                    activeVideo.id === video.id ? "border-gold bg-white/5" : "border-transparent"
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
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="line-clamp-2 text-sm font-semibold text-cream/90 group-hover:text-gold transition-colors">
                      {video.title}
                    </h4>
                    <p className="mt-1 text-xs text-cream/60">{video.channel}</p>
                  </div>
                </div>
              ))}
              {filteredVideos.length === 0 && (
                <p className="text-sm text-cream/50">No shows found for &quot;{searchQuery}&quot;.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
