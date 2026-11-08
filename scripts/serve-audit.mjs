import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(process.argv[2] || 'dist');
const port = Number(process.argv[3] || 4175);
const config = await readFile('netlify.toml', 'utf8');
const csp = config.match(/Content-Security-Policy = "([^"]+)"/)[1];
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain' };
createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let path = resolve(root, '.' + pathname);
    if (path !== root && !path.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    let status = 200;
    try { if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html'); await stat(path); }
    catch { path = resolve(root, '404.html'); status = 404; }
    const content = await readFile(path);
    response.writeHead(status, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Content-Security-Policy': csp, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch { response.writeHead(500); response.end(); }
}).listen(port, '127.0.0.1', () => console.log(`Local static QA: http://127.0.0.1:${port}`));
