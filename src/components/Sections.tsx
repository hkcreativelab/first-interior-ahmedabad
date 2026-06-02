import { motion, type Variants } from "motion/react";
import { Link } from "@tanstack/react-router";
import livingRoom from "@/assets/living-room.webp";
import kitchen from "@/assets/kitchen.webp";
import bedroom from "@/assets/bedroom.webp";
import dining from "@/assets/dining.webp";
import bathroom from "@/assets/bathroom.webp";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

/* -------------------- Gallery -------------------- */
const gallery = [
  { img: livingRoom, title: "Living Room", tag: "Warmth & ease", to: "/living" as const },
  { img: kitchen, title: "Kitchen", tag: "Sage · brass", to: "/kitchen" as const },
  { img: bedroom, title: "Bedroom", tag: "Soft retreats", to: "/bedroom" as const },
  { img: dining, title: "Dining", tag: "Conversations", to: "/dining" as const },
  { img: bathroom, title: "Bathroom", tag: "Marble & calm", to: "/bathroom" as const },
];

export function Gallery() {
  return (
    <section id="gallery" className="relative bg-cream py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-20 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.4em] text-forest/70">— 01 / Gallery</p>
            <h2 className="font-display text-5xl font-light leading-tight md:text-7xl">
              Rooms designed to <em className="italic text-forest">breathe</em>.
            </h2>
          </div>
          <p className="max-w-sm text-lg text-muted-foreground">
            Five years, two hundred homes — every interior tailored to the people who live in it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-12 md:gap-6">
          {gallery.map((g, i) => (
            <motion.figure
              key={g.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-sm ${spans[i]}`}
            >
              {g.to ? (
                <Link
                  to={g.to}
                  className="absolute inset-0 z-10"
                  aria-label={`Explore ${g.title} designs`}
                />
              ) : null}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={g.img}
                  alt={g.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-90" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cream/70">{g.tag}</p>
                  <h3 className="font-display text-3xl text-cream md:text-4xl">{g.title}</h3>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-full border border-cream/40 text-cream transition-all group-hover:bg-cream group-hover:text-forest">
                  →
                </span>
              </figcaption>
              <div className="invisible">
                <div className={heights[i]} />
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const spans = [
  "sm:col-span-2 md:col-span-7",
  "sm:col-span-2 md:col-span-5",
  "col-span-1 md:col-span-4",
  "col-span-1 md:col-span-4",
  "sm:col-span-2 md:col-span-4",
];
const heights = [
  "h-[320px] sm:h-[420px] md:h-[560px]",
  "h-[320px] sm:h-[420px] md:h-[560px]",
  "h-[280px] sm:h-[340px] md:h-[420px]",
  "h-[280px] sm:h-[340px] md:h-[420px]",
  "h-[280px] sm:h-[340px] md:h-[420px]",
];

/* -------------------- Services -------------------- */
const services = [
  {
    n: "01",
    t: "Turnkey Interiors",
    d: "End-to-end home transformations — design, execute, deliver.",
  },
  {
    n: "02",
    t: "Modular Kitchens",
    d: "Hand-crafted layouts engineered for the way your family cooks.",
  },
  {
    n: "03",
    t: "Bespoke Furniture",
    d: "Sofas, beds, wardrobes — built to your room, not from a catalogue.",
  },
  {
    n: "04",
    t: "False Ceilings & Lights",
    d: "Architectural ceilings and lighting plans that shape every mood.",
  },
  {
    n: "05",
    t: "Wall Panelling & Décor",
    d: "Marble, fluted wood, brass — texture work that defines a space.",
  },
  {
    n: "06",
    t: "Project Management",
    d: "One point of contact. Trusted vendors. On-time, on-budget delivery.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-forest py-32 text-cream">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, oklch(0.95 0.04 90) 0, transparent 40%), radial-gradient(circle at 80% 60%, oklch(0.95 0.04 90) 0, transparent 35%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-20 max-w-3xl"
        >
          <p className="mb-3 text-sm uppercase tracking-[0.4em] text-sand/80">
            — 02 / Site Services
          </p>
          <h2 className="font-display text-5xl font-light leading-tight md:text-7xl">
            End-to-end interior <em className="italic text-sand">solutions</em>.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-cream/70">
            From the first sketch to the last lampshade — trusted craftsmen, certified vendors,
            obsessive attention to detail.
          </p>
        </motion.div>

        <div className="grid gap-px overflow-hidden rounded-sm border border-cream/15 bg-cream/15 md:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              className="group relative bg-forest p-10 transition-colors hover:bg-[oklch(0.42_0.08_135)]"
            >
              <span className="font-display text-base italic text-sand/70">{s.n}</span>
              <h3 className="mt-6 font-display text-4xl font-light">{s.t}</h3>
              <p className="mt-4 text-base leading-relaxed text-cream/65">{s.d}</p>
              <div className="mt-8 h-px w-12 bg-sand transition-all duration-500 group-hover:w-24" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Why Us -------------------- */
export function Why() {
  return (
    <section id="why" className="relative bg-sand py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className="mb-3 text-sm uppercase tracking-[0.4em] text-forest/70">
              — 03 / Why First Interiors
            </p>
            <h2 className="font-display text-5xl font-light leading-tight text-ink md:text-7xl">
              Crafted with <em className="italic text-forest">intention</em>. Delivered with care.
            </h2>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              We don't just decorate rooms — we listen, we design, we build. Every project is led by
              the founders, not a sales team. Every detail is owned, not outsourced.
            </p>
            <a
              href="#contact"
              className="mt-10 inline-flex items-center gap-3 border-b border-forest pb-1 text-sm uppercase tracking-[0.3em] text-forest transition-all hover:gap-5"
            >
              Start your project <span>→</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="rounded-[2rem] border border-border bg-card p-12 shadow-sm"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-forest/70">Founder-led craft</p>
            <h3 className="mt-6 text-5xl font-display text-ink">
              Every home is owned, not outsourced.
            </h3>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              We manage every phase from concept and procurement to the final handover, so the same
              team that designs your space also delivers it.
            </p>
            <div className="mt-10 space-y-4 text-sm text-ink/70">
              <p>Founder-led design and delivery.</p>
              <p>Trusted vendors, transparent pricing.</p>
              <p>Built to feel calm, layered and unmistakably yours.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Reviews -------------------- */
const reviews = [
  {
    q: "They turned a tired flat into a home that feels like a five-star suite. The kitchen alone makes me want to cook every evening.",
    n: "Aanya Mehta",
    r: "3BHK · Bodakdev",
  },
  {
    q: "Punctual, honest, and quietly obsessive about details. We changed our minds a dozen times — they never flinched.",
    n: "Rohit & Sneha Shah",
    r: "Villa · Shela",
  },
  {
    q: "The wardrobes are a work of art. Every drawer slides like silk. Worth every rupee.",
    n: "Pranav Desai",
    r: "Apartment · Prahlad Nagar",
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="relative bg-cream py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-20"
        >
          <p className="mb-3 text-sm uppercase tracking-[0.4em] text-forest/70">— 04 / Reviews</p>
          <h2 className="font-display text-5xl font-light leading-tight md:text-7xl">
            Kind words from <em className="italic text-forest">homeowners</em>.
          </h2>
        </motion.div>
        <div className="grid gap-10 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.blockquote
              key={r.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.12 }}
              className="relative flex flex-col gap-8 border border-border bg-card p-10"
            >
              <div className="font-display text-6xl leading-none text-forest/40">"</div>
              <p className="flex-1 text-xl leading-relaxed text-ink/85">{r.q}</p>
              <footer>
                <div className="font-display text-2xl text-forest">{r.n}</div>
                <div className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
                  {r.r}
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Contact -------------------- */
export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-cream py-32 text-ink">
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[600px] w-[600px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(200,177,149,0.25), transparent 55%)" }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm uppercase tracking-[0.4em] text-ink/50">— 05 / Contact</p>
          <h2 className="font-display text-5xl font-light leading-[1.05] md:text-7xl">
            Let's design a home you can't <em className="italic text-forest">wait</em> to come back
            to.
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-ink/75">
            Every home is one of a kind. Tell us what you love (or send a Pinterest board) — we’ll
            craft a space that's entirely yours.
          </p>

          <div className="mt-12 space-y-6 rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-ink/60">Studio</p>
              <p className="mt-2 text-ink/85">Satellite, Ahmedabad • Gujarat, India</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-ink/60">Email</p>
              <a
                href="mailto:Firstinteriorss@gmail.com"
                className="mt-2 inline-block text-forest hover:text-ink"
              >
                Firstinteriorss@gmail.com
              </a>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-ink/60">Phone</p>
              <p className="mt-2 text-ink/85">+91 98765 43210</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6 rounded-[2rem] border border-border bg-ink/5 p-8 shadow-sm"
        >
          {[
            { l: "Your name", t: "text", p: "Jane Doe" },
            { l: "Email", t: "email", p: "jane@home.com" },
            { l: "Project type", t: "text", p: "3BHK · Apartment · Kitchen…" },
          ].map((f) => (
            <label key={f.l} className="block">
              <span className="text-xs uppercase tracking-[0.3em] text-ink/60">{f.l}</span>
              <input
                type={f.t}
                placeholder={f.p}
                className="mt-3 w-full rounded-3xl border border-border bg-cream/90 px-5 py-4 text-lg text-ink outline-none transition focus:border-forest"
              />
            </label>
          ))}
          <label className="block">
            <span className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Tell us about your space
            </span>
            <textarea
              rows={4}
              placeholder="Square footage, style references, anything that excites you…"
              className="mt-3 w-full resize-none rounded-3xl border border-border bg-cream/90 px-5 py-4 text-lg text-ink outline-none transition focus:border-forest"
            />
          </label>
          <button
            type="submit"
            className="group inline-flex items-center gap-3 rounded-full bg-forest px-8 py-4 text-sm uppercase tracking-[0.3em] text-cream transition-all hover:bg-ink"
          >
            Send enquiry
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </form>
      </div>

      <footer className="relative mx-auto mt-24 max-w-7xl border-t border-ink/10 px-6 pt-10 text-sm uppercase tracking-[0.3em] text-ink/50 md:flex md:justify-between">
        <p>© {new Date().getFullYear()} First Interiors · Ahmedabad</p>
        <p>Rejuvenate your ideas</p>
      </footer>
    </section>
  );
}
