// @ts-ignore - Vercel builds the server bundle before this function runs.
import server from "../dist/server/server.js";

type VercelHandlerContext = {
  params?: Record<string, string | string[]>;
  waitUntil?: (promise: Promise<unknown>) => void;
};

function getRequestUrl(request: Request): URL {
  try {
    return new URL(request.url);
  } catch {
    const protocol = request.headers.get("x-forwarded-proto") ?? "https";
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (!host) {
      return new URL(request.url, "https://localhost");
    }

    return new URL(request.url, `${protocol}://${host}`);
  }
}

function getRewrittenRequest(request: Request): Request {
  const url = getRequestUrl(request);
  const rewrittenPath = url.searchParams.get("_pathname");

  if (rewrittenPath === null) {
    return request;
  }

  url.pathname = rewrittenPath ? `/${rewrittenPath}` : "/";
  url.searchParams.delete("_pathname");

  return new Request(url, request);
}

export default async function handler(request: Request, context: VercelHandlerContext) {
  const rewrittenRequest = getRewrittenRequest(request);
  return server.fetch(rewrittenRequest, process.env, context);
}
