import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart, MessageCircle, Play } from "lucide-react";
import { defaultReels, type Reel } from "@/lib/reels-data";

const placeholderThumbnail =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#f5f5f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-size="44" fill="#9ca3af">Poster image unavailable</text></svg>',
  );

export function ReelsSection({
  maxItems = 3,
  showCta = true,
}: {
  maxItems?: number;
  showCta?: boolean;
}) {
  const [reels, setReels] = useState<Reel[] | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadReels() {
      try {
        const response = await fetch("/api/reels");
        if (!response.ok) throw new Error("Failed to load reels");
        const nextReels = (await response.json()) as Reel[];
        if (isMounted) {
          setReels(nextReels);
        }
      } catch {
        if (isMounted) {
          setReels(defaultReels);
        }
      }
    }

    void loadReels();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleReels = reels?.slice(0, maxItems) ?? [];

  return (
    <section id="reels" className="bg-cream py-24 text-ink">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-forest/70">VIDEO PORTFOLIO</p>
          <h2 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
            Explore Our Spaces Through Reels
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/70">
            Watch short video tours of our completed designs and behind-the-scenes transformations.
          </p>
        </div>

        {reels === null ? (
          <div className="rounded-[2rem] border border-ink/10 bg-cream p-8 text-center text-ink/70">
            Loading reels...
          </div>
        ) : visibleReels.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visibleReels.map((reel, index) => (
            <motion.article
              key={reel.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group overflow-hidden rounded-[2rem] bg-ink text-cream shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)]"
            >
              <div className="relative overflow-hidden pb-[140%] sm:pb-[120%]">
                <img
                  src={reel.thumbnail || placeholderThumbnail}
                  alt={reel.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <a
                  href={reel.url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cream/90 text-ink transition hover:scale-110">
                    <Play className="h-6 w-6" />
                  </span>
                </a>
              </div>

              <div className="space-y-4 p-6 sm:p-8">
                <div>
                  <h3 className="text-3xl font-semibold tracking-tight text-cream">{reel.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-cream/90">{reel.description}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="inline-flex items-center gap-2 rounded-3xl bg-ink/80 px-4 py-3 text-base text-cream">
                    <Heart className="h-4 w-4 text-red-400" />
                    <span>{reel.views}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-3xl bg-ink/80 px-4 py-3 text-base text-cream">
                    <MessageCircle className="h-4 w-4 text-cream/70" />
                    <span>{reel.comments}</span>
                  </div>
                </div>
              </div>
            </motion.article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-ink/10 bg-cream p-8 text-center text-ink/70">
            No reels are published right now.
          </div>
        )}

        {showCta && (
          <div className="mt-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="max-w-2xl text-base text-ink/70">
              Want to explore every reel? Visit the owner portal to add new videos or see the full
              collection.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/reels"
                className="rounded-full border border-forest bg-forest px-6 py-3 text-base font-semibold text-cream transition hover:bg-ink"
              >
                View all reels
              </Link>
              <Link
                to="/owner"
                className="rounded-full border border-ink bg-transparent px-6 py-3 text-base font-semibold text-ink transition hover:bg-forest hover:text-cream"
              >
                Owner portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
