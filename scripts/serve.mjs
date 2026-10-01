import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); return response.end(); }
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let target = resolve(root, `.${path}`);
    if (target !== resolve(root) && !target.startsWith(resolve(root) + sep)) { response.writeHead(403); return response.end(); }
    let status = 200;
    try { if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html'); }
    catch { target = resolve(root, '404.html'); status = 404; }
    const data = await readFile(target);
    response.writeHead(status, { 'Content-Type': mime[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch { response.writeHead(400); response.end('Requisição inválida.'); }
});
const port = Number(process.env.PORT || 5173);
server.listen(port, '127.0.0.1', () => console.log(`GlobalK: http://localhost:${port}`));
