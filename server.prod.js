import http from "node:http";
import { Readable } from "node:stream";
import server from "./dist/server/index.mjs";

const port = Number(process.env.PORT || 3000);

function nodeHeadersToFetchHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v !== undefined) headers.append(key, v);
      }
    } else {
      headers.set(key, value);
    }
  }
  return headers;
}

function createFetchRequest(req) {
  const host = req.headers.host || "localhost";
  const url = new URL(req.url ?? "/", `http://${host}`);
  const requestInit = {
    method: req.method,
    headers: nodeHeadersToFetchHeaders(req.headers),
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req,
  };
  return new Request(url.toString(), requestInit);
}

async function handleRequest(req, res) {
  try {
    const request = createFetchRequest(req);
    const response = await server.fetch(request, process.env, undefined);

    res.writeHead(response.status, Object.fromEntries(response.headers));

    if (response.body) {
      const bodyStream = Readable.fromWeb(response.body);
      bodyStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Internal Server Error");
  }
}

const httpServer = http.createServer(handleRequest);
httpServer.listen(port, "0.0.0.0", () => {
  console.log(`Production server listening on http://0.0.0.0:${port}`);
});
