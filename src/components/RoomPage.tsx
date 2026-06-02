import { motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AmbientOverlay, type AmbientVariant } from "@/components/AmbientOverlay";

export type RoomOption = {
  id: string;
  title: string;
  img: string;
  style: string;
  blurb: string;
  features: string[];
  priceFrom: string;
  imagePosition?: string;
};

export type RoomPageProps = {
  eyebrow: string;
  title: string;
  italic: string;
  intro: string;
  hero: string;
  options: RoomOption[];
  ambient?: AmbientVariant;
};

const OWNER_PHONE = "919876543210"; // +91 98765 43210 — update with real number
const OWNER_DISPLAY = "+91 98765 43210";
const OWNER_EMAIL = "Firstinteriorss@gmail.com";

function waLink(roomTitle: string, optTitle: string, intent: "Book" | "Inquiry") {
  const msg =
    intent === "Book"
      ? `Hi First Interiors, I'd like to book a consultation for the "${optTitle}" ${roomTitle} design.`
      : `Hi First Interiors, I'd like to know more about the "${optTitle}" ${roomTitle} design (pricing, timelines, customisation).`;
  return `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(msg)}`;
}

function mailLink(roomTitle: string, optTitle: string) {
  const subject = `Enquiry — ${optTitle} (${roomTitle})`;
  const body = `Hello First Interiors,\n\nI'm interested in the "${optTitle}" ${roomTitle} design. Please share details about pricing, timelines and customisation.\n\nThanks.`;
  return `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function RoomPage({ eyebrow, title, italic, intro, hero, options, ambient }: RoomPageProps) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Nav />

      {/* Hero */}
      <section className="relative h-[min(100vh,820px)] min-h-[60vh] sm:min-h-[70vh] md:min-h-[600px] w-full overflow-hidden">
        <motion.img
          src={hero}
          alt={title}
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/40 to-ink/80" />
        {ambient && <AmbientOverlay variant={ambient} />}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-12 sm:px-6 sm:pb-16 md:pb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-2 text-xs uppercase tracking-[0.4em] text-sand sm:mb-4"
          >
            {eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9 }}
            className="font-display text-3xl font-light leading-[1.02] text-cream sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl"
          >
            {title} <em className="italic text-sand">{italic}</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="mt-3 max-w-xl text-sm text-cream/80 sm:mt-6 sm:text-base"
          >
            {intro}
          </motion.p>
        </div>
      </section>

      {/* Options */}
      <section className="relative bg-cream py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex flex-col gap-4 justify-between md:mb-16 md:flex-row md:items-end md:gap-6">
            <h2 className="font-display text-3xl font-light sm:text-4xl md:text-5xl">
              Pick a <em className="italic text-forest">direction</em>.
            </h2>
            <p className="max-w-xs text-sm text-muted-foreground sm:text-base">
              Each design is fully customisable. Book a consult or send an inquiry — we reply within
              a day.
            </p>
          </div>

          <div className="grid gap-8 sm:gap-10 md:gap-12">
            {options.map((o, i) => (
              <motion.article
                key={o.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`grid items-center gap-6 md:gap-10 md:grid-cols-12 ${
                  i % 2 === 1 ? "md:[&>figure]:order-2" : ""
                }`}
              >
                <figure className="group relative col-span-12 -mx-4 overflow-hidden md:mx-0 md:rounded-sm md:col-span-7 sm:-mx-6">
                  <img
                    src={o.img}
                    alt={o.title}
                    loading="lazy"
                    decoding="async"
                    width={1280}
                    height={896}
                    style={{ objectPosition: o.imagePosition ?? "center" }}
                    className="h-[240px] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105 sm:h-[300px] md:h-[520px]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-2 text-xs uppercase tracking-[0.3em] text-forest sm:left-5 sm:top-5 sm:px-4">
                    {o.style}
                  </span>
                </figure>

                <div className="col-span-12 md:col-span-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-forest/70 sm:text-sm">
                    Option 0{i + 1}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-light leading-tight sm:mt-3 sm:text-3xl md:text-5xl">
                    {o.title}
                  </h3>
                  <p className="mt-4 text-base text-muted-foreground sm:mt-5 sm:text-lg">
                    {o.blurb}
                  </p>

                  <ul className="mt-4 space-y-2 text-sm text-ink/80 sm:mt-6 sm:text-base">
                    {o.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className="mt-2 inline-block h-px w-4 flex-shrink-0 bg-forest sm:w-5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:gap-3 sm:flex-row sm:flex-wrap">
                    <a
                      href={waLink(title, o.title, "Book")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-4 py-3 text-xs uppercase tracking-[0.3em] text-cream transition-all hover:bg-ink sm:px-6 sm:py-3 sm:text-sm sm:w-auto"
                    >
                      Book this design
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                    <a
                      href={waLink(title, o.title, "Inquiry")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-forest px-4 py-3 text-xs uppercase tracking-[0.3em] text-forest transition-all hover:bg-forest hover:text-cream sm:px-6 sm:py-3 sm:text-sm sm:w-auto"
                    >
                      WhatsApp inquiry
                    </a>
                    <a
                      href={mailLink(title, o.title)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-xs uppercase tracking-[0.3em] text-ink/70 transition-all hover:border-forest hover:text-forest sm:px-6 sm:py-3 sm:text-sm sm:w-auto"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact owner band */}
      <section className="relative overflow-hidden bg-forest py-12 text-cream sm:py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.4em] text-sand/80 sm:mb-3">
              — Talk to the owner
            </p>
            <h2 className="font-display text-2xl font-light leading-tight sm:text-4xl md:text-6xl">
              Have a different idea? <em className="italic text-sand">Let's design it.</em>
            </h2>
            <p className="mt-4 max-w-md text-sm text-cream/70 sm:mt-6 sm:text-lg">
              Every home is one of a kind. Tell us what you love (or send a Pinterest board) — we'll
              craft a space that's entirely yours.
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4 md:space-y-5 md:justify-self-end md:w-full">
            <a
              href={`https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(
                `Hi First Interiors, I'd like to discuss a custom ${title.toLowerCase()} design.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-start justify-between gap-3 rounded-full bg-sand px-4 py-3 text-ink transition-all hover:bg-cream sm:flex-row sm:gap-6 sm:px-6 sm:py-4 sm:items-center"
            >
              <span className="text-xs uppercase tracking-[0.3em] sm:text-sm">
                WhatsApp the owner
              </span>
              <span className="font-display text-lg sm:text-xl">{OWNER_DISPLAY}</span>
            </a>
            <a
              href={`tel:+${OWNER_PHONE}`}
              className="flex flex-col items-start justify-between gap-3 rounded-full border border-cream/30 px-4 py-3 text-cream transition-all hover:border-sand hover:text-sand sm:flex-row sm:gap-6 sm:px-6 sm:py-4 sm:items-center"
            >
              <span className="text-xs uppercase tracking-[0.3em] sm:text-sm">Call directly</span>
              <span className="font-display text-lg sm:text-xl">{OWNER_DISPLAY}</span>
            </a>
            <a
              href={`mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(`Custom ${title} design`)}`}
              className="flex flex-col items-start justify-between gap-3 rounded-full border border-cream/30 px-4 py-3 text-cream transition-all hover:border-sand hover:text-sand sm:flex-row sm:gap-6 sm:px-6 sm:py-4 sm:items-center"
            >
              <span className="text-xs uppercase tracking-[0.3em] sm:text-sm">Email</span>
              <span className="font-display text-lg sm:text-xl">{OWNER_EMAIL}</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
