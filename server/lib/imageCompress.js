const MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;

let sharpModule = null;

async function getSharp() {
  if (sharpModule !== null) return sharpModule;
  try {
    sharpModule = (await import('sharp')).default;
  } catch (err) {
    console.warn('[imageCompress] sharp unavailable — uploads will not be compressed:', err.message);
    sharpModule = false;
  }
  return sharpModule;
}

/**
 * Resize, lightly brighten/normalize, and encode as WebP for smaller files while staying sharp.
 */
export async function compressImageBuffer(input) {
  if (!input?.length) {
    throw new Error('Empty image data.');
  }

  const sharp = await getSharp();
  if (!sharp) {
    return { buffer: input, mime: null, ext: '.jpg' };
  }

  try {
    const out = await sharp(input, { failOn: 'none' })
      .rotate()
      .resize({
        width: MAX_WIDTH,
        withoutEnlargement: true,
        fit: 'inside',
      })
      .normalize()
      .modulate({ brightness: 1.03, saturation: 1.05 })
      .sharpen({ sigma: 0.6, m1: 0.5, m2: 0.3 })
      .webp({ quality: WEBP_QUALITY, effort: 4, smartSubsample: true })
      .toBuffer();

    return { buffer: out, mime: 'image/webp', ext: '.webp' };
  } catch {
    return { buffer: input, mime: null, ext: '.jpg' };
  }
}
