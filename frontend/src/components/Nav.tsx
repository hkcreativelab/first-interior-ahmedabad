import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { getSectionHref } from "@/lib/hostinger-links";

const rooms = [
  { to: "/living", label: "Living" },
  { to: "/kitchen", label: "Kitchen" },
  { to: "/dining", label: "Dining" },
  { to: "/bedroom", label: "Bedroom" },
] as const;

const pageLinks = [
  { to: "/about", label: "About" },
  { to: "/reels", label: "Videos" },
] as const;

const sectionLinks = [
  { hash: "gallery", label: "Gallery" },
  { hash: "services", label: "Services" },
  { hash: "contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  useEffect(() => {
    const onScroll = () => setScrolled(!isHome || window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    setMobileOpen(false);
    if (!isHome) {
      setScrolled(true);
    }
  }, [pathname, isHome]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-cream/85 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:py-4 overflow-x-hidden">
        <Link
          to="/"
          className={`flex items-center gap-2 ${scrolled ? "text-forest" : "text-cream"}`}
        >
          <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full border border-current sm:h-7 sm:w-7">
            <span className="h-1 w-1 rounded-full bg-current sm:h-1.5 sm:w-1.5" />
          </span>
          <div className="leading-tight">
            <span className="block font-display text-sm tracking-wide sm:text-base">
              First Interiors
            </span>
            <span className="block text-[7px] uppercase tracking-[0.15em] opacity-70 sm:text-[8px] sm:tracking-[0.2em]">
              Rejuvenate your ideas
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors sm:h-10 sm:w-10 md:hidden ${
              scrolled ? "border-ink text-ink" : "border-cream text-cream"
            }`}
          >
            <span className="relative block h-0.5 w-5 bg-current before:absolute before:-top-2 before:block before:h-0.5 before:w-5 before:bg-current after:absolute after:top-2 after:block before:h-0.5 after:h-0.5 after:w-5 after:bg-current" />
          </button>

          <ul
            className={`hidden items-center gap-4 text-xs uppercase tracking-[0.2em] md:flex md:gap-5 ${scrolled ? "text-ink" : "text-cream"}`}
          >
            {rooms.map((r) => (
              <li key={r.to}>
                <Link
                  to={r.to}
                  className="relative after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-0 after:bg-current after:transition-all hover:after:w-full"
                  activeProps={{ className: "font-semibold after:!w-full" }}
                >
                  {r.label}
                </Link>
              </li>
            ))}
            {pageLinks.map((p) => (
              <li key={p.to}>
                <Link
                  to={p.to}
                  className="relative after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-0 after:bg-current after:transition-all hover:after:w-full"
                  activeProps={{ className: "font-semibold after:!w-full" }}
                >
                  {p.label}
                </Link>
              </li>
            ))}
            {sectionLinks.map((l) => (
              <li key={l.hash}>
                <a
                  href={getSectionHref(l.hash)}
                  className="relative after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-0 after:bg-current after:transition-all hover:after:w-full"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-screen border-t border-border bg-cream/95" : "max-h-0"}`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pb-4 text-ink sm:px-6 sm:gap-3 sm:pb-5">
          {rooms.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-ink transition hover:border-forest hover:bg-forest/5 sm:px-4 sm:py-3 sm:text-sm"
            >
              {r.label}
            </Link>
          ))}

          {pageLinks.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-ink transition hover:border-forest hover:bg-forest/5 sm:px-4 sm:py-3 sm:text-sm"
            >
              {p.label}
            </Link>
          ))}

          {sectionLinks.map((l) => (
            <a
              key={l.hash}
              href={getSectionHref(l.hash)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-ink transition hover:border-forest hover:bg-forest/5 sm:px-4 sm:py-3 sm:text-sm"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
