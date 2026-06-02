import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-cream/60">First Interiors</p>
            <h2 className="max-w-xl text-4xl font-medium text-cream">
              Beautiful homes built on warmth, craft and calm.
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-cream/75">
              Ahmedabad-based interior design studio with a focus on custom spaces, honest
              craftsmanship and a refined palette. We design, manage and deliver turnkey homes,
              kitchens and furniture that feel lived in from day one.
            </p>
          </div>

          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-cream/60">Quick links</p>
            <ul className="space-y-3 text-base text-cream/80">
              <li>
                <Link to="/about" className="hover:text-sand transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/reels" className="hover:text-sand transition-colors">
                  Reels
                </Link>
              </li>
              <li>
                <Link to="/owner" className="hover:text-sand transition-colors">
                  Owner portal
                </Link>
              </li>
              <li>
                <Link to="/#contact" className="hover:text-sand transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-cream/60">Contact</p>
            <div className="space-y-4 text-base text-cream/80">
              <div>
                <p className="font-medium text-cream">Studio</p>
                <p>Satellite, Ahmedabad</p>
              </div>
              <div>
                <p className="font-medium text-cream">Email</p>
                <a
                  href="mailto:hello@firstinteriors.in"
                  className="hover:text-sand transition-colors"
                >
                  hello@firstinteriors.in
                </a>
              </div>
              <div>
                <p className="font-medium text-cream">Phone</p>
                <p>+91 98765 43210</p>
              </div>
              <div>
                <p className="font-medium text-cream">Instagram</p>
                <a
                  href="https://www.instagram.com/firstinteriors_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-base text-cream/80 hover:text-sand transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  <span>firstinteriors_</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/15 pt-8 text-center text-sm uppercase tracking-[0.35em] text-cream/50 md:flex md:items-center md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} First Interiors · Ahmedabad · All rights reserved.</p>
          <a
            href="https://www.instagram.com/firstinteriors_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center justify-center gap-2 text-base text-cream/80 transition-colors hover:text-sand md:mt-0"
          >
            <Instagram className="h-4 w-4" />
            instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
