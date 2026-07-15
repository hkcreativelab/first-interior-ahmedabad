import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { getSectionHref } from "@/lib/hostinger-links";

export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-cream/60">First Interiors</p>
            <h2 className="max-w-xl text-3xl font-medium leading-snug text-cream">
              Beautiful homes built on warmth, craft and calm.
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-cream/75">
              Ahmedabad-based interior design studio with a focus on custom spaces, honest
              craftsmanship and a refined palette. We design, manage and deliver turnkey homes,
              kitchens and furniture that feel lived in from day one.
            </p>
          </div>

          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-cream/60">Quick links</p>
            <ul className="space-y-3 text-base text-cream/80">
              <li>
                <Link to="/about" className="hover:text-sand transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/reels" className="hover:text-sand transition-colors">
                  Videos
                </Link>
              </li>
              <li>
                <Link to="/owner" className="hover:text-sand transition-colors">
                  Owner portal
                </Link>
              </li>
              <li>
                <a href={getSectionHref("contact")} className="hover:text-sand transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.35em] text-cream/60">Contact</p>
            <div className="space-y-4 text-base text-cream/80">
              <div>
                <p className="font-medium text-cream">Office</p>
                <p>102, Capital Crown, Near Raysan Metro Station, Raysan, Gandhinagar</p>
              </div>
              <div>
                <p className="font-medium text-cream">Email</p>
                <a
                  href="mailto:Firstinteriorss@gmail.com"
                  className="hover:text-sand transition-colors"
                >
                  Firstinteriorss@gmail.com
                </a>
              </div>
              <div>
                <p className="font-medium text-cream">Phone</p>
                <a
                  href="https://wa.me/919998408599"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-sand transition-colors"
                >
                  +91 9998408599 (WhatsApp)
                </a>
              </div>
              <div>
                <p className="font-medium text-cream">Instagram</p>
                <a
                  href="https://www.instagram.com/firstinteriors_utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
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

        <div className="mt-8 border-t border-cream/15 pt-6 text-center text-sm uppercase tracking-[0.35em] text-cream/50 md:flex md:items-center md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} First Interiors · Ahmedabad · All rights reserved.</p>
          <a
            href="https://www.instagram.com/firstinteriors_utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
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
