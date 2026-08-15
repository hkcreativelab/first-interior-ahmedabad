import kitchen from "@/assets/kitchen.webp";
import livingRoom from "@/assets/living-room.webp";
import bedroom from "@/assets/bedroom.webp";
import { sanitizeVideos, type Video } from "@/lib/videos-data";

const VIDEOS_STORAGE_KEY = "first-interiors-owner-videos";
const OWNER_AUTH_STORAGE_KEY = "first-interiors-owner-auth";

const fallbackVideos: Video[] = [
  {
    id: "hostinger-kitchen-tour",
    title: "Luxury Kitchen Tour",
    description: "A warm, inviting kitchen with brass accents and premium finishes.",
    url: "/videos/video-1.mp4",
    thumbnail: kitchen,
    views: "4.8k",
    comments: "134",
  },
  {
    id: "hostinger-lounge-space",
    title: "Elegant Lounge Space",
    description: "A calm lounge with layered textures, curated art and natural light.",
    url: "/videos/video-2.mp4",
    thumbnail: livingRoom,
    views: "3.2k",
    comments: "92",
  },
  {
    id: "hostinger-bedroom-tour",
    title: "Minimalist Bedroom Tour",
    description: "A soft bedroom retreat defined by neutral tones and gentle proportions.",
    url: "/videos/video-2.mp4",
    thumbnail: bedroom,
    views: "6.1k",
    comments: "215",
  },
];

export function getStoredVideos(): Video[] {
  if (typeof window === "undefined") {
    return fallbackVideos;
  }

  try {
    const rawValue = window.localStorage.getItem(VIDEOS_STORAGE_KEY);
    if (!rawValue) {
      return fallbackVideos;
    }

    const parsed = JSON.parse(rawValue) as unknown;
    const videos = sanitizeVideos(parsed);
    return videos.length > 0 ? videos : fallbackVideos;
  } catch {
    return fallbackVideos;
  }
}

export function saveStoredVideos(videos: Video[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
}

export function clearStoredVideos() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(VIDEOS_STORAGE_KEY);
}

export function isOwnerAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(OWNER_AUTH_STORAGE_KEY) === "true";
}

export function setOwnerAuthenticated(value: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  if (value) {
    window.sessionStorage.setItem(OWNER_AUTH_STORAGE_KEY, "true");
    return;
  }

  window.sessionStorage.removeItem(OWNER_AUTH_STORAGE_KEY);
}

// NOTE: Credential validation is handled server-side. Do not store or check owner
// credentials in the frontend. This file only manages local persistence and
// fallback video storage.
