import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Gallery, Services, Why, Reviews, Contact } from "@/components/Sections";
import { ReelsSection } from "@/components/ReelsSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "First Interiors — Interior Designer in Ahmedabad" },
      {
        name: "description",
        content:
          "First Interiors crafts turnkey homes, modular kitchens and bespoke furniture in Ahmedabad — design, build, delivered.",
      },
      { property: "og:title", content: "First Interiors — Interior Designer in Ahmedabad" },
      {
        property: "og:description",
        content: "Turnkey interiors, modular kitchens & bespoke furniture in Ahmedabad.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const routeHash = window.location.hash.replace(/^#\/?/, "");
    const section = new URLSearchParams(routeHash.split("?")[1] ?? "").get("section");
    if (!section) return;

    window.requestAnimationFrame(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Gallery />
      <Services />
      <ReelsSection />
      <Why />
      <Reviews />
      <Contact />
    </div>
  );
}
