const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";

export function getApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_URL}${normalizedPath}`;
}

export function isRemoteApiAvailable() {
  return BACKEND_URL !== "http://localhost:3000";
}
