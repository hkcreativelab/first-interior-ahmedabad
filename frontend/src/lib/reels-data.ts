import kitchen from "@/assets/kitchen.webp";
import livingRoom from "@/assets/living-room.webp";
import bedroom from "@/assets/bedroom.webp";

export type Reel = {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  views: string;
  comments: string;
};

export const defaultReels: Reel[] = [
  {
    id: "luxury-kitchen-tour",
    title: "Luxury Kitchen Tour",
    description: "A warm, inviting kitchen with brass accents and premium finishes.",
    url: "https://www.instagram.com/reel/sample-1",
    thumbnail: kitchen,
    views: "4.8k",
    comments: "134",
  },
  {
    id: "elegant-lounge-space",
    title: "Elegant Lounge Space",
    description: "A calm lounge with layered textures, curated art and natural light.",
    url: "https://www.instagram.com/reel/sample-2",
    thumbnail: livingRoom,
    views: "3.2k",
    comments: "92",
  },
  {
    id: "minimalist-bedroom-tour",
    title: "Minimalist Bedroom Tour",
    description: "A soft bedroom retreat defined by neutral tones and gentle proportions.",
    url: "https://www.instagram.com/reel/sample-3",
    thumbnail: bedroom,
    views: "6.1k",
    comments: "215",
  },
];

export const REELS_BLOB_PATH = "reels/reels.json";

const removedDefaultReelIds = new Set([
  "luxury-kitchen-tour",
  "elegant-lounge-space",
  "minimalist-bedroom-tour",
]);

export function sanitizeReels(input: unknown, maxItems = 4): Reel[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter((item): item is Reel => {
      if (!item || typeof item !== "object") return false;
      const reel = item as Reel;
      return (
        typeof reel.id === "string" &&
        !removedDefaultReelIds.has(reel.id) &&
        typeof reel.title === "string" &&
        typeof reel.description === "string" &&
        typeof reel.url === "string"
      );
    })
    .map((reel) => ({
      id: reel.id,
      title: reel.title,
      description: reel.description,
      url: reel.url,
      thumbnail:
        typeof reel.thumbnail === "string" && !reel.thumbnail.startsWith("data:")
          ? reel.thumbnail
          : undefined,
      views: typeof reel.views === "string" ? reel.views : "0",
      comments: typeof reel.comments === "string" ? reel.comments : "0",
    }))
    .slice(0, maxItems);
}
