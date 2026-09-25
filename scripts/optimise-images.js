#!/usr/bin/env node
/**
 * Turns the full-resolution originals pulled from tahiracademytrust.org into
 * responsive, web-weight derivatives.
 *
 *   assets/img/_originals/*   masters, gitignored, never served
 *   assets/img/*.webp         primary format
 *   assets/img/*.jpg          fallback for older Safari/Firefox builds
 *
 * The originals total ~16 MB; two of them are over 4 MB on their own. Shipping
 * those was audit finding 11.5.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'assets', 'img', '_originals');
const OUT = path.join(__dirname, '..', 'assets', 'img');

/** slug -> { widths, fit, height? }  height only where a fixed crop is wanted. */
const PLAN = {
  logo:                { widths: [96, 192], square: true },
  // Portrait master at 1130x1600 — planning wider than that produced nothing,
  // since the resize step refuses to upscale.
  'campaign-masjid':   { widths: [640, 1130] },
  'course-maktab':     { widths: [560, 1120] },
  'course-sanatayn':   { widths: [560, 1120] },
  'course-aalimiyyah': { widths: [560, 1120] },
  'course-hifz':       { widths: [560, 1120] },
  'islamic-ceiling':   { widths: [640, 1120] },
  // Generated recruitment poster. Portrait 2:3.
  'hiring-poster':     { widths: [560, 848] },
  'service-jumuah':    { widths: [560, 1120] },
};

const QUALITY = { webp: 78, jpeg: 80 };

function findOriginal(slug) {
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
    const p = path.join(SRC, slug + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function build(slug, cfg) {
  const src = findOriginal(slug);
  if (!src) {
    console.log(`SKIP  ${slug} — no original found in ${path.relative(process.cwd(), SRC)}`);
    return [];
  }

  const meta = await sharp(src).metadata();
  const results = [];

  for (const w of cfg.widths) {
    // Never upscale past the master.
    if (meta.width && w > meta.width) continue;

    const resize = cfg.square
      ? { width: w, height: w, fit: 'cover', position: 'attention' }
      : { width: w, withoutEnlargement: true };

    for (const fmt of ['webp', 'jpeg']) {
      const ext = fmt === 'jpeg' ? 'jpg' : 'webp';
      const name = `${slug}-${w}.${ext}`;
      const dest = path.join(OUT, name);

      const pipeline = sharp(src).rotate().resize(resize);
      if (fmt === 'webp') pipeline.webp({ quality: QUALITY.webp, effort: 5 });
      else pipeline.jpeg({ quality: QUALITY.jpeg, mozjpeg: true, progressive: true });

      const info = await pipeline.toFile(dest);
      results.push({ name, bytes: info.size, w: info.width, h: info.height });
    }
  }
  return results;
}

(async () => {
  if (!fs.existsSync(SRC)) {
    console.error(`No originals directory at ${SRC}`);
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });

  let total = 0;
  const manifest = {};

  for (const [slug, cfg] of Object.entries(PLAN)) {
    const made = await build(slug, cfg);
    if (!made.length) continue;
    manifest[slug] = made.map((m) => ({ file: m.name, w: m.w, h: m.h, bytes: m.bytes }));
    for (const m of made) {
      total += m.bytes;
      console.log(`  ${String(Math.round(m.bytes / 1024)).padStart(5)} KB  ${m.w}x${m.h}  ${m.name}`);
    }
  }

  // Intrinsic dimensions land in the manifest so index.html can carry width/
  // height attributes and stop causing layout shift (audit finding 11.3).
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

  const originals = fs.readdirSync(SRC)
    .reduce((n, f) => n + fs.statSync(path.join(SRC, f)).size, 0);

  console.log(`\noriginals  ${(originals / 1024 / 1024).toFixed(2)} MB`);
  console.log(`derivatives ${(total / 1024 / 1024).toFixed(2)} MB across ${Object.values(manifest).flat().length} files`);
})();
