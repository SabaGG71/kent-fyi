/**
 * Makes the smaller copies of the site's photographs that the pages ask for, so no image goes through a
 * paid resizing service: public/kent/photos/*.webp (and the footer's marble) -> public/kent/sized/<name>-<w>.webp
 * at each width in SIZES. The largest request gets the original, which is at most 2400px wide.
 *
 * Run it after adding or replacing a photograph:  npm run photos
 * It skips copies that are already newer than their original.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// keep in step with src/lib/image-loader.ts and next.config.ts
const SIZES = [384, 640, 1080, 1600];
const SOURCES = ["public/kent/photos", "public/kent"];
const OUT = "public/kent/sized";

fs.mkdirSync(OUT, { recursive: true });
let made = 0;
let kept = 0;
for (const dir of SOURCES) {
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".webp"))) {
    const src = path.join(dir, file);
    const name = path.basename(file, ".webp");
    const changed = fs.statSync(src).mtimeMs;
    for (const w of SIZES) {
      const dest = path.join(OUT, `${name}-${w}.webp`);
      if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= changed) {
        kept++;
        continue;
      }
      await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80, smartSubsample: true }).toFile(dest);
      made++;
    }
  }
}
// copies whose original is gone
const names = new Set(SOURCES.flatMap((d) => fs.readdirSync(d).filter((f) => f.endsWith(".webp")).map((f) => path.basename(f, ".webp"))));
let removed = 0;
for (const f of fs.readdirSync(OUT)) {
  if (!names.has(f.replace(/-\d+\.webp$/, ""))) {
    fs.rmSync(path.join(OUT, f));
    removed++;
  }
}
console.log(`photo sizes: ${made} made, ${kept} already current, ${removed} removed`);
