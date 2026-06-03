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
