#!/usr/bin/env node
/**
 * Assembles the deployable site into dist/.
 *
 * Mirrors the allowlist in serve.js: only index.html, favicon.ico and assets/
 * ship, and assets/**\/_originals is excluded so full-resolution masters never
 * reach a public host. favicon.ico sits at the root because browsers and link
 * tools request /favicon.ico directly.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const ENTRIES = ['index.html', 'favicon.ico', 'assets'];
const EXCLUDED_DIRS = new Set(['_originals']);
const EXCLUDED_FILES = new Set(['PEXELS-CREDITS.md', 'CREDITS.md']);

let fileCount = 0;

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      copyDir(path.join(src, entry.name), path.join(dest, entry.name));
    } else {
      if (EXCLUDED_FILES.has(entry.name)) continue;
      fs.copyFileSync(path.join(src, entry.name), path.join(dest, entry.name));
      fileCount++;
    }
  }
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

for (const name of ENTRIES) {
  const src = path.join(ROOT, name);
  if (!fs.existsSync(src)) {
    console.error(`[build-dist] missing required entry: ${name}`);
    process.exit(1);
  }
  const dest = path.join(DIST, name);
  if (fs.statSync(src).isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
    fileCount++;
  }
}

console.log(`[build-dist] wrote ${fileCount} files to dist/`);
