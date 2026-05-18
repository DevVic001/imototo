/**
 * Builds PWA PNGs + social share image from brand assets (run: npm run icons)
 */
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const pwaSvg = join(root, 'public/pwa/icon.svg');
const logoSource = join(root, 'public/assets/images/logo-lightt.jpg');
const pwaDir = join(root, 'public/pwa');
const assetsDir = join(root, 'public/assets');

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('sharp not installed — skip PNG generation. Run: npm install');
  process.exit(0);
}

if (existsSync(pwaSvg)) {
  const svg = readFileSync(pwaSvg);
  for (const size of [180, 192, 512]) {
    const out = join(pwaDir, `icon-${size}.png`);
    await sharp(svg).resize(size, size).png({ compressionLevel: 9 }).toFile(out);
    console.log('Wrote', out);
  }
}

if (existsSync(logoSource)) {
  const logo = readFileSync(logoSource);

  const logoWide = await sharp(logo).resize(880).png().toBuffer();
  const { width, height } = await sharp(logoWide).metadata();
  const canvasW = 1200;
  const canvasH = 630;
  const ogOut = join(assetsDir, 'og-share.png');
  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: logoWide,
        left: Math.floor((canvasW - width) / 2),
        top: Math.floor((canvasH - height) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(ogOut);
  console.log('Wrote', ogOut);

  await sharp(logo).resize(32, 32, { fit: 'inside' }).png().toFile(join(assetsDir, 'favicon-32.png'));
  await sharp(logo).resize(16, 16, { fit: 'inside' }).png().toFile(join(assetsDir, 'favicon-16.png'));
  console.log('Wrote favicon PNGs');
}
