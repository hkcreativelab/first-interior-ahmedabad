import { createFileRoute } from "@tanstack/react-router";
import { RoomPage } from "@/components/RoomPage";
import diningClassic from "@/assets/dining.webp";
import diningElegant from "@/assets/dining-elegant.webp";
import diningModern from "@/assets/dining-modern.webp";

export const Route = createFileRoute("/dining")({
  head: () => ({
    meta: [
      { title: "Dining Hall Designs — First Interiors Ahmedabad" },
      {
        name: "description",
        content:
          "Dining hall interiors by First Interiors — elegant, modern and intimate designs with bespoke tables, lighting and wall treatments.",
      },
      { property: "og:title", content: "Dining Hall Designs — First Interiors" },
      {
        property: "og:description",
        content: "Tables built for long conversations — designed and delivered.",
      },
      { property: "og:image", content: diningElegant },
    ],
  }),
  component: DiningPage,
});

function DiningPage() {
  return (
    <RoomPage
      eyebrow="— Dining Hall"
      title="Tables built for"
      italic="long conversations"
      intro="From a quiet four-seater to a Sunday-lunch eight-seater — bespoke dining halls with statement lighting, panelled walls and built-in storage."
      hero={diningElegant}
      ambient="dining"
      options={[
        {
          id: "classic-grand",
          title: "Classic Grand",
          img: diningElegant,
          style: "Heritage",
          blurb:
            "An eight-seater walnut table under a crystal chandelier, with upholstered chairs and a sculpted feature wall — formal, warm, timeless.",
          features: [
            "Solid walnut or sheesham table (8–10 seats)",
            "Upholstered linen / velvet dining chairs",
            "Custom crystal or brass chandelier",
            "Panelled accent wall + buffet console",
          ],
          priceFrom: "₹2.8 L",
        },
        {
          id: "modern-round",
          title: "Modern Round",
          img: diningModern,
          style: "Contemporary",
          blurb:
            "Sculptural marble round table on a fluted oak wall — sage velvet chairs, a single statement pendant, perfect for compact halls.",
          features: [
            "Italian marble round top · 4–6 seats",
            "Fluted oak wall panelling",
            "Velvet upholstered chairs",
            "Sculptural pendant light",
          ],
          priceFrom: "₹2.2 L",
        },
        {
          id: "open-plan",
          title: "Open-Plan Loft",
          img: diningClassic,
          style: "Open-plan",
          blurb:
            "Flows between kitchen and living — long pine table, mixed chairs, layered pendant cluster and a rug to anchor the space.",
          features: [
            "6–10 seat extendable table",
            "Mixed seating · bench + chairs",
            "Pendant cluster lighting",
            "Open shelving display unit",
          ],
          priceFrom: "₹1.9 L",
        },
      ]}
    />
  );
}
