import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — First Interiors Ahmedabad" },
      {
        name: "description",
        content:
          "Learn about First Interiors — our design process, values and terms of service for interior projects in Ahmedabad.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-ink">
      <Nav />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-28 sm:pb-32">
        <section className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-ink/60">— About us</p>
            <h1 className="font-display text-6xl font-semibold leading-tight sm:text-6xl">
              We create interiors that feel calm, layered and unmistakably yours.
            </h1>
          </div>
          <p className="text-lg leading-relaxed text-ink/70">
            First Interiors is a boutique Ahmedabad studio building thoughtful homes, kitchens and
            furniture. We combine warm taupe texture, slate blue detail and deep ebony contrast to
            create spaces that are both elegant and welcoming.
          </p>
        </section>

        <section className="mt-20 grid gap-12 md:grid-cols-2">
          <article className="rounded-3xl border border-border bg-cream p-8 text-ink shadow-sm">
            <h2 className="mb-4 text-3xl font-semibold text-ink">Our approach</h2>
            <p className="text-base leading-relaxed">
              We begin with how you live, then design every detail around your routines, light and
              mood. Our projects are driven by honesty, material quality and a strong sense of
              balance between glamour and comfort.
            </p>
          </article>
          <article className="rounded-3xl border border-border bg-cream p-8 text-ink shadow-sm">
            <h2 className="mb-4 text-3xl font-semibold text-ink">What we deliver</h2>
            <ul className="space-y-3 text-base leading-relaxed text-ink/70">
              <li>Turnkey interiors with full project management.</li>
              <li>Custom modular kitchens built for Indian cooking.</li>
              <li>Bespoke furniture, panelling and lighting schemes.</li>
              <li>Trusted vendor relationships and on-time handovers.</li>
            </ul>
          </article>
        </section>

        <section className="mt-20 space-y-8 rounded-3xl border border-border bg-cream p-10 shadow-sm">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-ink/60">
              Terms & conditions
            </p>
            <h2 className="text-4xl font-semibold text-ink">Project terms and conditions</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6 text-base leading-relaxed text-ink/70">
              <div>
                <p className="font-semibold text-ink">Scope of work</p>
                <p className="mt-2">
                  All design, procurement and execution services are clarified in the initial
                  proposal. Any out-of-scope requests may be billed separately.
                </p>
              </div>
              <div>
                <p className="font-semibold text-ink">Payment schedule</p>
                <p className="mt-2">
                  We typically request a 30% upfront booking fee, 40% at execution start and 30% on
                  handover. Exact terms are shared with every client.
                </p>
              </div>
            </div>
            <div className="space-y-6 text-base leading-relaxed text-ink/70">
              <div>
                <p className="font-semibold text-ink">Changes & cancellations</p>
                <p className="mt-2">
                  Design revisions are included within the agreed scope. Significant changes or
                  cancellations after work begins may incur additional charges.
                </p>
              </div>
              <div>
                <p className="font-semibold text-ink">Liability & delivery</p>
                <p className="mt-2">
                  We deliver projects according to the agreed schedule and quality standards. Final
                  handover confirms client approval and ownership of works.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
