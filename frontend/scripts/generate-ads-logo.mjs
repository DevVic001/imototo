/**
 * Square logo for Google Ads (full logo visible, no crop). Run: npm run ads-logo
 */
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const input = join(root, 'public/assets/images/logo-dark.jpg');
const out = join(root, 'public/assets/images/logo-google-ads-square.png');
const size = 1200;

const sharp = (await import('sharp')).default;

if (!existsSync(input)) {
  console.error('Missing:', input);
  process.exit(1);
}

// Teal brand pad so logo-dark (white on teal) fits without clipping
await sharp(input)
  .resize(size, size, {
    fit: 'contain',
    background: { r: 2, g: 51, b: 63, alpha: 1 },
  })
  .png()
  .toFile(out);

console.log('Wrote', out);
