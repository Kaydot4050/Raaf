const BATCH_URL = 'https://news.google.com/_/DotsSplashUi/data/batchexecute?rpcids=Fbv4je';

export function isGoogleNewsUrl(url) {
  return typeof url === 'string' && url.includes('news.google.com');
}

function articleIdFromUrl(sourceUrl) {
  try {
    const url = new URL(sourceUrl);
    const parts = url.pathname.split('/');
    const idx = parts.indexOf('articles');
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1].split('?')[0];
  } catch {
    /* ignore */
  }
  return null;
}

function decodeLegacyToken(base64) {
  let str = Buffer.from(base64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('binary');

  const prefix = Buffer.from([0x08, 0x13, 0x22]).toString('binary');
  if (str.startsWith(prefix)) str = str.substring(prefix.length);

  const suffix = Buffer.from([0xd2, 0x01, 0x00]).toString('binary');
  if (str.endsWith(suffix)) str = str.substring(0, str.length - suffix.length);

  const len = str.charCodeAt(0);
  if (len >= 0x80) str = str.substring(2, len + 2);
  else str = str.substring(1, len + 1);

  if (str.startsWith('http')) return str;
  return null;
}

async function fetchDecodedBatchExecute(articleId) {
  const payload =
    '[[["Fbv4je","[\\"garturlreq\\",[[\\"en-US\\",\\"US\\",[\\"FINANCE_TOP_INDICES\\",\\"WEB_TEST_1_0_0\\"],null,null,1,1,\\"US:en\\",null,180,null,null,null,null,null,0,null,null,[1608992183,723341000]],\\"en-US\\",\\"US\\",1,[2,3,4,8],1,0,\\"655000234\\",0,0,null,0],\\"' +
    articleId +
    '\\"]",null,"generic"]]]';

  const response = await fetch(BATCH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Referer: 'https://news.google.com/',
    },
    body: `f.req=${encodeURIComponent(payload)}`,
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) return null;

  const text = await response.text();
  const header = '["garturlres","';
  const footer = '",';
  if (!text.includes(header)) return null;
  const start = text.substring(text.indexOf(header) + header.length);
  if (!start.includes(footer)) return null;
  const decoded = start.substring(0, start.indexOf(footer));
  return decoded?.startsWith('http') ? decoded : null;
}

/** Resolve Google News redirect URLs to the publisher article URL. */
export async function resolveGoogleNewsUrl(sourceUrl) {
  if (!sourceUrl || !isGoogleNewsUrl(sourceUrl)) return sourceUrl;

  const articleId = articleIdFromUrl(sourceUrl);
  if (!articleId) return sourceUrl;

  const legacy = decodeLegacyToken(articleId);
  if (legacy) return legacy;

  try {
    const decoded = await fetchDecodedBatchExecute(articleId);
    if (decoded) return decoded;
  } catch (err) {
    console.warn('[googleNews] batchexecute failed:', err.message);
  }

  return sourceUrl;
}
