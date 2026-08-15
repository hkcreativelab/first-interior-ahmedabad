import { motion, type Variants } from "motion/react";
import { Link } from "@tanstack/react-router";
import livingRoom from "@/assets/living room 1.jpeg";
import kitchen from "@/assets/kitchen 2.jpg";
import bedroom from "@/assets/bed room 1.jpg";
import dining from "@/assets/dining 1.png";
import type { FormEvent } from "react";
import { getSectionHref } from "@/lib/hostinger-links";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

const ENQUIRY_EMAIL = "Firstinteriorss@gmail.com";
const WHATSAPP_NUMBER = "919998408599";

function buildEnquiryMailto(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const projectType = String(formData.get("projectType") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const subject = `Interior enquiry${name ? ` from ${name}` : ""}`;
  const body = [
    "Hello First Interiors,",
    "",
    name ? `Name: ${name}` : null,
    email ? `Email: ${email}` : null,
    projectType ? `Project type: ${projectType}` : null,
    message ? `Message:\n${message}` : null,
    "",
    "Please get in touch with me.",
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildGmailComposeUrl(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const projectType = String(formData.get("projectType") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const subject = `Interior enquiry${name ? ` from ${name}` : ""}`;
  const body = [
    "Hello First Interiors,",
    "",
    name ? `Name: ${name}` : null,
    email ? `Email: ${email}` : null,
    projectType ? `Project type: ${projectType}` : null,
    message ? `Message:\n${message}` : null,
    "",
    "Please get in touch with me.",
  ]
    .filter(Boolean)
    .join("\n");

  const gmailParams = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: ENQUIRY_EMAIL,
    su: subject,
    body,
  });

  return `https://mail.google.com/mail/?${gmailParams.toString()}`;
}

function buildWhatsAppUrl(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const projectType = String(formData.get("projectType") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const whatsAppMessage = [
    "Hello First Interiors! 👋",
    "",
    name ? `*Name:* ${name}` : null,
    email ? `*Email:* ${email}` : null,
    projectType ? `*Project type:* ${projectType}` : null,
    message ? `*Message:* ${message}` : null,
    "",
    "I'm interested in your interior design services. Please get in touch with me.",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsAppMessage)}`;
}

/* -------------------- Gallery -------------------- */
const gallery = [
  { img: livingRoom, title: "Living Room", tag: "Warmth & ease", to: "/living" as const },
  { img: kitchen, title: "Kitchen", tag: "Sage · brass", to: "/kitchen" as const },
  { img: bedroom, title: "Bedroom", tag: "Soft retreats", to: "/bedroom" as const },
  { img: dining, title: "Dining", tag: "Conversations", to: "/dining" as const },
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
            End-to-end interior <em className="italic text-cream/80">solutions</em>.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-cream/70">
            From the first sketch to the last lampshade — trusted craftsmen, certified vendors,
            obsessive attention to detail.
          </p>
        </motion.div>

        <div className="grid gap-px overflow-hidden rounded-sm border border-black/20 bg-cream/15 md:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="border-b border-black/25 bg-cream/5 p-8 md:border-b-1 y md:border-r last:border-r-0"
            >
              <div className="font-display text-7xl leading-tight text-cream/40">{s.n}</div>
              <h3 className="mt-6 font-display text-2xl text-cream/95">{s.t}</h3>
              <p className="mt-3 leading-relaxed text-cream/80">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Why -------------------- */
const why = [
  "We stand behind every project with a 2-year warranty on workmanship and materials.",
  "Your project manager is on-site regularly. You''ll know them by name.",
  "No pressure, no surprises. Fixed quotes, transparent timelines.",
];

export function Why() {
  return (
    <section id="why" className="relative bg-cream py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-20 max-w-3xl"
        >
          <p className="mb-3 text-sm uppercase tracking-[0.4em] text-forest/70">� 03 / Why us</p>
          <h2 className="font-display text-5xl font-light leading-tight md:text-7xl">
            Interiors built on <em className="italic text-forest">trust</em>.
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {why.map((w, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="space-y-4 rounded-sm border border-border bg-white p-8"
            >
              <div className="text-3xl font-light text-forest">0{i + 1}</div>
              <p className="text-lg leading-relaxed text-ink/75">{w}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const reviews = [
  {
    q: "For the best interior design, I highly recommend 'First Interiors' for all residential projects. They offer budget-friendly options, excellent service, and Mr. Jeel Patel is a truly good person. 🏡 ✨",
    n: "Saurabh Mewada",
    r: "Local Guide · 83 Reviews",
  },
  {
    q: "I had the pleasure of working with First Interiors, and I can confidently say that they exceeded all of my expectations! Their team was responsive, professional, and truly listened to my needs. The quality of their work is outstanding, and the designs perfectly matched my vision. I highly recommend them to anyone looking for exceptional interior design services.",
    n: "Chhaya Patel",
    r: "Residential Project",
  },
  {
    q: "First Interiors made my home in Motera look stunning. They suggest the best designs in Ahmedabad. My home now looks like heaven! I'm very happy with their work. Mr. Jeel Patel is supportive throughout the project. Their site visits were regular and accurate.",
    n: "Indumati Prajapati",
    r: "Motera Residence",
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
  function handleEnquirySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const whatsappUrl = buildWhatsAppUrl(formData);
    const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (!whatsappWindow) {
      window.location.assign(whatsappUrl);
    }
  }

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
            Every home is one of a kind. Tell us what you love (or send a Pinterest board) — we'll
            craft a space that's entirely yours.
          </p>

          <div className="mt-12 space-y-6 rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-ink/60">Office</p>
              <p className="mt-2 text-ink/85">
                102, Capital Crown, Near Raysan Metro Station, Raysan, Gandhinagar
              </p>
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
              <a
                href="https://wa.me/919998408599"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-forest hover:text-ink"
              >
                +91 9998408599 (WhatsApp)
              </a>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleEnquirySubmit}
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
                name={f.l === "Your name" ? "name" : f.l === "Email" ? "email" : "projectType"}
                required={f.l !== "Project type"}
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
              name="message"
              placeholder="Square footage, style references, anything that excites you…"
              className="mt-3 w-full resize-none rounded-3xl border border-border bg-cream/90 px-5 py-4 text-lg text-ink outline-none transition focus:border-forest"
            />
          </label>
          <button
            type="submit"
            className="group inline-flex items-center gap-3 rounded-full bg-forest px-8 py-4 text-sm uppercase tracking-[0.3em] text-cream transition-all hover:bg-ink"
          >
            Send via WhatsApp
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
