import fs from 'node:fs';
import sharp from 'sharp';

const SRC = 'public/icon.svg';
const OUT = 'public/icons';
const SIZES = [192, 512];          // add 256, 384 if you want

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

for (const size of SIZES) {
  // If you need a background color, add .flatten({ background: '#0ea5e9' })
  await sharp(SRC)
    .resize(size, size, { fit: 'cover' })
    .flatten({ background: '#932F67' })  // optional, remove if your SVG has a background
    .png()
    .toFile(`${OUT}/icon-${size}.png`);
    
}

console.log('Generated PWA icons:', SIZES.map(s => `${OUT}/icon-${s}.png`).join(', '));
