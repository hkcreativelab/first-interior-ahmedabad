import { createFileRoute } from "@tanstack/react-router";
import { RoomPage } from "@/components/RoomPage";
import bedroomClassic from "@/assets/bedroom.webp";
import bedroomSerene from "@/assets/bedroom-serene.webp";
import bedroomLuxe from "@/assets/bedroom-luxe.webp";
import bedroom1 from "@/assets/bed room 1.jpg";
import bedroom2 from "@/assets/bed room 2.jpg";
import bedroom3 from "@/assets/bed room 3.jpg";

export const Route = createFileRoute("/bedroom")({
  head: () => ({
    meta: [
      { title: "Bedroom Interior Designs — First Interiors Ahmedabad" },
      {
        name: "description",
        content:
          "Master and guest bedroom interiors by First Interiors — serene, luxe and warm directions with custom wardrobes, headboards and lighting.",
      },
      { property: "og:title", content: "Bedroom Interior Designs — First Interiors" },
      {
        property: "og:description",
        content: "Soft retreats — bespoke bedrooms designed around your routine.",
      },
      { property: "og:image", content: bedroomLuxe },
    ],
  }),
  component: BedroomPage,
});

function BedroomPage() {
  return (
    <RoomPage
      eyebrow="— Bedrooms"
      title="Soft retreats,"
      italic="quietly luxurious"
      intro="A bedroom should feel like an exhale. Custom wardrobes, panelled headboards, layered lighting and finishes chosen for how light moves through your room."
      hero={bedroomLuxe}
      ambient="bedroom"
      options={[
        {
          id: "serene-wood",
          title: "Serene Wood",
          img: bedroom1,
          style: "Calm",
          blurb:
            "Full-wall walnut headboard panel with concealed cove lighting, linen bedding and matching bedside units — restful without feeling cold.",
          features: [
            "Full-wall veneer headboard",
            "Concealed LED cove + reading lights",
            "Bedside units + 2-door wardrobe",
            "Soft linen bedding palette",
          ],
          priceFrom: "₹1.6 L",
        },
        {
          id: "velvet-luxe",
          title: "Velvet Luxe",
          img: bedroom2,
          style: "Statement",
          blurb:
            "Tall tufted velvet headboard, brass wall sconces, marble bedside tables and a moody charcoal palette — pure boutique-hotel energy.",
          features: [
            "Tufted velvet wingback headboard",
            "Brass swing-arm sconces",
            "Marble bedside tables",
            "Layered curtains + sheer",
          ],
          priceFrom: "₹2.4 L",
        },
        {
          id: "warm-classic",
          title: "Warm Classic",
          img: bedroom3,
          style: "Timeless",
          blurb:
            "Sage walls, warm wood wardrobes, a textured rug and bedside reading nook — the design we recommend most for master bedrooms.",
          features: [
            "Full-height sliding wardrobe (8–12 ft)",
            "Loose-back upholstered bed",
            "Bedside reading nook + lighting",
            "Wool or jute area rug",
          ],
          priceFrom: "₹1.9 L",
        },
      ]}
    />
  );
}
