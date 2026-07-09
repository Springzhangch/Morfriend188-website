const sharp = require('sharp');
const path = require('path');

const src = 'E:\\SpringPrivate\\Github\\新架构（调试）\\图片';
const dst = 'E:\\SpringPrivate\\Github\\新架构（调试）\\assets\\images\\news';

const tasks = [
  { src: path.join(src, '1. Optical Clarity.png'), name: '2026vs-clarity' },
  { src: path.join(src, '3. Scratch Resistance.png'), name: '2026vs-scratch' },
  { src: path.join(src, '4. UV Protection & Weathering.png'), name: '2026vs-uv' },
];
const W = 450; // 3:4 → 450×600

(async () => {
  for (const t of tasks) {
    const img = sharp(t.src);
    const resized = img.resize(W, null, { fit: 'inside', withoutEnlargement: true });
    
    await resized.clone().webp({ quality: 92 }).toFile(path.join(dst, t.name + '.webp'));
    const ws = await sharp(path.join(dst, t.name + '.webp')).metadata();
    console.log(`✓ ${t.name}.webp (${ws.width}×${ws.height})`);
    
    await resized.clone().jpeg({ quality: 90 }).toFile(path.join(dst, t.name + '.jpg'));
    console.log(`✓ ${t.name}.jpg`);
  }
  console.log('--- Done ---');
})();
