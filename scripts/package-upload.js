import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(root, '..');
const out = path.join(projectRoot, 'upload-to-namecheap');

function rm(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, name.name);
    const d = path.join(dest, name.name);
    if (name.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

rm(out);
copyDir(path.join(projectRoot, 'dist'), path.join(out, 'public_html'));
copyDir(path.join(projectRoot, 'dist-admin'), path.join(out, 'public_html', 'admin'));
copyDir(path.join(projectRoot, 'deploy-server'), path.join(out, 'api-server'));

const readme = `# Upload to Namecheap

1. cPanel → File Manager
2. public_html/  ← upload everything inside upload-to-namecheap/public_html/
3. api-server/   ← upload everything inside upload-to-namecheap/api-server/ (same level as public_html)
4. cPanel → Setup Node.js App → root: api-server, startup: server/index.js
5. Set DATABASE_URL (Neon) and JWT_SECRET in Node app env, then Restart
6. SSH/Terminal once: cd api-server && npm install --production

Main site: yourdomain.com
Admin: yourdomain.com/admin/
API: configure api.yourdomain.com in cPanel Node app
`;

fs.writeFileSync(path.join(out, 'UPLOAD-README.txt'), readme);
console.log('Ready:', out);
