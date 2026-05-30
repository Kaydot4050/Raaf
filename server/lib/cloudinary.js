import { v2 as cloudinary } from 'cloudinary';

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_FOLDER } =
  process.env;

export function isCloudinaryEnabled() {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
}

export function getCloudinaryPublicConfig() {
  if (!isCloudinaryEnabled()) return { enabled: false };
  return {
    enabled: true,
    cloudName: CLOUDINARY_CLOUD_NAME,
    folder: CLOUDINARY_FOLDER || 'raafortagro',
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || null,
  };
}

if (isCloudinaryEnabled()) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function isCloudinaryUrl(url) {
  try {
    const host = new URL(url).hostname;
    return host === 'res.cloudinary.com' || host.endsWith('.cloudinary.com');
  } catch {
    return false;
  }
}

function uploadOptions(extra = {}) {
  return {
    folder: CLOUDINARY_FOLDER || 'raafortagro',
    resource_type: 'image',
    ...extra,
  };
}

export function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions(), (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.end(buffer);
  });
}

export async function uploadRemoteUrl(url) {
  return cloudinary.uploader.upload(url, uploadOptions());
}
