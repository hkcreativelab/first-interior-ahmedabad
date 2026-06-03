import { put } from "@vercel/blob";

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

type PosterBody = {
  dataUrl?: string;
  reelId?: string;
};

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
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
  response.setHeader?.("Content-Type", "application/json; charset=utf-8");
  response.end?.(JSON.stringify(body));
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid poster image.");
  }

  const contentType = match[1] === "image/jpg" ? "image/jpeg" : match[1];
  const extension = contentType.split("/")[1].replace("jpeg", "jpg");

  return {
    contentType,
    extension,
    buffer: Buffer.from(match[2], "base64"),
  };
}

export default async function handler(request: NodeRequest, response?: NodeResponse) {
  if (request.method !== "POST") {
    if (response) {
      response.statusCode = 405;
      response.setHeader?.("Allow", "POST");
      response.setHeader?.("Content-Type", "text/plain; charset=utf-8");
      response.end?.("Method not allowed");
      return;
    }

    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "POST" },
    });
  }

  try {
    const token = getBlobToken();
    if (!token) {
      throw new Error("BLOB_READ_WRITE_TOKEN is missing");
    }

    const body = (await readJsonBody(request)) as PosterBody;
    if (!body?.dataUrl || !body.reelId) {
      throw new Error("Poster image and reel ID are required.");
    }

    const poster = parseDataUrl(body.dataUrl);
    const blob = await put(`reels/posters/${body.reelId}.${poster.extension}`, poster.buffer, {
      access: "public",
      contentType: poster.contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
      token,
    });

    if (response) {
      sendJson(response, 200, { url: blob.url });
      return;
    }

    return new Response(JSON.stringify({ url: blob.url }), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    console.error("Poster upload failed", error);
    if (response) {
      sendJson(response, 500, { error: "Could not upload poster image" });
      return;
    }

    return new Response(JSON.stringify({ error: "Could not upload poster image" }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}
