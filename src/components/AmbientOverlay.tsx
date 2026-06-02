import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

export type AmbientVariant = "living" | "kitchen" | "dining" | "bathroom" | "bedroom";

/**
 * Scroll-driven cinematic overlay rendered above the room hero image.
 * Each variant tells a little story as the user scrolls:
 *  - living  → curtains part, warm sunlight floods in, dust drifts
 *  - kitchen → warm glow rises, steam plumes, food chips slide up from bottom
 *  - bedroom → two curtain panels slide outward, bedside lamp glows
 *  - dining  → pendant glow, plates / candles fade in across the table line
 *  - bathroom→ light shifts cool→warm, soft fog drifts, water shimmer
 */
export function AmbientOverlay({ variant }: { variant: AmbientVariant }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
    >
      {variant === "living" && <LivingScene p={scrollYProgress} />}
      {variant === "kitchen" && <KitchenScene p={scrollYProgress} />}
      {variant === "bedroom" && <BedroomScene p={scrollYProgress} />}
      {variant === "dining" && <DiningScene p={scrollYProgress} />}
      {variant === "bathroom" && <BathroomScene p={scrollYProgress} />}
    </div>
  );
}

type P = { p: MotionValue<number> };

/* ---------------- Living ---------------- */
function LivingScene({ p }: P) {
  const left = useTransform(p, [0, 0.6], ["0%", "-55%"]);
  const right = useTransform(p, [0, 0.6], ["0%", "55%"]);
  const wash = useTransform(p, [0, 0.5, 1], [0.1, 0.55, 0.25]);
  return (
    <>
      <motion.div
        style={{ opacity: wash }}
        className="absolute inset-0 bg-gradient-to-t from-forest/30 via-cream/10 to-transparent mix-blend-soft-light"
      />
      {/* Curtain panels that part on scroll */}
      <motion.div
        style={{ x: left }}
        className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-ink/70 via-ink/40 to-transparent backdrop-blur-[2px]"
      />
      <motion.div
        style={{ x: right }}
        className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-ink/70 via-ink/40 to-transparent backdrop-blur-[2px]"
      />
      {/* Sun beam through the parting */}
      <motion.div
        style={{ opacity: wash }}
        className="absolute left-1/2 top-0 h-full w-[28%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,210,140,0.55),transparent_70%)]"
      />
      {/* Drifting dust */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute block h-1 w-1 rounded-full bg-cream/80 blur-[1px] animate-drift"
          style={{
            left: `${(i * 19) % 100}%`,
            bottom: `${(i * 13) % 70}%`,
            animationDelay: `${(i % 7) * 1.1}s`,
            animationDuration: `${10 + (i % 5)}s`,
          }}
        />
      ))}
    </>
  );
}

/* ---------------- Kitchen ---------------- */
function KitchenScene({ p }: P) {
  const wash = useTransform(p, [0, 0.5, 1], [0, 0.6, 0.3]);
  const chipY = useTransform(p, [0.05, 0.55], ["120%", "0%"]);
  const chipOpacity = useTransform(p, [0.05, 0.35], [0, 1]);
  const chips = ["Espresso", "Sourdough", "Citrus", "Saffron", "Herbs"];
  return (
    <>
      <motion.div
        style={{ opacity: wash }}
        className="absolute inset-0 bg-gradient-to-t from-forest/35 via-cream/10 to-transparent mix-blend-soft-light"
      />
      {/* Steam */}
      {[0, 0.8, 1.6, 2.2].map((d, i) => (
        <span
          key={i}
          className="absolute bottom-[20%] left-1/3 block h-14 w-14 rounded-full bg-cream/30 blur-2xl animate-steam"
          style={{ left: `${20 + i * 15}%`, animationDelay: `${d}s` }}
        />
      ))}
      {/* Food chips rising from bottom on scroll */}
      <motion.div
        style={{ y: chipY, opacity: chipOpacity }}
        className="absolute bottom-8 left-0 right-0 flex flex-wrap items-center justify-center gap-3 px-6"
      >
        {chips.map((c, i) => (
          <span
            key={c}
            className="rounded-full border border-forest/40 bg-ink/15 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-cream/90 backdrop-blur-md"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            {c}
          </span>
        ))}
      </motion.div>
    </>
  );
}

/* ---------------- Bedroom ---------------- */
function BedroomScene({ p }: P) {
  const left = useTransform(p, [0, 0.55], ["0%", "-70%"]);
  const right = useTransform(p, [0, 0.55], ["0%", "70%"]);
  const lamp = useTransform(p, [0.1, 0.5], [0, 1]);
  const sun = useTransform(p, [0.2, 0.7], [0, 0.6]);
  return (
    <>
      {/* Curtains open on scroll */}
      <motion.div
        style={{ x: left }}
        className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-ink/85 via-ink/60 to-transparent backdrop-blur-[3px]"
      />
      <motion.div
        style={{ x: right }}
        className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-ink/85 via-ink/60 to-transparent backdrop-blur-[3px]"
      />
      {/* Soft morning rays */}
      <motion.div
        style={{ opacity: sun }}
        className="absolute -right-32 -top-32 h-[140%] w-[60%] bg-[linear-gradient(110deg,transparent_40%,rgba(200,177,149,0.5)_50%,transparent_60%)] blur-2xl"
      />
      {/* Bedside lamp glow */}
      <motion.div
        style={{ opacity: lamp }}
        className="absolute bottom-[22%] left-[14%] h-40 w-40 rounded-full bg-forest/35 blur-3xl"
      />
      {/* Dust */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="absolute block h-1 w-1 rounded-full bg-cream/90 blur-[1px] animate-drift"
          style={{
            left: `${(i * 23) % 100}%`,
            bottom: `${(i * 11) % 60}%`,
            animationDelay: `${(i % 6) * 1.2}s`,
            animationDuration: `${10 + (i % 4)}s`,
          }}
        />
      ))}
    </>
  );
}

/* ---------------- Dining ---------------- */
function DiningScene({ p }: P) {
  const chandelier = useTransform(p, [0, 0.4], [0.2, 1]);
  const plateOpacity = useTransform(p, [0.1, 0.5], [0, 1]);
  const plateY = useTransform(p, [0.1, 0.5], [40, 0]);
  return (
    <>
      <motion.div
        style={{ opacity: chandelier }}
        className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-forest/30 blur-3xl"
      />
      {/* Plates / decor placed along table line */}
      <motion.div
        style={{ opacity: plateOpacity, y: plateY }}
        className="absolute bottom-[18%] left-0 right-0 flex items-end justify-center gap-8 px-12"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="block h-10 w-10 rounded-full border border-forest/40 bg-cream/30 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm"
            style={{ transform: `scale(${1 - Math.abs(i - 2) * 0.1})` }}
          />
        ))}
      </motion.div>
      {/* Candle flickers */}
      <div className="absolute bottom-[26%] left-[46%] h-4 w-2 rounded-full bg-cream/80 blur-[2px] animate-flame" />
      <div
        className="absolute bottom-[26%] left-[52%] h-4 w-2 rounded-full bg-cream/80 blur-[2px] animate-flame"
        style={{ animationDelay: "0.4s" }}
      />
      {/* Floating sparkles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute block h-1.5 w-1.5 rounded-full bg-cream/80 blur-[1px] animate-drift"
          style={{
            left: `${(i * 37) % 100}%`,
            bottom: `${20 + (i % 5) * 8}%`,
            animationDelay: `${(i % 6) * 1.2}s`,
            animationDuration: `${9 + (i % 4)}s`,
          }}
        />
      ))}
    </>
  );
}

/* ---------------- Bathroom ---------------- */
function BathroomScene({ p }: P) {
  // Lighting shifts cool → warm as you scroll
  const cool = useTransform(p, [0, 0.5], [0.55, 0]);
  const warm = useTransform(p, [0.3, 1], [0, 0.55]);
  const fog = useTransform(p, [0, 0.5, 1], [0.1, 0.55, 0.3]);
  return (
    <>
      <motion.div
        style={{ opacity: cool }}
        className="absolute inset-0 bg-gradient-to-t from-cream/35 via-cream/15 to-transparent mix-blend-soft-light"
      />
      <motion.div
        style={{ opacity: warm }}
        className="absolute inset-0 bg-gradient-to-t from-forest/35 via-cream/15 to-transparent mix-blend-soft-light"
      />
      <motion.div
        style={{ opacity: fog }}
        className="absolute inset-0 bg-gradient-to-t from-cream/0 via-cream/15 to-cream/30"
      />
      {[0, 1.5, 3].map((d, i) => (
        <span
          key={i}
          className="absolute left-1/3 bottom-[15%] block h-20 w-20 rounded-full bg-cream/30 blur-2xl animate-steam"
          style={{ left: `${25 + i * 20}%`, animationDelay: `${d}s`, animationDuration: "6s" }}
        />
      ))}
      <div className="absolute bottom-[20%] right-[22%]">
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="absolute left-1/2 top-1/2 block h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/40 animate-ripple"
            style={{ animationDelay: `${d}s` }}
          />
        ))}
      </div>
    </>
  );
}
