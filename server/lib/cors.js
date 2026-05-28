const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
];

/** Allow LAN dev URLs (e.g. http://192.168.1.5:5174) when not in production. */
function isDevLanOrigin(origin) {
  if (process.env.NODE_ENV === 'production') return false;
  try {
    const { hostname, port } = new URL(origin);
    const privateHost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname);
    const appPort = port === '5173' || port === '5174' || port === '4173' || port === '4174';
    return privateHost && appPort;
  } catch {
    return false;
  }
}

export function getAllowedOrigins() {
  const fromEnv = process.env.CLIENT_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_ORIGINS;
}

export function corsOptions() {
  const allowed = getAllowedOrigins();
  return {
    origin(origin, callback) {
      if (!origin || allowed.includes(origin) || isDevLanOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  };
}
