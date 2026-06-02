import { createFileRoute } from "@tanstack/react-router";
import { RoomPage } from "@/components/RoomPage";
import bathroomClassic from "@/assets/bathroom.webp";
import bathroomSpa from "@/assets/bathroom-spa.webp";
import bathroomDark from "@/assets/bathroom-dark.webp";

export const Route = createFileRoute("/bathroom")({
  head: () => ({
    meta: [
      { title: "Bathroom Interior Designs — First Interiors Ahmedabad" },
      {
        name: "description",
        content:
          "Bathroom interiors by First Interiors — spa, dark luxe and powder room designs with marble, brass fittings and walk-in showers.",
      },
      { property: "og:title", content: "Bathroom Interior Designs — First Interiors" },
      {
        property: "og:description",
        content: "Marble, brass and quiet drama — bathrooms designed like sanctuaries.",
      },
      { property: "og:image", content: bathroomSpa },
    ],
  }),
  component: BathroomPage,
});

function BathroomPage() {
  return (
    <RoomPage
      eyebrow="— Bathrooms"
      title="Sanctuaries in"
      italic="marble & brass"
      intro="Wet-area waterproofing done right, niches planned to the millimetre, and finishes that hold up to daily life — bathrooms built for the long run."
      hero={bathroomSpa}
      ambient="bathroom"
      options={[
        {
          id: "spa-stone",
          title: "Spa Stone",
          img: bathroomSpa,
          style: "Spa",
          blurb:
            "Carved stone tub, full-height marble walls and brass tapware with backlit cove ceilings — wellness without leaving home.",
          features: [
            "Freestanding stone or acrylic tub",
            "Italian marble cladding",
            "Brass wall-mounted tapware (Jaquar Opal+)",
            "Backlit cove lighting + dimmers",
          ],
          priceFrom: "₹3.2 L",
        },
        {
          id: "dark-luxe",
          title: "Dark Luxe",
          img: bathroomDark,
          style: "Dramatic",
          blurb:
            "Black marble walls, gold fixtures and a backlit vanity mirror — perfect for a master ensuite that should feel like a private suite.",
          features: [
            "Nero Marquina or Marquinia walls",
            "PVD gold fittings & accessories",
            "Backlit LED vanity mirror",
            "Walk-in glass shower + niche",
          ],
          priceFrom: "₹2.6 L",
        },
        {
          id: "powder-warm",
          title: "Powder Warm",
          img: bathroomClassic,
          style: "Compact",
          blurb:
            "Designed for guest bathrooms — terrazzo floors, wall-hung vanity, fluted glass and warm sconces in a tight footprint.",
          features: [
            "Wall-hung vanity (1.2–1.8 m)",
            "Terrazzo or matte porcelain floor",
            "Fluted glass shower screen",
            "Warm 3000K sconces",
          ],
          priceFrom: "₹1.4 L",
        },
      ]}
    />
  );
}
