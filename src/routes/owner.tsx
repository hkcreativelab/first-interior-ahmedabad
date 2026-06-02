import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export const Route = createFileRoute("/owner")({
  head: () => ({
    meta: [
      { title: "Owner Portal — First Interiors Ahmedabad" },
      {
        name: "description",
        content:
          "Owner portal for First Interiors to add, edit and delete reels with passcode access.",
      },
    ],
  }),
  component: OwnerPortalPage,
});

const STORAGE_KEY = "first-interiors-reels";
const PASSCODE_KEY = "first-interiors-owner-passcode";
const DEFAULT_PASSCODE = "owner240";

type ReelItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
};

function OwnerPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [message, setMessage] = useState("");
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [savedPasscode, setSavedPasscode] = useState(DEFAULT_PASSCODE);
  const [newPasscode, setNewPasscode] = useState("");
  const [currentPasscode, setCurrentPasscode] = useState("");
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    url: "",
    thumbnail: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedPass = window.localStorage.getItem(PASSCODE_KEY);
    const initialPasscode = storedPass || DEFAULT_PASSCODE;
    if (!storedPass) {
      window.localStorage.setItem(PASSCODE_KEY, initialPasscode);
    }
    setSavedPasscode(initialPasscode);

    const storedReels = window.localStorage.getItem(STORAGE_KEY);
    setReels(storedReels ? JSON.parse(storedReels) : []);

    if (window.sessionStorage.getItem("first-interiors-owner-auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const hasReels = useMemo(() => reels.length > 0, [reels]);

  const saveReels = (nextReels: ReelItem[]) => {
    setReels(nextReels);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReels));
    }
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passcodeInput.trim() === savedPasscode) {
      setIsAuthenticated(true);
      setMessage("Access granted. You can add or delete reels now.");
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("first-interiors-owner-auth", "true");
      }
      setPasscodeInput("");
      return;
    }
    setMessage("Passcode is incorrect. Please try again.");
  };

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormState((prev) => ({ ...prev, thumbnail: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddReel = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.title.trim() || !formState.url.trim() || !formState.thumbnail) {
      setMessage("Title, URL and poster image are required to add a reel.");
      return;
    }

    const nextReels = [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: formState.title.trim(),
        description: formState.description.trim(),
        url: formState.url.trim(),
        thumbnail: formState.thumbnail,
      },
      ...reels,
    ];

    saveReels(nextReels);
    setFormState({ title: "", description: "", url: "", thumbnail: "" });
    setMessage("Reel saved successfully.");
  };

  const handleDelete = (id: string) => {
    saveReels(reels.filter((reel) => reel.id !== id));
    setMessage("Reel deleted.");
  };

  const handleChangePasscode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentPasscode.trim() !== savedPasscode) {
      setMessage("Current passcode does not match.");
      return;
    }
    if (!newPasscode.trim()) {
      setMessage("Enter a new passcode to update.");
      return;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PASSCODE_KEY, newPasscode);
    }
    setSavedPasscode(newPasscode);
    setCurrentPasscode("");
    setNewPasscode("");
    setMessage("Passcode updated successfully.");
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
              <h1 className="mt-3 sm:mt-4 md:mt-6 text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">Secure admin access</h1>
              <p className="mt-3 sm:mt-4 md:mt-5 text-xs sm:text-sm leading-relaxed text-sand/80">
                This portal is reserved for the First Interiors team. Enter your passcode to manage
                the public reels collection and update the owner access code.
              </p>
              <div className="mt-6 sm:mt-7 md:mt-8 rounded-lg sm:rounded-xl md:rounded-[1.5rem] bg-ink/10 p-4 sm:p-5 md:p-6 text-xs sm:text-sm text-cream/80">
                <p className="font-semibold text-cream text-sm sm:text-base">Portal features</p>
                <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-ink/70">
                  <li>• Add new reel entries</li>
                  <li>• Delete outdated videos</li>
                  <li>• Change the secure passcode</li>
                  <li>• Review current reel count</li>
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
                      <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
                        Owner login
                      </p>
                      <p className="text-base sm:text-lg font-semibold text-ink">
                        Enter passcode to unlock the portal.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="mt-6 sm:mt-7 md:mt-8 space-y-4 sm:space-y-5">
                    <label className="block text-xs sm:text-sm font-medium text-ink">
                      Passcode
                      <input
                        type="password"
                        value={passcodeInput}
                        onChange={(event) => setPasscodeInput(event.target.value)}
                        className="mt-2 sm:mt-3 w-full rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-forest"
                        placeholder="Enter passcode"
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
                          Reel management
                        </p>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-ink">Add new reel</h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAuthenticated(false);
                          if (typeof window !== "undefined") {
                            window.sessionStorage.removeItem("first-interiors-owner-auth");
                          }
                        }}
                        className="rounded-full border border-border bg-cream/80 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-ink transition hover:bg-cream/90"
                      >
                        Log out
                      </button>
                    </div>

                    <form onSubmit={handleAddReel} className="grid gap-4 sm:gap-5 mt-6 sm:mt-7 md:mt-8">
                      <label className="block text-xs sm:text-sm text-ink">
                        Title
                        <input
                          value={formState.title}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, title: event.target.value }))
                          }
                          className="mt-2 sm:mt-3 w-full rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-forest"
                          placeholder="Modern living room reveal"
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
                          placeholder="Optional caption for the reel"
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
                          placeholder="https://www.instagram.com/reel/..."
                        />
                      </label>

                      <label className="block text-xs sm:text-sm text-ink">
                        Poster image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          className="mt-2 sm:mt-3 w-full rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition file:rounded-full file:border-0 file:bg-forest file:px-3 sm:file:px-4 file:py-1.5 sm:file:py-2 file:text-xs sm:file:text-sm file:text-cream file:font-semibold file:transition hover:file:bg-ink"
                        />
                      </label>

                      {formState.thumbnail ? (
                        <div className="rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream p-3 sm:p-4">
                          <p className="text-xs uppercase tracking-[0.35em] text-ink/60">
                            Preview
                          </p>
                          <img
                            src={formState.thumbnail}
                            alt="Reel poster preview"
                            className="mt-2 sm:mt-3 h-40 sm:h-48 w-full rounded-lg sm:rounded-2xl md:rounded-3xl object-cover"
                          />
                        </div>
                      ) : null}

                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-cream transition hover:bg-ink"
                      >
                        Add reel
                      </button>
                    </form>
                  </div>

                  <div className="rounded-lg sm:rounded-2xl md:rounded-[1.75rem] border border-border bg-cream p-4 sm:p-6 md:p-8 shadow-sm md:p-10 overflow-hidden">
                    <div className="space-y-5 sm:space-y-6 md:space-y-8 max-w-full">
                      <div className="rounded-lg sm:rounded-2xl md:rounded-3xl bg-cream/80 p-4 sm:p-5 md:p-6 text-ink">
                        <p className="font-semibold text-sm sm:text-base text-ink">Live reel management</p>
                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-ink/70">
                          Delete outdated entries, review the current reel count, and update the
                          portal passcode from one place.
                        </p>
                      </div>

                      <div className="rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream p-4 sm:p-5 md:p-6">
                        <p className="text-xs uppercase tracking-[0.35em] text-ink/60">
                          Reel count
                        </p>
                        <p className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold text-ink">{reels.length}</p>
                      </div>

                      <div className="rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream p-4 sm:p-5 md:p-6 overflow-hidden">
                        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-ink/60">
                              Delete reels
                            </p>
                            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-ink/70">
                              Remove outdated entries from the public collection.
                            </p>
                          </div>
                        </div>

                        {hasReels ? (
                          <div className="mt-4 sm:mt-5 md:mt-6 space-y-3 sm:space-y-4 max-w-full overflow-x-hidden">
                            {reels.map((reel) => (
                              <div
                                key={reel.id}
                                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream/50 p-3 sm:p-4 md:p-5 min-w-0"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-xs sm:text-sm text-ink truncate">{reel.title}</p>
                                  <p className="text-xs sm:text-sm text-ink/70 truncate mt-1">{reel.url}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(reel.id)}
                                  className="w-full sm:w-auto rounded-full border border-border bg-cream/80 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-ink transition hover:bg-cream/90"
                                >
                                  Delete
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-ink/70">
                            No reels have been added yet.
                          </p>
                        )}
                      </div>

                      <div className="space-y-3 sm:space-y-4 md:space-y-5">
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-ink">Change passcode</p>
                          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-ink/70">
                            Update the password for owner access.
                          </p>
                        </div>

                        <form onSubmit={handleChangePasscode} className="grid gap-3 sm:gap-4 md:gap-5">
                          <input
                            type="password"
                            value={currentPasscode}
                            onChange={(event) => setCurrentPasscode(event.target.value)}
                            placeholder="Current passcode"
                            className="w-full rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-forest"
                          />
                          <input
                            type="password"
                            value={newPasscode}
                            onChange={(event) => setNewPasscode(event.target.value)}
                            placeholder="New passcode"
                            className="w-full rounded-lg sm:rounded-2xl md:rounded-3xl border border-border bg-cream px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-forest"
                          />
                          <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-cream transition hover:bg-ink"
                          >
                            Update passcode
                          </button>
                        </form>
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
