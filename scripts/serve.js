#!/usr/bin/env node
/**
 * Static server for the site. Tries port 3000, then 3001, then 3002, and
 * reports which one it settled on.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORTS = [3000, 3001, 3002];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
};

// Nothing outside these trees is reachable, so the frozen import and the
// gitignored full-resolution masters can't be served by accident.
const ALLOW = ['index.html', 'assets', 'favicon.ico', 'favicon.svg', 'site.webmanifest', 'robots.txt'];

function isAllowed(rel) {
  const top = rel.split(/[\\/]/)[0];
  if (!ALLOW.includes(top)) return false;
  if (rel.replace(/\\/g, '/').includes('assets/img/_originals')) return false;
  return true;
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  const rel = path.normalize(urlPath).replace(/^[\\/]+/, '');
  const file = path.join(ROOT, rel);

  if (!file.startsWith(ROOT) || !isAllowed(rel)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(file).toLowerCase();
    // Markup, styles and scripts are revalidated every request so an edit is
    // never masked by a cached copy. Images are content-addressed by width and
    // safe to cache.
    const volatile = ext === '.html' || ext === '.css' || ext === '.js';
    res.writeHead(200, {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Cache-Control': volatile ? 'no-store, must-revalidate' : 'public, max-age=3600',
    });
    res.end(buf);
  });
});

function listen(i) {
  if (i >= PORTS.length) {
    console.error(`All ports busy: ${PORTS.join(', ')}. Free one and retry.`);
    process.exit(1);
  }
  const port = PORTS[i];
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`port ${port} in use, trying ${PORTS[i + 1] ?? '(none left)'}`);
      listen(i + 1);
    } else {
      throw err;
    }
  });
  server.listen(port, () => {
    console.log(`\n  Tahir Academy Trust — running on port ${port}`);
    console.log(`  http://localhost:${port}\n`);
  });
}

listen(0);
