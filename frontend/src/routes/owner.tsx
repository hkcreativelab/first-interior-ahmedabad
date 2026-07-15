import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { getApiUrl } from "@/lib/api-base";
import { sanitizeVideos, type Video } from "@/lib/videos-data";
import {
  getStoredVideos,
  isOwnerAuthenticated,
  saveStoredVideos,
  setOwnerAuthenticated,
  validateOwnerCredentials,
} from "@/lib/owner-storage";

export const Route = createFileRoute("/owner")({
  head: () => ({
    meta: [
      { title: "Owner Portal — First Interiors Ahmedabad" },
      {
        name: "description",
        content:
          "Owner portal for First Interiors to add, edit and delete videos with secure login.",
      },
    ],
  }),
  component: OwnerPortalPage,
});

const OWNER_LOGIN_API = "/api/owner-login";
const VIDEOS_API = "/api/videos";
const POSTER_API = "/api/video-poster";
const MAX_POSTER_SIZE = 1200;
const POSTER_QUALITY = 0.82;

function resizePosterImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const scale = Math.min(1, MAX_POSTER_SIZE / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Poster image could not be processed."));
        return;
      }

      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", POSTER_QUALITY));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Poster image could not be loaded."));
    };

    image.src = objectUrl;
  });
}

function OwnerPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingPoster, setIsProcessingPoster] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    url: "",
    thumbnail: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isOwnerAuthenticated()) {
      setIsAuthenticated(true);
    }

    void loadVideos();
  }, []);

  const hasVideos = useMemo(() => videos.length > 0, [videos]);

  async function loadVideos() {
    try {
      if (!isRemoteApiAvailable()) {
        throw new Error("Local fallback mode");
      }

      const response = await fetch(getApiUrl(`${VIDEOS_API}?fresh=${Date.now()}`), {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to load videos");
      const nextVideos = sanitizeVideos(await response.json());
      setVideos(nextVideos);
      saveStoredVideos(nextVideos);
    } catch {
      setVideos(getStoredVideos());
    }
  }

  async function saveVideos(nextVideos: Video[]) {
    setIsSaving(true);
    try {
      if (!isRemoteApiAvailable()) {
        const sanitizedVideos = sanitizeVideos(nextVideos);
        saveStoredVideos(sanitizedVideos);
        setVideos(sanitizedVideos);
        return true;
      }

      const response = await fetch(getApiUrl(VIDEOS_API), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nextVideos),
      });
      if (!response.ok) {
        throw new Error("Failed to save videos");
      }
      const savedVideos = sanitizeVideos(await response.json());
      saveStoredVideos(savedVideos);
      setVideos(savedVideos);
      return true;
    } catch {
      const fallbackVideos = sanitizeVideos(nextVideos);
      saveStoredVideos(fallbackVideos);
      setVideos(fallbackVideos);
      setMessage("Saved locally in this browser. The shared remote storage is unavailable.");
      return true;
    } finally {
      setIsSaving(false);
    }
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setMessage("Username and password are required.");
      return;
    }

    try {
      if (!isRemoteApiAvailable()) {
        if (!validateOwnerCredentials(usernameInput, passwordInput)) {
          setMessage("Invalid credentials. Please try again.");
          return;
        }

        setIsAuthenticated(true);
        setOwnerAuthenticated(true);
        setMessage("Access granted. You can add or delete videos now.");
        setUsernameInput("");
        setPasswordInput("");
        return;
      }

      const response = await fetch(getApiUrl(OWNER_LOGIN_API), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput.trim(),
        }),
      });

      if (!response.ok) {
        setMessage("Invalid credentials. Please try again.");
        return;
      }

      setIsAuthenticated(true);
      setOwnerAuthenticated(true);
      setMessage("Access granted. You can add or delete videos now.");
      setUsernameInput("");
      setPasswordInput("");
    } catch {
      setMessage("Could not authenticate. Please try again.");
    }
  };

  async function uploadPoster(videoId: string, dataUrl: string) {
    if (!dataUrl.startsWith("data:")) {
      return dataUrl;
    }

    const response = await fetch(getApiUrl(POSTER_API), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoId, dataUrl }),
    });

    if (!response.ok) {
      throw new Error("Failed to upload poster image");
    }

    const body = (await response.json()) as { url?: string };
    if (!body.url) {
      throw new Error("Poster upload did not return a URL");
    }

    return body.url;
  }

  const handleThumbnailChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingPoster(true);
    setMessage("Preparing poster image...");

    try {
      const resizedPoster = await resizePosterImage(file);
      setFormState((prev) => ({ ...prev, thumbnail: resizedPoster }));
      setMessage("Poster image ready.");
    } catch {
      setFormState((prev) => ({ ...prev, thumbnail: "" }));
      setMessage("Poster image could not be prepared. Please choose another image.");
    } finally {
      setIsProcessingPoster(false);
    }
  };

  const handleAddVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.title.trim() || !formState.url.trim() || !formState.thumbnail) {
      setMessage("Title, URL and poster image are required to add a video.");
      return;
    }

    const videoId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setIsSaving(true);

    let posterUrl: string;
    try {
      posterUrl = await uploadPoster(videoId, formState.thumbnail);
    } catch {
      setIsSaving(false);
      setMessage("Could not upload poster image. Please try a smaller image.");
      return;
    }

    const nextVideos = [
      {
        id: videoId,
        title: formState.title.trim(),
        description: formState.description.trim(),
        url: formState.url.trim(),
        thumbnail: posterUrl,
        views: "0",
        comments: "0",
      },
      ...videos,
    ];

    const saved = await saveVideos(nextVideos);
    if (!saved) return;
    setFormState({ title: "", description: "", url: "", thumbnail: "" });
    setMessage("Video saved successfully.");
  };

  const handleDelete = async (id: string) => {
    const saved = await saveVideos(videos.filter((video) => video.id !== id));
    if (!saved) return;
    setMessage("Video deleted.");
  };


  return (
    <div className="relative min-h-screen bg-background text-ink">
      <Nav />
      <main className="relative mx-auto flex min-h-screen w-full items-center justify-center px-4 py-12 sm:px-6 sm:py-16 md:py-24 overflow-x-hidden">
        <div className="absolute inset-0 bg-ink/10" />
        <div className="relative z-10 w-full max-w-6xl rounded-lg sm:rounded-2xl md:rounded-[2rem] border border-border bg-cream/95 p-4 shadow-[0_35px_120px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-6 md:p-10 overflow-hidden">
          <div className="grid gap-6 sm:gap-8 md:gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-lg sm:rounded-2xl md:rounded-[1.75rem] border border-border bg-forest px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 text-cream shadow-[0_20px_80px_rgba(15,23,42,0.18)]">
              <p className="text-xs uppercase tracking-[0.35em] text-sand/80">Owner portal</p>
              <h1 className="mt-3 sm:mt-4 md:mt-6 text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
                Secure admin access
              </h1>
              <p className="mt-3 sm:mt-4 md:mt-5 text-xs sm:text-sm leading-relaxed text-sand/80">
                This portal is reserved for the First Interiors team. Sign in to manage the public video
                collection and keep content fresh.
              </p>
              <div className="mt-6 sm:mt-7 md:mt-8 rounded-lg sm:rounded-xl md:rounded-[1.5rem] bg-ink/10 p-4 sm:p-5 md:p-6 text-xs sm:text-sm text-cream/80">
                <p className="font-semibold text-cream text-sm sm:text-base">Portal features</p>
                <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-ink/70">
                  <li>• Add new video entries</li>
                  <li>• Delete outdated videos</li>
                  <li>• Review current video count</li>
                  <li>• Keep published content updated</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {!isAuthenticated ? (
                <div className="rounded-lg sm:rounded-2xl md:rounded-[1.75rem] border border-border bg-cream p-4 sm:p-6 md:p-8 shadow-sm md:p-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl md:rounded-3xl bg-cream/80 p-4 sm:p-5 text-ink">
                    <span className="inline-flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full bg-forest text-cream flex-shrink-0 text-lg sm:text-base">
                      🔒
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-ink/60">Owner login</p>
                      <p className="text-base sm:text-lg font-semibold text-ink">
                        Enter your owner credentials to unlock the portal.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={handleLogin}
                    className="mt-6 sm:mt-7 md:mt-8 space-y-4 sm:space-y-5"
                  >
                    <label className="block text-xs sm:text-sm font-medium text-ink">
                      Username
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(event) => setUsernameInput(event.target.value)}
                        className="mt-2 sm:mt-3 w-full rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-forest"
                        placeholder="Owner username"
                      />
                    </label>
                    <label className="block text-xs sm:text-sm font-medium text-ink">
                      Password
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(event) => setPasswordInput(event.target.value)}
                        className="mt-2 sm:mt-3 w-full rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-forest"
                        placeholder="Owner password"
                      />
                    </label>
                    {message ? <p className="text-xs sm:text-sm text-ink">{message}</p> : null}
                    <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-cream transition hover:bg-ink">
                      Unlock portal
                    </button>
                  </form>
                </div>
              ) : (
                <div className="grid gap-6 sm:gap-7 md:gap-8">
                  <div className="rounded-lg sm:rounded-2xl md:rounded-[1.75rem] border border-border bg-cream p-4 sm:p-6 md:p-8 shadow-sm md:p-10">
                    <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-ink/60">
                          Video management
                        </p>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-ink">
                          Add new video
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAuthenticated(false);
                          setOwnerAuthenticated(false);
                        }}
                        className="rounded-full border border-border bg-cream/80 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-ink transition hover:bg-cream/90"
                      >
                        Log out
                      </button>
                    </div>

                    <form
                      onSubmit={handleAddVideo}
                      className="grid gap-4 sm:gap-5 mt-6 sm:mt-7 md:mt-8"
                    >
                      <label className="block text-xs sm:text-sm text-ink">
                        Title
                        <input
                          value={formState.title}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, title: event.target.value }))
                          }
                          className="mt-2 sm:mt-3 w-full rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-forest"
                          placeholder="Modern living room video"
                        />
                      </label>

                      <label className="block text-xs sm:text-sm text-ink">
                        Description
                        <textarea
                          value={formState.description}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, description: event.target.value }))
                          }
                          className="mt-2 sm:mt-3 w-full min-h-[100px] sm:min-h-[120px] rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-forest"
                          placeholder="Optional caption for the video"
                        />
                      </label>

                      <label className="block text-xs sm:text-sm text-ink">
                        URL
                        <input
                          value={formState.url}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, url: event.target.value }))
                          }
                          className="mt-2 sm:mt-3 w-full rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-forest"
                          placeholder="https://www.example.com/video/..."
                        />
                      </label>

                      <label className="block text-xs sm:text-sm text-ink">
                        Poster image
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isSaving || isProcessingPoster}
                          onChange={handleThumbnailChange}
                          className="mt-2 sm:mt-3 w-full rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition file:rounded-full file:border-0 file:bg-forest file:px-3 sm:file:px-4 file:py-1.5 sm:file:py-2 file:text-xs sm:file:text-sm file:text-cream file:font-semibold file:transition hover:file:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </label>

                      {formState.thumbnail ? (
                        <div className="rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream p-3 sm:p-4">
                          <p className="text-xs uppercase tracking-[0.35em] text-ink/60">Preview</p>
                          <img
                            src={formState.thumbnail}
                            alt="Video poster preview"
                            className="mt-2 sm:mt-3 h-40 sm:h-48 w-full rounded-lg sm:rounded-2xl md:rounded-3xl object-cover"
                          />
                        </div>
                      ) : null}

                      <button
                        type="submit"
                        disabled={isSaving || isProcessingPoster}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-cream transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isProcessingPoster
                          ? "Preparing poster..."
                          : isSaving
                            ? "Saving..."
                            : "Add video"}
                      </button>
                    </form>
                  </div>

                  <div className="rounded-lg sm:rounded-2xl md:rounded-[1.75rem] border border-border bg-cream p-4 sm:p-6 md:p-8 shadow-sm md:p-10 overflow-hidden">
                    <div className="space-y-5 sm:space-y-6 md:space-y-8 max-w-full">
                      <div className="rounded-lg sm:rounded-2xl md:rounded-3xl bg-cream/80 p-4 sm:p-5 md:p-6 text-ink">
                        <p className="font-semibold text-sm sm:text-base text-ink">
                          Live video management
                        </p>
                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-ink/70">
                          Delete outdated entries, review the current video count, and manage
                          published content from one place.
                        </p>
                      </div>

                      <div className="rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream p-4 sm:p-5 md:p-6">
                        <p className="text-xs uppercase tracking-[0.35em] text-ink/60">
                          Video count
                        </p>
                        <p className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold text-ink">
                          {videos.length}
                        </p>
                      </div>

                      <div className="rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream p-4 sm:p-5 md:p-6 overflow-hidden">
                        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-ink/60">
                              Delete videos
                            </p>
                            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-ink/70">
                              Remove outdated entries from the public collection.
                            </p>
                          </div>
                        </div>

                        {hasVideos ? (
                          <div className="mt-4 sm:mt-5 md:mt-6 space-y-3 sm:space-y-4 max-w-full overflow-x-hidden">
                            {videos.map((video) => (
                              <div
                                key={video.id}
                                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream/50 p-3 sm:p-4 md:p-5 min-w-0"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-xs sm:text-sm text-ink truncate">
                                    {video.title}
                                  </p>
                                  <p className="text-xs sm:text-sm text-ink/70 truncate mt-1">
                                    {video.url}
                                  </p>
                                </div>
                                <button
                                  disabled={isSaving}
                                  type="button"
                                  onClick={() => handleDelete(video.id)}
                                  className="w-full sm:w-auto rounded-full border border-border bg-cream/80 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-ink transition hover:bg-cream/90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {isSaving ? "Saving..." : "Delete"}
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-ink/70">
                            No videos have been added yet.
                          </p>
                        )}
                      </div>

                      <div className="space-y-3 sm:space-y-4 md:space-y-5">
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-ink">
                            Owner management
                          </p>
                          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-ink/70">
                            Manage videos directly from the owner portal.
                          </p>
                        </div>
                      </div>

                      {message ? <p className="text-xs sm:text-sm text-forest">{message}</p> : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
