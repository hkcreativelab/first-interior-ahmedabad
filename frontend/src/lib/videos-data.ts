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
    id: "purchased-tour-1",
    title: "Project Walkthrough 1",
    description:
      "A walkthrough of the recently completed living and dining interiors, showing spatial flow and finish details.",
    url: "/videos/video-1.mp4",
    thumbnail: kitchen,
    views: "1.2k",
    comments: "18",
  },
  {
    id: "purchased-tour-2",
    title: "Project Walkthrough 2",
    description:
      "A second view of the completed villa interiors, highlighting material texture and ambient lighting.",
    url: "/videos/video-2.mp4",
    thumbnail: livingRoom,
    views: "870",
    comments: "11",
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
