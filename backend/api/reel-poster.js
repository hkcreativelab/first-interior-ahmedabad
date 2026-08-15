import { put } from "@vercel/blob";
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};
function setCorsHeaders(response) {
    Object.entries(corsHeaders).forEach(([name, value]) => {
        response?.setHeader?.(name, value);
    });
}
function getBlobToken() {
    return process.env.BLOB_READ_WRITE_TOKEN;
}
async function readJsonBody(request) {
    if (request.body !== undefined) {
        if (typeof request.body === "string") {
            return JSON.parse(request.body);
        }
        return request.body;
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
    if (!rawBody.trim()) {
        return undefined;
    }
    return JSON.parse(rawBody);
}
function sendJson(response, statusCode, body) {
    response.statusCode = statusCode;
    setCorsHeaders(response);
    response.setHeader?.("Content-Type", "application/json; charset=utf-8");
    response.end?.(JSON.stringify(body));
}
function parseDataUrl(dataUrl) {
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
export default async function handler(request, response) {
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
        const token = getBlobToken();
        if (!token) {
            throw new Error("BLOB_READ_WRITE_TOKEN is missing");
        }
        const body = (await readJsonBody(request));
        const videoId = body.reelId || body.videoId;
        if (!body?.dataUrl || !videoId) {
            throw new Error("Poster image and video ID are required.");
        }
        const poster = parseDataUrl(body.dataUrl);
        const blob = await put(`reels/posters/${videoId}.${poster.extension}`, poster.buffer, {
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
            headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
        });
    }
    catch (error) {
        console.error("Poster upload failed", error);
        if (response) {
            sendJson(response, 500, { error: "Could not upload poster image" });
            return;
        }
        return new Response(JSON.stringify({ error: "Could not upload poster image" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
        });
    }
}
