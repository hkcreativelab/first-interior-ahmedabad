export default {
    async fetch(request) {
        const url = new URL(request.url);
        const pathname = url.pathname;
        const reqHeaders = new Headers(request.headers);
        const body = await request.arrayBuffer();
        const expressReq = new Request(request.url, {
            method: request.method,
            headers: reqHeaders,
            body: body.byteLength ? body : undefined,
        });
        const res = await fetch(request.url, {
            method: request.method,
            headers: reqHeaders,
            body: body.byteLength ? body : undefined,
        });
        return res;
    },
};
