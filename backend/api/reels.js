import { get, put } from "@vercel/blob";
const VIDEOS_BLOB_PATH = "reels/reels.json";
const removedDefaultVideoIds = new Set([
    "luxury-kitchen-tour",
    "elegant-lounge-space",
    "minimalist-bedroom-tour",
]);
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};
function getBlobToken() {
    return process.env.BLOB_READ_WRITE_TOKEN;
}
function setCorsHeaders(response) {
    Object.entries(corsHeaders).forEach(([name, value]) => {
        response?.setHeader?.(name, value);
    });
}
function normalizeVideos(input) {
    if (!Array.isArray(input)) {
        return [];
    }
    return input
        .filter((item) => {
        if (!item || typeof item !== "object")
            return false;
        const video = item;
        return (typeof video.id === "string" &&
            !removedDefaultVideoIds.has(video.id) &&
            typeof video.title === "string" &&
            typeof video.description === "string" &&
            typeof video.url === "string");
    })
        .map((video) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        url: video.url,
        thumbnail: typeof video.thumbnail === "string" && !video.thumbnail.startsWith("data:")
            ? video.thumbnail
            : undefined,
        views: typeof video.views === "string" ? video.views : "0",
        comments: typeof video.comments === "string" ? video.comments : "0",
    }))
        .slice(0, 4);
}
async function readStoredVideos() {
    const token = getBlobToken();
    if (!token) {
        throw new Error("BLOB_READ_WRITE_TOKEN is missing");
    }
    try {
        const result = await get(VIDEOS_BLOB_PATH, {
            access: "public",
            token,
        });
        if (result?.statusCode === 200 && result.stream) {
            const parsed = (await new Response(result.stream).json());
            return normalizeVideos(parsed);
        }
    }
    catch (error) {
        console.error("Failed to read videos blob", error);
    }
    return [];
}
async function writeStoredVideos(videos) {
    const token = getBlobToken();
    if (!token) {
        throw new Error("BLOB_READ_WRITE_TOKEN is missing");
    }
    const normalizedVideos = normalizeVideos(videos);
    await put(VIDEOS_BLOB_PATH, JSON.stringify(normalizedVideos), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 0,
        token,
    });
    return normalizedVideos;
}
async function readJsonBody(request) {
    if (request.body !== undefined) {
        return typeof request.body === "string" ? JSON.parse(request.body) : request.body;
    }
    if (typeof request.on !== "function") {
        return undefined;
    }
    const chunks = [];
    await new Promise((resolve, reject) => {
        request.on?.("data", (chunk) => {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        request.on?.("end", () => resolve());
        request.on?.("error", (error) => reject(error));
    });
    const rawBody = Buffer.concat(chunks).toString("utf8");
    return rawBody.trim() ? JSON.parse(rawBody) : undefined;
}
function sendJson(response, statusCode, body) {
    response.statusCode = statusCode;
    setCorsHeaders(response);
    response.setHeader?.("Content-Type", "application/json; charset=utf-8");
    response.setHeader?.("Cache-Control", "no-store, max-age=0");
    response.end?.(JSON.stringify(body));
}
export default async function handler(request, response) {
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
            const videos = await readStoredVideos();
            if (response) {
                sendJson(response, 200, videos);
                return;
            }
            return new Response(JSON.stringify(videos), {
                status: 200,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json; charset=utf-8",
                    "Cache-Control": "no-store, max-age=0",
                },
            });
        }
        if (request.method === "POST") {
            const savedVideos = await writeStoredVideos(await readJsonBody(request));
            if (response) {
                sendJson(response, 200, savedVideos);
                return;
            }
            return new Response(JSON.stringify(savedVideos), {
                status: 200,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json; charset=utf-8",
                    "Cache-Control": "no-store, max-age=0",
                },
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
    }
    catch (error) {
        console.error("Videos API failed", error);
        const errorBody = {
            error: request.method === "POST" ? "Could not save videos" : "Could not load videos",
        };
        if (response) {
            sendJson(response, 500, errorBody);
            return;
        }
        return new Response(JSON.stringify(errorBody), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
        });
    }
}
