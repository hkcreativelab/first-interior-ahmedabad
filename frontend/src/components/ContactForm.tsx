import { useState } from "react";

export function ContactForm({ phone = "+919998408599" }: { phone?: string }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  function buildWhatsAppUrl() {
    const cleaned = phone.replace(/[^0-9+]/g, "");
    const lines = [
      name ? `Name: ${name}` : undefined,
      contact ? `Contact: ${contact}` : undefined,
      message ? `Message: ${message}` : undefined,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    // Use wa.me short link which works on mobile and desktop (redirects to web.whatsapp.com)
    const normalized = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
    return `https://wa.me/${normalized}?text=${text}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = buildWhatsAppUrl();
    // Keep the site open while handing the enquiry to WhatsApp. The fallback
    // still works in embedded browsers that block opening a second tab.
    const whatsappWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (!whatsappWindow) {
      window.location.assign(url);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-sm">
        <span className="sr-only">Your name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
        />
      </label>

      <label className="block text-sm">
        <span className="sr-only">Contact number or email</span>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Phone or email"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none"
        />
      </label>

      <label className="block text-sm">
        <span className="sr-only">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your project (optional)"
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none resize-none"
        />
      </label>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-cream hover:bg-ink"
        >
          Contact via WhatsApp
        </button>
        <a
          href={`https://wa.me/${phone.replace(/[^0-9+]/g, "").replace(/^\+/, "")}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-cream/80 hover:text-sand"
        >
          Open WhatsApp
        </a>
      </div>
    </form>
  );
}
