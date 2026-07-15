import { get } from "@vercel/blob";

type OwnerUser = {
  username: string;
  password: string;
  createdAt: string;
};

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

const USERS_BLOB_PATH = "owner-users/users.json";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function setCorsHeaders(response?: NodeResponse) {
  Object.entries(corsHeaders).forEach(([name, value]) => {
    response?.setHeader?.(name, value);
  });
}

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

async function readJsonBody(request: NodeRequest): Promise<unknown> {
  if (request.body !== undefined) {
    return typeof request.body === "string" ? JSON.parse(request.body) : request.body;
  }

  if (typeof request.on !== "function") return undefined;

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
  response.end?.(JSON.stringify(body));
}

function normalizeUsers(input: unknown): OwnerUser[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter((item): item is OwnerUser => {
      if (!item || typeof item !== "object") return false;
      const user = item as OwnerUser;
      return (
        typeof user.username === "string" &&
        typeof user.password === "string" &&
        typeof user.createdAt === "string"
      );
    })
    .map((user) => ({
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
    }));
}

async function readStoredUsers(): Promise<OwnerUser[]> {
  const token = getBlobToken();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing");
  }

  try {
    const result = await get(USERS_BLOB_PATH, {
      access: "public",
      token,
    });

    if (result?.statusCode === 200 && result.stream) {
      const parsed = (await new Response(result.stream).json()) as unknown;
      return normalizeUsers(parsed);
    }
  } catch (error) {
    console.error("Failed to read owner users blob", error);
  }

  return [
    {
      username: "owner",
      password: "owner240",
      createdAt: new Date().toISOString(),
    },
  ];
}

export default async function handler(request: NodeRequest, response?: NodeResponse) {
  if (request.method === "OPTIONS") {
    if (response) {
      response.statusCode = 204;
      setCorsHeaders(response);
      response.end?.();
      return;
    }

    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    if (response) {
      response.statusCode = 405;
      setCorsHeaders(response);
      response.setHeader?.("Allow", "POST");
      response.setHeader?.("Content-Type", "text/plain; charset=utf-8");
      response.end?.("Method not allowed");
      return;
    }

    return new Response("Method not allowed", {
      status: 405,
      headers: { ...corsHeaders, Allow: "POST" },
    });
  }

  try {
    const body = (await readJsonBody(request)) as {
      username?: string;
      password?: string;
    } | null;

    if (!body?.username || !body.password) {
      throw new Error("Username and password are required.");
    }

    const users = await readStoredUsers();
    const matchedUser = users.find(
      (user) => user.username === body.username && user.password === body.password,
    );

    if (!matchedUser) {
      if (response) {
        sendJson(response, 401, { error: "Invalid credentials" });
        return;
      }

      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
      });
    }

    if (response) {
      sendJson(response, 200, { success: true, username: matchedUser.username });
      return;
    }

    return new Response(JSON.stringify({ success: true, username: matchedUser.username }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    console.error("Owner login failed", error);
    if (response) {
      sendJson(response, 500, { error: "Could not authenticate owner" });
      return;
    }

    return new Response(JSON.stringify({ error: "Could not authenticate owner" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
    });
  }
}
