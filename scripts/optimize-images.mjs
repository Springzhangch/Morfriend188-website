import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const imageDir = path.resolve('assets/images');
const supported = new Set(['.jpg', '.jpeg', '.png']);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : fullPath;
  }));
  return files.flat();
}

const files = (await walk(imageDir)).filter((file) => {
  const ext = path.extname(file).toLowerCase();
  const name = path.basename(file).toLowerCase();
  return supported.has(ext) && !name.includes('.optimized');
});

for (const file of files) {
  const parsed = path.parse(file);
  const webpFile = path.join(parsed.dir, `${parsed.name}.webp`);
  const optimizedOriginal = path.join(parsed.dir, `${parsed.name}.optimized${parsed.ext.toLowerCase()}`);

  const image = sharp(file, { failOn: 'none' }).rotate();
  const metadata = await image.metadata();
  const resize = metadata.width && metadata.width > 1920 ? { width: 1920, withoutEnlargement: true } : {};

  await image
    .clone()
    .resize(resize)
    .webp({ quality: 82, effort: 6 })
    .toFile(webpFile);

  if (parsed.ext.toLowerCase() === '.png') {
    await image
      .clone()
      .resize(resize)
      .png({ compressionLevel: 9, palette: true })
      .toFile(optimizedOriginal);
  } else {
    await image
      .clone()
      .resize(resize)
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(optimizedOriginal);
  }

  const originalStat = await fs.stat(file);
  const webpStat = await fs.stat(webpFile);
  const saving = Math.max(0, 100 - Math.round((webpStat.size / originalStat.size) * 100));
  console.log(`${path.relative(process.cwd(), file)} -> ${path.relative(process.cwd(), webpFile)} (${saving}% smaller)`);
}
