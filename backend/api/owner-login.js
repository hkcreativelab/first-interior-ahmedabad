import { get } from "@vercel/blob";
const USERS_BLOB_PATH = "owner-users/users.json";
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
        return typeof request.body === "string" ? JSON.parse(request.body) : request.body;
    }
    if (typeof request.on !== "function")
        return undefined;
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
function normalizeUsers(input) {
    if (!Array.isArray(input))
        return [];
    return input
        .filter((item) => {
        if (!item || typeof item !== "object")
            return false;
        const user = item;
        return (typeof user.username === "string" &&
            typeof user.password === "string" &&
            typeof user.createdAt === "string");
    })
        .map((user) => ({
        username: user.username,
        password: user.password,
        createdAt: user.createdAt,
    }));
}
async function readStoredUsers() {
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
            const parsed = (await new Response(result.stream).json());
            return normalizeUsers(parsed);
        }
    }
    catch (error) {
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
        const body = (await readJsonBody(request));
        if (!body?.username || !body.password) {
            throw new Error("Username and password are required.");
        }
        const users = await readStoredUsers();
        const matchedUser = users.find((user) => user.username === body.username && user.password === body.password);
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
    }
    catch (error) {
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
