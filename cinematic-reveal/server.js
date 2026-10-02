import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = new URL('.', import.meta.url).pathname;
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' };
const port = Number(process.env.PORT || 3000);

createServer(async (request, response) => {
  let path;
  try {
    path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Invalid request');
    return;
  }
  const file = resolve(root, `.${path === '/' ? '/index.html' : path}`);
  if (!file.startsWith(resolve(root) + sep)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': `${types[extname(file)] || 'application/octet-stream'}; charset=utf-8` });
    response.end(body);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') response.writeHead(404).end('Not found');
    else {
      console.error(error);
      response.writeHead(500).end('Unable to load this file');
    }
  }
}).listen(port, '0.0.0.0', () => console.log(`Reveal concept: http://localhost:${port}`));
