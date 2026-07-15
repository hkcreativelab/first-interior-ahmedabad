import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { VideoSection } from "@/components/VideoSection";

export const Route = createFileRoute("/reels")({
  head: () => ({
    meta: [
      { title: "Videos — First Interiors Ahmedabad" },
      {
        name: "description",
        content:
          "Watch videos from First Interiors showing home transformations, room details and material selections.",
      },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  return (
    <div className="min-h-screen bg-background text-ink">
      <Nav />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-28 sm:pb-32">
        <section className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-ink/60">— Videos</p>
            <h1 className="font-display text-6xl font-semibold leading-tight sm:text-6xl">
              See how our finished rooms feel in motion.
            </h1>
          </div>
          <p className="text-lg leading-relaxed text-ink/70">
            Our videos show the tone, textures and daily life of real projects. Use the owner portal
            to add or update media directly.
          </p>
        </section>
        <VideoSection maxItems={100} showCta={false} />
      </main>
      <Footer />
    </div>
  );
}
