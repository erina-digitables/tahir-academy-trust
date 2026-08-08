#!/usr/bin/env node
/**
 * Development mode: Tailwind in watch mode alongside the static server, both
 * streaming to one console so build errors and request errors interleave.
 */
const { spawn } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function run(label, cmd, args) {
  const child = spawn(cmd, args, { cwd: ROOT, shell: process.platform === 'win32' });
  const emit = (stream) => (chunk) =>
    String(chunk)
      .split('\n')
      .filter((l) => l.trim())
      .forEach((l) => stream(`[${label}] ${l}`));
  child.stdout.on('data', emit(console.log));
  child.stderr.on('data', emit(console.error));
  child.on('exit', (code) => {
    if (code) console.error(`[${label}] exited with ${code}`);
  });
  return child;
}

const css = run('css', npx, ['tailwindcss', '-i', './src/input.css', '-o', './assets/css/site.css', '--watch']);
const web = run('web', process.execPath, [path.join(__dirname, 'serve.js')]);

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    css.kill();
    web.kill();
    process.exit(0);
  });
}
