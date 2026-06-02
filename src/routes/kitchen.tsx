import { createFileRoute } from "@tanstack/react-router";
import { RoomPage } from "@/components/RoomPage";
// import kitchenClassic from "@/assets/kitchen.webp";
// import kitchenModern from "@/assets/kitchen-modern.webp";
import kitchenLuxury from "@/assets/kitchen-luxury.webp";
import kitchen1 from "@/assets/kitchen 1.jpg";
import kitchen2 from "@/assets/kitchen 2.jpg";
import kitchen3 from "@/assets/kitchen 3.jpg";

export const Route = createFileRoute("/kitchen")({
  head: () => ({
    meta: [
      { title: "Modular Kitchen Designs — First Interiors Ahmedabad" },
      {
        name: "description",
        content:
          "Explore modular kitchen designs by First Interiors — modern, classic and luxury options. Book a consult or inquire directly with the owner.",
      },
      { property: "og:title", content: "Modular Kitchen Designs — First Interiors" },
      {
        property: "og:description",
        content: "Hand-crafted kitchen interiors tailored to how your family cooks.",
      },
      { property: "og:image", content: kitchenLuxury },
    ],
  }),
  component: KitchenPage,
});

function KitchenPage() {
  return (
    <RoomPage
      eyebrow="— Kitchens"
      title="Kitchens that"
      italic="cook with you"
      intro="Modular layouts engineered for Indian cooking — tall units, tandem drawers, soft-close everything, and finishes that age beautifully."
      hero={kitchenLuxury}
      ambient="kitchen"
      options={[
        {
          id: "sage-brass",
          title: "Sage & Brass",
          img: kitchen1,
          style: "Signature",
          blurb:
            "Our most-loved kitchen — sage shaker cabinets, antique brass handles, calacatta quartz tops and a warm pendant trio over the island.",
          features: [
            "L-shaped or island layout · up to 14 ft",
            "Hettich tandem drawers, soft-close hinges",
            "Quartz countertop · full-height backsplash",
            "Tall pantry & integrated tower",
          ],
          priceFrom: "₹3.8 L",
        },
        {
          id: "scandi-light",
          title: "Scandinavian Light",
          img: kitchen2,
          style: "Minimal",
          blurb:
            "Crisp white shaker cabinets, oak ceiling beam, brass tap and marble counters — built for kitchens that get drenched in daylight.",
          features: [
            "Matte white PU finish",
            "Italian marble or quartz tops",
            "Brushed brass hardware",
            "Open shelving + concealed appliances",
          ],
          priceFrom: "₹4.2 L",
        },
        {
          id: "moody-luxe",
          title: "Moody Luxe",
          img: kitchen3,
          style: "Statement",
          blurb:
            "Deep charcoal-stained oak, copper pendants, marble splashback and a dramatic island — a kitchen that doubles as a showpiece.",
          features: [
            "Solid oak with dark stain & PU lacquer",
            "Marble island top · waterfall edge optional",
            "Copper pendant lighting",
            "Built-in wine column & coffee niche",
          ],
          priceFrom: "₹6.5 L",
        },
      ]}
    />
  );
}
