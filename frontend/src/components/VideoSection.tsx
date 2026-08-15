import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart, MessageCircle } from "lucide-react";
import { type Video } from "@/lib/videos-data";
import { getApiUrl, isRemoteApiAvailable } from "@/lib/api-base";
import { getStoredVideos } from "@/lib/owner-storage";

const placeholderThumbnail =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#f5f5f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-size="44" fill="#9ca3af">Poster image unavailable</text></svg>',
  );

export function VideoSection({
  maxItems = 3,
  showCta = true,
}: {
  maxItems?: number;
  showCta?: boolean;
}) {
  const [videos, setVideos] = useState<Video[] | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadVideos() {
      try {
        if (!isRemoteApiAvailable()) {
          throw new Error("Local fallback mode");
        }

        const response = await fetch(getApiUrl(`/api/videos?fresh=${Date.now()}`), {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to load videos");
        const nextVideos = await response.json();
        if (isMounted) {
          setVideos(nextVideos);
        }
      } catch {
        if (isMounted) {
          setVideos(getStoredVideos());
        }
      }
    }

    void loadVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  const uniqueVideos = videos
    ? Array.from(new Map(videos.map((video) => [video.url, video])).values())
    : [];
  const visibleVideos = uniqueVideos.slice(0, maxItems);

  return (
    <section id="videos" className="bg-cream py-24 text-ink">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-forest/70">VIDEO PORTFOLIO</p>
          <h2 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
            Explore Our Spaces Through Videos
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/70">
            Watch short video tours of our completed designs and behind-the-scenes transformations.
          </p>
        </div>

        {videos === null ? (
          <div className="rounded-[2rem] border border-ink/10 bg-cream p-8 text-center text-ink/70">
            Loading videos...
          </div>
        ) : visibleVideos.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visibleVideos.map((video, index) => (
              <motion.article
                key={video.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group overflow-hidden rounded-[2rem] bg-ink text-cream shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)]"
              >
                <div className="relative overflow-hidden pb-[140%] sm:pb-[120%]">
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    poster={video.thumbnail || placeholderThumbnail}
                    src={video.url}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                  />
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-ink/10 bg-cream p-8 text-center text-ink/70">
            No videos are published right now.
          </div>
        )}

        {showCta && (
          <div className="mt-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="max-w-2xl text-base text-ink/70">
              Want to explore every video? See the full collection here.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/reels"
                className="rounded-full border border-forest bg-forest px-6 py-3 text-base font-semibold text-cream transition hover:bg-ink"
              >
                View all videos
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
