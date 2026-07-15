import kitchen from "@/assets/kitchen.webp";
import livingRoom from "@/assets/living-room.webp";
import bedroom from "@/assets/bedroom.webp";

export type Video = {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  views: string;
  comments: string;
};

export const defaultVideos: Video[] = [
  {
    id: "luxury-kitchen-tour",
    title: "Luxury Kitchen Tour",
    description: "A warm, inviting kitchen with brass accents and premium finishes.",
    url: "https://www.example.com/video/sample-1",
    thumbnail: kitchen,
    views: "4.8k",
    comments: "134",
  },
  {
    id: "elegant-lounge-space",
    title: "Elegant Lounge Space",
    description: "A calm lounge with layered textures, curated art and natural light.",
    url: "https://www.example.com/video/sample-2",
    thumbnail: livingRoom,
    views: "3.2k",
    comments: "92",
  },
  {
    id: "minimalist-bedroom-tour",
    title: "Minimalist Bedroom Tour",
    description: "A soft bedroom retreat defined by neutral tones and gentle proportions.",
    url: "https://www.example.com/video/sample-3",
    thumbnail: bedroom,
    views: "6.1k",
    comments: "215",
  },
];

export const VIDEOS_BLOB_PATH = "reels/reels.json";

const removedDefaultVideoIds = new Set([
  "luxury-kitchen-tour",
  "elegant-lounge-space",
  "minimalist-bedroom-tour",
]);

export function sanitizeVideos(input: unknown, maxItems = Number.MAX_SAFE_INTEGER): Video[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter((item): item is Video => {
      if (!item || typeof item !== "object") return false;
      const video = item as Video;
      return (
        typeof video.id === "string" &&
        !removedDefaultVideoIds.has(video.id) &&
        typeof video.title === "string" &&
        typeof video.description === "string" &&
        typeof video.url === "string"
      );
    })
    .map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      url: video.url,
      thumbnail:
        typeof video.thumbnail === "string" && !video.thumbnail.startsWith("data:")
          ? video.thumbnail
          : undefined,
      views: typeof video.views === "string" ? video.views : "0",
      comments: typeof video.comments === "string" ? video.comments : "0",
    }))
    .slice(0, maxItems);
}
