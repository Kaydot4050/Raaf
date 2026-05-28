import { existsSync, mkdirSync, cpSync, symlinkSync, lstatSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(ROOT, 'images');
const dest = join(ROOT, 'public', 'images');

if (!existsSync(src)) {
  console.warn('No images/ folder found — product photos may be missing.');
  process.exit(0);
}

mkdirSync(join(ROOT, 'public'), { recursive: true });

if (existsSync(dest)) {
  try {
    if (lstatSync(dest).isSymbolicLink() || lstatSync(dest).isDirectory()) {
      process.exit(0);
    }
  } catch {
    /* continue */
  }
}

try {
  symlinkSync(src, dest, 'junction');
  console.log('Linked public/images → images/');
} catch {
  cpSync(src, dest, { recursive: true, force: true });
  console.log('Copied images to public/images/');
}
