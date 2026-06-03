import { get, put } from "@vercel/blob";

type Reel = {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  views: string;
  comments: string;
};

const defaultReels: Reel[] = [
  {
    id: "luxury-kitchen-tour",
    title: "Luxury Kitchen Tour",
    description: "A warm, inviting kitchen with brass accents and premium finishes.",
    url: "https://www.instagram.com/reel/sample-1",
    views: "4.8k",
    comments: "134",
  },
  {
    id: "elegant-lounge-space",
    title: "Elegant Lounge Space",
    description: "A calm lounge with layered textures, curated art and natural light.",
    url: "https://www.instagram.com/reel/sample-2",
    views: "3.2k",
    comments: "92",
  },
  {
    id: "minimalist-bedroom-tour",
    title: "Minimalist Bedroom Tour",
    description: "A soft bedroom retreat defined by neutral tones and gentle proportions.",
    url: "https://www.instagram.com/reel/sample-3",
    views: "6.1k",
    comments: "215",
  },
];

const REELS_BLOB_PATH = "reels/reels.json";

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

function normalizeReels(input: unknown): Reel[] {
  if (!Array.isArray(input)) {
    return defaultReels;
  }

  return input
    .filter((item): item is Reel => {
      if (!item || typeof item !== "object") return false;
      const reel = item as Reel;
      return (
        typeof reel.id === "string" &&
        typeof reel.title === "string" &&
        typeof reel.description === "string" &&
        typeof reel.url === "string"
      );
    })
    .map((reel) => ({
      ...reel,
      thumbnail: typeof reel.thumbnail === "string" ? reel.thumbnail : undefined,
      views: typeof reel.views === "string" ? reel.views : "0",
      comments: typeof reel.comments === "string" ? reel.comments : "0",
    }));
}

async function readStoredReels(): Promise<Reel[]> {
  const token = getBlobToken();
  if (!token) {
    return defaultReels;
  }

  try {
    const result = await get(REELS_BLOB_PATH, {
      access: "public",
      token,
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return defaultReels;
    }

    const parsed = (await new Response(result.stream).json()) as unknown;
    const reels = normalizeReels(parsed);
    return reels.length > 0 ? reels : defaultReels;
  } catch (error) {
    console.error("Failed to read shared reels", error);
    return defaultReels;
  }
}

async function writeStoredReels(reels: Reel[]): Promise<Reel[]> {
  const token = getBlobToken();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing");
  }

  const normalizedReels = normalizeReels(reels);

  await put(REELS_BLOB_PATH, JSON.stringify(normalizedReels), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  });

  return normalizedReels.length > 0 ? normalizedReels : defaultReels;
}

export default async function handler(request: Request) {
  try {
    if (request.method === "GET") {
      return Response.json(await readStoredReels());
    }

    if (request.method === "POST") {
      const body = (await request.json()) as Reel[];
      const savedReels = await writeStoredReels(body);
      return Response.json(savedReels);
    }

    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, POST" },
    });
  } catch (error) {
    console.error("Reels API failed", error);
    return Response.json(defaultReels, { status: 200 });
  }
}
