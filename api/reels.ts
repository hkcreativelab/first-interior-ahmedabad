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

type BlobListEntry = {
  url: string;
  pathname: string;
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
const REELS_STATE_PREFIX = "reels/states/";

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

function getStoreIdFromToken(token: string) {
  return token.split("_")[3];
}

async function listFreshStateBlobs(token: string): Promise<BlobListEntry[]> {
  const storeId = getStoreIdFromToken(token);
  const requestId = `${storeId}:${Date.now()}:${Math.random().toString(16).slice(2)}`;
  const params = new URLSearchParams({
    prefix: REELS_STATE_PREFIX,
    limit: "1000",
    fresh: Date.now().toString(),
  });

  const response = await fetch(`https://vercel.com/api/blob?${params.toString()}`, {
    cache: "no-store",
    headers: {
      authorization: `Bearer ${token}`,
      "cache-control": "no-cache",
      pragma: "no-cache",
      "x-api-blob-request-attempt": "0",
      "x-api-blob-request-id": requestId,
      "x-vercel-blob-store-id": storeId,
      "x-api-version": "12",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to list reel states");
  }

  const body = (await response.json()) as { blobs?: BlobListEntry[] };
  return body.blobs ?? [];
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

async function readStoredReels(): Promise<{ reels: Reel[]; source: string }> {
  const token = getBlobToken();
  if (!token) {
    return { reels: defaultReels, source: "defaults:no-token" };
  }

  try {
    const blobs = await listFreshStateBlobs(token);

    const blob = blobs.sort((left, right) => right.pathname.localeCompare(left.pathname))[0];

    if (blob) {
      const response = await fetch(blob.url, {
        cache: "no-store",
      });
      if (response.ok) {
        const parsed = (await response.json()) as unknown;
        return { reels: normalizeReels(parsed), source: blob.pathname };
      }
    }
  } catch (error) {
    console.error("Failed to read versioned reels", error);
  }

  try {
    const legacyResult = await get(REELS_BLOB_PATH, {
      access: "public",
      token,
    });

    if (legacyResult?.statusCode === 200 && legacyResult.stream) {
      const parsed = (await new Response(legacyResult.stream).json()) as unknown;
      const legacyReels = normalizeReels(parsed);
      await writeStoredReels(legacyReels);
      return { reels: legacyReels, source: REELS_BLOB_PATH };
    }
  } catch (error) {
    console.error("Failed to migrate legacy public reels", error);
  }

  return { reels: defaultReels, source: "defaults:fallback" };
}

async function writeStoredReels(reels: Reel[]): Promise<Reel[]> {
  const token = getBlobToken();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing");
  }

  const normalizedReels = normalizeReels(reels);
  const statePath = `${REELS_STATE_PREFIX}${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}.json`;

  await put(statePath, JSON.stringify(normalizedReels), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: false,
    cacheControlMaxAge: 60,
    token,
  });

  return normalizedReels;
}

type NodeRequest = {
  method?: string;
  body?: unknown;
  on?: (event: "data" | "end" | "error", listener: (...args: unknown[]) => void) => void;
};

type NodeResponse = {
  statusCode?: number;
  setHeader?: (name: string, value: string) => void;
  end?: (chunk?: string) => void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function setCorsHeaders(response?: NodeResponse) {
  Object.entries(corsHeaders).forEach(([name, value]) => {
    response?.setHeader?.(name, value);
  });
}

async function readJsonBody(request: NodeRequest): Promise<unknown> {
  if (request.body !== undefined) {
    if (typeof request.body === "string") {
      return JSON.parse(request.body);
    }

    return request.body;
  }

  if (typeof request.on !== "function") {
    return undefined;
  }

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    request.on?.("data", (chunk: unknown) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string));
    });
    request.on?.("end", () => resolve());
    request.on?.("error", (error: unknown) => reject(error));
  });

  const rawBody = Buffer.concat(chunks).toString("utf8");
  if (!rawBody.trim()) {
    return undefined;
  }

  return JSON.parse(rawBody);
}

function sendJson(response: NodeResponse, statusCode: number, body: unknown) {
  response.statusCode = statusCode;
  setCorsHeaders(response);
  response.setHeader?.("Content-Type", "application/json; charset=utf-8");
  response.setHeader?.("Cache-Control", "no-store, max-age=0");
  response.end?.(JSON.stringify(body));
}

function sendReels(response: NodeResponse, reels: Reel[], source: string) {
  response.statusCode = 200;
  setCorsHeaders(response);
  response.setHeader?.("Content-Type", "application/json; charset=utf-8");
  response.setHeader?.("Cache-Control", "no-store, max-age=0");
  response.setHeader?.("X-Reels-Source", source);
  response.end?.(JSON.stringify(reels));
}

export default async function handler(request: NodeRequest, response?: NodeResponse) {
  try {
    if (request.method === "OPTIONS") {
      if (response) {
        response.statusCode = 204;
        setCorsHeaders(response);
        response.end?.();
        return;
      }
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method === "GET") {
      const { reels, source } = await readStoredReels();
      if (response) {
        sendReels(response, reels, source);
        return;
      }
      return new Response(JSON.stringify(reels), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store, max-age=0",
          "X-Reels-Source": source,
        },
      });
    }

    if (request.method === "POST") {
      const body = (await readJsonBody(request)) as Reel[];
      const savedReels = await writeStoredReels(body);
      if (response) {
        sendJson(response, 200, savedReels);
        return;
      }
      return new Response(JSON.stringify(savedReels), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
      });
    }

    if (response) {
      response.statusCode = 405;
      setCorsHeaders(response);
      response.setHeader?.("Allow", "GET, POST");
      response.setHeader?.("Content-Type", "text/plain; charset=utf-8");
      response.end?.("Method not allowed");
      return;
    }

    return new Response("Method not allowed", {
      status: 405,
      headers: { ...corsHeaders, Allow: "GET, POST" },
    });
  } catch (error) {
    console.error("Reels API failed", error);
    if (request.method === "POST") {
      if (response) {
        sendJson(response, 500, { error: "Could not save reels" });
        return;
      }
      return new Response(JSON.stringify({ error: "Could not save reels" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
      });
    }

    if (response) {
      sendJson(response, 200, defaultReels);
      return;
    }
    return new Response(JSON.stringify(defaultReels), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
    });
  }
}
