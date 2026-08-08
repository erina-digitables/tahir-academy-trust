#!/usr/bin/env node
/**
 * Compresses the source footage for web delivery and extracts a poster frame
 * from each clip.
 *
 *   assets/video/_originals/*.mp4   as downloaded from Pexels, gitignored
 *   assets/video/*.mp4              H.264 web build
 *   assets/video/*-poster.jpg       first usable frame, used as the still
 *                                   fallback when autoplay is refused
 *
 * The originals total ~24 MB, which is far too much to put in front of someone
 * on a phone.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const SRC = path.join(__dirname, '..', 'assets', 'video', '_originals');
const OUT = path.join(__dirname, '..', 'assets', 'video');

/** Wider clips can afford a smaller height; the hero needs the most quality. */
const PLAN = {
  'quran-open':   { height: 720, crf: 30 },
  'mosque-dome':  { height: 720, crf: 32 },
};

function run(args) {
  execFileSync(ffmpeg, args, { stdio: ['ignore', 'ignore', 'pipe'] });
}

function mb(bytes) { return (bytes / 1024 / 1024).toFixed(2); }

(async () => {
  if (!fs.existsSync(SRC)) {
    console.error(`No originals at ${SRC}`);
    process.exit(1);
  }

  let before = 0;
  let after = 0;

  for (const [slug, cfg] of Object.entries(PLAN)) {
    const src = path.join(SRC, slug + '.mp4');
    if (!fs.existsSync(src)) { console.log(`SKIP ${slug} — no original`); continue; }

    before += fs.statSync(src).size;

    const video = path.join(OUT, slug + '.mp4');
    run([
      '-y', '-i', src,
      '-vf', `scale=-2:${cfg.height}`,
      '-c:v', 'libx264',
      '-profile:v', 'main',
      '-crf', String(cfg.crf),
      '-preset', 'slow',
      '-pix_fmt', 'yuv420p',
      // Puts the index at the front so playback can start before the whole
      // file has arrived.
      '-movflags', '+faststart',
      // No audio track at all — these are silent ambient backdrops.
      '-an',
      video,
    ]);

    // Poster from one second in; frame zero is often a fade from black.
    const poster = path.join(OUT, slug + '-poster.jpg');
    run(['-y', '-ss', '1', '-i', src, '-vframes', '1', '-vf', `scale=-2:${cfg.height}`, '-q:v', '4', poster]);

    const vBytes = fs.statSync(video).size;
    const pBytes = fs.statSync(poster).size;
    after += vBytes + pBytes;

    console.log(
      `${slug.padEnd(14)} ${String(mb(fs.statSync(src).size)).padStart(6)} MB -> ` +
      `${String(mb(vBytes)).padStart(6)} MB  (+ ${Math.round(pBytes / 1024)} KB poster)`
    );
  }

  console.log(`\ntotal ${mb(before)} MB -> ${mb(after)} MB`);
})();
