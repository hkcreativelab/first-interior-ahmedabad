// @ts-ignore - Vercel builds the server bundle before this function runs.
import server from "../../frontend/dist/server/server.js";
function getHeader(headers, name) {
    if (!headers) {
        return undefined;
    }
    if (typeof headers.get === "function") {
        return headers.get(name) ?? undefined;
    }
    const headerRecord = headers;
    const value = headerRecord[name.toLowerCase()] ?? headerRecord[name];
    return Array.isArray(value) ? value.join(",") : value;
}
function toHeaders(headers) {
    if (!headers) {
        return new Headers();
    }
    if (typeof headers.entries === "function") {
        const nextHeaders = new Headers();
        for (const [key, value] of headers.entries()) {
            nextHeaders.append(key, value);
        }
        return nextHeaders;
    }
    const nextHeaders = new Headers();
    for (const [key, value] of Object.entries(headers)) {
        if (value === undefined) {
            continue;
        }
        if (Array.isArray(value)) {
            for (const entry of value) {
                nextHeaders.append(key, entry);
            }
            continue;
        }
        nextHeaders.set(key, value);
    }
    return nextHeaders;
}
async function getBody(request) {
    if (typeof request.arrayBuffer === "function") {
        return request.arrayBuffer();
    }
    if (typeof request.text === "function") {
        const bodyText = await request.text();
        return new TextEncoder().encode(bodyText).buffer;
    }
    if (typeof request.on === "function") {
        const chunks = [];
        await new Promise((resolve, reject) => {
            request.on?.("data", (chunk) => {
                chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            });
            request.on?.("end", () => resolve());
            request.on?.("error", (error) => reject(error));
        });
        const buffer = Buffer.concat(chunks);
        return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    }
    return undefined;
}
function getRequestUrl(request) {
    const requestUrl = request.url ?? "/";
    try {
        return new URL(requestUrl);
    }
    catch {
        const protocol = getHeader(request.headers, "x-forwarded-proto") ?? "https";
        const host = getHeader(request.headers, "x-forwarded-host") ?? getHeader(request.headers, "host");
        if (!host) {
            return new URL(requestUrl, "https://localhost");
        }
        return new URL(requestUrl, `${protocol}://${host}`);
    }
}
async function getRewrittenRequest(request) {
    const url = getRequestUrl(request);
    const rewrittenPath = url.searchParams.get("_pathname");
    const headers = toHeaders(request.headers);
    const method = request.method ?? "GET";
    if (rewrittenPath === null) {
        const body = method === "GET" || method === "HEAD" ? undefined : await getBody(request);
        return new Request(url, {
            method,
            headers,
            body,
        });
    }
    url.pathname = rewrittenPath ? `/${rewrittenPath}` : "/";
    url.searchParams.delete("_pathname");
    const body = method === "GET" || method === "HEAD" ? undefined : await getBody(request);
    return new Request(url, {
        method,
        headers,
        body,
    });
}
async function writeWebResponse(response, nodeResponse) {
    nodeResponse.statusCode = response.status;
    if (response.statusText) {
        nodeResponse.statusMessage = response.statusText;
    }
    const headers = response.headers;
    const getSetCookie = headers.getSetCookie;
    const setCookies = typeof getSetCookie === "function" ? getSetCookie.call(headers) : [];
    for (const [key, value] of headers.entries()) {
        if (key.toLowerCase() === "set-cookie") {
            continue;
        }
        nodeResponse.setHeader?.(key, value);
    }
    if (setCookies.length > 0) {
        nodeResponse.setHeader?.("Set-Cookie", setCookies);
    }
    else {
        const setCookie = headers.get("set-cookie");
        if (setCookie) {
            nodeResponse.setHeader?.("Set-Cookie", setCookie);
        }
    }
    const body = await response.arrayBuffer();
    nodeResponse.end?.(Buffer.from(body));
}
export default async function handler(request, response, context) {
    const rewrittenRequest = await getRewrittenRequest(request);
    const webResponse = await server.fetch(rewrittenRequest, process.env, context);
    if (response && typeof response.end === "function" && typeof response.setHeader === "function") {
        await writeWebResponse(webResponse, response);
        return;
    }
    return webResponse;
}
