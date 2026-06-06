import { isHostingerDomain } from "./hostinger-links";

const VERCEL_API_ORIGIN = "https://first-interior.vercel.app";

export function getApiUrl(path: string) {
  if (typeof window === "undefined") {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return isHostingerDomain() ? `${VERCEL_API_ORIGIN}${normalizedPath}` : normalizedPath;
}
