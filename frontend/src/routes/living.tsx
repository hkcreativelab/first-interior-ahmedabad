import { createFileRoute } from "@tanstack/react-router";
import { RoomPage } from "@/components/RoomPage";
// import livingWarm from "@/assets/living-warm.webp";
import livingMinimal from "@/assets/living-minimal.webp";
// import livingRoom from "@/assets/living-room.webp";
import livingRoomJpg from "@/assets/living-room.jpg";
import livingRoom1 from "@/assets/living room 1.jpeg";
import livingRoom2 from "@/assets/living room 2.png";
import livingMinimalStone from "@/assets/living-minimal-stone.jpeg";
import diningOpenPlan from "@/assets/dining-open-plan.jpeg";

export const Route = createFileRoute("/living")({
  head: () => ({
    meta: [
      { title: "Living Room Interior Designs — First Interiors Ahmedabad" },
      {
        name: "description",
        content:
          "Living room interiors by First Interiors — warm, minimal and dark-luxe directions with custom sofas, panelling and layered lighting.",
      },
      { property: "og:title", content: "Living Room Designs — First Interiors" },
      {
        property: "og:description",
        content: "Rooms designed to gather in — warm, layered and entirely yours.",
      },
      { property: "og:image", content: livingRoomJpg },
    ],
  }),
  component: LivingPage,
});

function LivingPage() {
  return (
    <RoomPage
      eyebrow="— Living Rooms"
      title="Rooms designed"
      italic="to gather in"
      intro="From sunset-flooded sofas to dark-luxe lounges — bespoke living rooms with custom seating, panelled feature walls and lighting tuned to every hour of the day."
      hero={livingRoomJpg}
      ambient="living"
      options={[
        {
          id: "arched-warm",
          title: "Arched Warm",
          img: livingRoom1,
          style: "Warm",
          blurb:
            "A vaulted lounge with a calming neutral palette, sculptural lighting and a large arched window — designed for easy afternoons and quiet evenings.",
          features: [
            "Custom L-shaped linen sofa",
            "Arched glazing with soft drape",
            "Warm timber coffee table",
            "Textured plaster and wall panelling",
          ],
          priceFrom: "",
        },
        {
          id: "sunset-warm",
          title: "Sunset Warm",
          img: livingRoom2,
          style: "Warm",
          blurb:
            "Floor-to-ceiling sheer curtains, an L-shaped linen sofa, brass coffee table and layered greenery — designed for golden-hour light.",
          features: [
            "Custom L-sofa in linen / cotton",
            "Floor-to-ceiling sheer + blackout curtains",
            "Brass / marble coffee table",
            "Layered lighting (cove + floor lamp + table)",
          ],
          priceFrom: "",
        },
        {
          id: "minimal-stone",
          title: "Minimal Stone",
          img: diningOpenPlan,
          style: "Minimal",
          blurb:
            "Marble fireplace feature wall, low-slung grey sofas, oak flooring and a single statement artwork — calm, gallery-like, easy to live in.",
          features: [
            "Marble or limewash fireplace wall",
            "Low-profile modular sofas",
            "Engineered oak flooring",
            "Curated single statement art piece",
          ],
          priceFrom: "",
        },
      ]}
    />
  );
}
