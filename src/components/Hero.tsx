import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import heroInterior from "@/assets/hero-interior.webp";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.5 });

  // Door swing — left & right rotate outward
  const leftRotate = useTransform(p, [0, 0.55], [0, -105]);
  const rightRotate = useTransform(p, [0, 0.55], [0, 105]);
  const doorOpacity = useTransform(p, [0.5, 0.7], [1, 0]);

  // Interior zoom-in reveal
  const interiorScale = useTransform(p, [0, 0.6], [1.35, 1]);
  const interiorOpacity = useTransform(p, [0.05, 0.45], [0, 1]);

  // Headline parallax
  const titleY = useTransform(p, [0, 1], [0, -160]);
  const titleOpacity = useTransform(p, [0, 0.4, 0.85], [1, 1, 0]);

  // Floating decor items drift in after doors
  const decorY1 = useTransform(p, [0.4, 0.9], [80, -40]);
  const decorY2 = useTransform(p, [0.4, 0.9], [120, -80]);
  const decorOpacity = useTransform(p, [0.5, 0.75], [0, 1]);

  return (
    <section ref={ref} className="relative h-[240vh] md:h-[260vh]" aria-label="Hero">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-forest">
        {/* Interior image behind the doors */}
        <motion.div
          style={{ scale: interiorScale, opacity: interiorOpacity }}
          className="absolute inset-0"
        >
          <img
            src={heroInterior}
            alt="Luxurious modern living room with marble accent wall and golden chandelier"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/60" />
        </motion.div>

        {/* Floating decor labels */}
        <motion.div
          style={{ y: decorY1, opacity: decorOpacity }}
          className="pointer-events-none absolute left-[8%] top-[28%] hidden md:block"
        >
          <DecorTag label="Marble" sub="Carrara · Italy" />
        </motion.div>
        <motion.div
          style={{ y: decorY2, opacity: decorOpacity }}
          className="pointer-events-none absolute right-[10%] top-[55%] hidden md:block"
        >
          <DecorTag label="Brass Chandelier" sub="Hand-forged" align="right" />
        </motion.div>
        <motion.div
          style={{ y: decorY1, opacity: decorOpacity }}
          className="pointer-events-none absolute left-[14%] bottom-[18%] hidden md:block"
        >
          <DecorTag label="Velvet Lounge" sub="Sage 09" />
        </motion.div>

        {/* Left door */}
        <motion.div
          style={{ rotateY: leftRotate, opacity: doorOpacity, transformOrigin: "left center" }}
          className="absolute inset-y-0 left-0 w-1/2 will-change-transform"
        >
          <DoorPanel side="left" />
        </motion.div>

        {/* Right door */}
        <motion.div
          style={{ rotateY: rightRotate, opacity: doorOpacity, transformOrigin: "right center" }}
          className="absolute inset-y-0 right-0 w-1/2 will-change-transform"
        >
          <DoorPanel side="right" />
        </motion.div>

        {/* Top headline */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="absolute inset-x-0 top-0 z-20 px-4 pt-24 text-center sm:px-6 md:pt-36"
        >
          <p className="mb-6 text-sm uppercase tracking-[0.5em] text-cream/80">
            Interior Designer · Ahmedabad
          </p>
          <h1 className="font-display text-balance text-4xl font-light leading-[0.95] text-cream sm:text-6xl md:text-[7.5rem] lg:text-[8.5rem]">
            Step Inside <em className="font-medium italic text-sand">Beauty</em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-cream/75 md:text-lg">
            Scroll to open the doors — and discover interiors crafted to feel like home, elevated to
            feel like art.
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: useTransform(p, [0, 0.2], [1, 0]) }}
          className="absolute inset-x-0 bottom-10 z-20 flex flex-col items-center gap-2 text-cream/70"
        >
          <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
          <div className="h-10 w-px bg-cream/40">
            <motion.div
              className="h-1/2 w-px bg-cream"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DoorPanel({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="relative h-full w-full"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.42 0.08 135) 0%, oklch(0.52 0.09 135) 50%, oklch(0.38 0.07 135) 100%)",
        boxShadow:
          side === "left"
            ? "inset -40px 0 80px -20px rgba(0,0,0,0.6), inset 8px 0 0 0 oklch(0.32 0.05 135)"
            : "inset 40px 0 80px -20px rgba(0,0,0,0.6), inset -8px 0 0 0 oklch(0.32 0.05 135)",
      }}
    >
      {/* Wood grain texture overlay */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0 1px, transparent 1px 6px), repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 14px)",
        }}
      />
      {/* Panel insets */}
      <div className="absolute inset-x-8 inset-y-12 grid grid-rows-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-sm border border-cream/15"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.06)",
            }}
          />
        ))}
      </div>
      {/* Door handle */}
      <div
        className={`absolute top-1/2 ${side === "left" ? "right-4" : "left-4"} -translate-y-1/2`}
      >
        <div className="h-16 w-2 rounded-full bg-gradient-to-b from-sand via-yellow-300/70 to-sand/60 shadow-[0_0_12px_rgba(255,220,150,0.5)]" />
      </div>
      {/* Gold seam at center edge */}
      <div
        className={`absolute inset-y-0 ${side === "left" ? "right-0" : "left-0"} w-[2px] bg-gradient-to-b from-transparent via-sand to-transparent opacity-80`}
      />
    </div>
  );
}

function DecorTag({
  label,
  sub,
  align = "left",
}: {
  label: string;
  sub: string;
  align?: "left" | "right";
}) {
  return (
    <div className={`flex items-center gap-3 ${align === "right" ? "flex-row-reverse" : ""}`}>
      <div className="h-px w-16 bg-cream/60" />
      <div className={align === "right" ? "text-right" : ""}>
        <p className="font-display text-lg italic text-cream">{label}</p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-cream/60">{sub}</p>
      </div>
    </div>
  );
}
