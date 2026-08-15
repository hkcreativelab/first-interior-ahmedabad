import { get, put } from "@vercel/blob";
const USERS_BLOB_PATH = "owner-users/users.json";
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
async function writeStoredUsers(users) {
    const token = getBlobToken();
    if (!token) {
        throw new Error("BLOB_READ_WRITE_TOKEN is missing");
    }
    const normalizedUsers = normalizeUsers(users);
    await put(USERS_BLOB_PATH, JSON.stringify(normalizedUsers), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 0,
        token,
    });
    return normalizedUsers;
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
            const users = await readStoredUsers();
            const publicUsers = users.map((user) => ({ username: user.username, createdAt: user.createdAt }));
            if (response) {
                sendJson(response, 200, publicUsers);
                return;
            }
            return new Response(JSON.stringify(publicUsers), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
            });
        }
        if (request.method === "POST") {
            const body = (await readJsonBody(request));
            if (!body?.action || !body.adminUsername || !body.adminPassword) {
                throw new Error("Action and admin credentials are required.");
            }
            const users = await readStoredUsers();
            const adminUser = users.find((user) => user.username === body.adminUsername && user.password === body.adminPassword);
            if (!adminUser) {
                if (response) {
                    sendJson(response, 401, { error: "Admin credentials are invalid." });
                    return;
                }
                return new Response(JSON.stringify({ error: "Admin credentials are invalid." }), {
                    status: 401,
                    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
                });
            }
            if (body.action === "add") {
                if (!body.username || !body.password) {
                    throw new Error("New username and password are required.");
                }
                if (users.some((user) => user.username === body.username)) {
                    if (response) {
                        sendJson(response, 409, { error: "User already exists." });
                        return;
                    }
                    return new Response(JSON.stringify({ error: "User already exists." }), {
                        status: 409,
                        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
                    });
                }
                const nextUsers = [
                    ...users,
                    {
                        username: body.username,
                        password: body.password,
                        createdAt: new Date().toISOString(),
                    },
                ];
                const savedUsers = await writeStoredUsers(nextUsers);
                const publicUsers = savedUsers.map((user) => ({ username: user.username, createdAt: user.createdAt }));
                if (response) {
                    sendJson(response, 200, publicUsers);
                    return;
                }
                return new Response(JSON.stringify(publicUsers), {
                    status: 200,
                    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
                });
            }
            if (response) {
                sendJson(response, 400, { error: "Unsupported action." });
                return;
            }
            return new Response(JSON.stringify({ error: "Unsupported action." }), {
                status: 400,
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
    }
    catch (error) {
        console.error("Owner users API failed", error);
        const status = error instanceof Error && error.message.includes("required") ? 400 : 500;
        const errorBody = { error: error instanceof Error ? error.message : "Could not process request." };
        if (response) {
            sendJson(response, status, errorBody);
            return;
        }
        return new Response(JSON.stringify(errorBody), {
            status,
            headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
        });
    }
}
