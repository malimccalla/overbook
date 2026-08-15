const http = require("node:http");
const httpProxy = require("http-proxy");

const NEXT_PORT = 3001;
const PROXY_PORT = 3000;

const proxy = httpProxy.createProxyServer({
  target: `http://localhost:${NEXT_PORT}`,
  ws: true,
  changeOrigin: false,
});

const server = http.createServer((req, res) => {
  const url = req.url || "";
  // Log page navigations only
  if (url === "/" || (url.startsWith("/") && !url.includes(".") && !url.includes("?_rsc="))) {
    console.log(`[proxy] ${req.method} ${req.headers.host}${url}`);
  }
  proxy.web(req, res);
});

server.on("upgrade", (req, socket, head) => {
  proxy.ws(req, socket, head);
});

proxy.on("error", (err, _req, res) => {
  if (err.message.includes("Parse Error") || err.message.includes("socket hang up")) return;
  console.error("[proxy] Error:", err.message);
  if (res?.writeHead) {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end(`Proxy error: ${err.message}`);
  }
});

server.listen(PROXY_PORT, "0.0.0.0", () => {
  console.log(`
  Dev Proxy Started
  ─────────────────────────────────────
  Proxy:    http://localhost:${PROXY_PORT}
  Next.js:  http://localhost:${NEXT_PORT}

  Domains:
  • http://overbook.test:${PROXY_PORT}          → marketing
  • http://app.overbook.test:${PROXY_PORT}      → dashboard
  • http://admin.overbook.test:${PROXY_PORT}    → admin
  • http://[tenant].overbook.test:${PROXY_PORT} → tenant page
  ─────────────────────────────────────
`);
});
