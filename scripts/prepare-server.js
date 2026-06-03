import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const deployDir = path.join(rootDir, 'deploy-server');

// 1. Create deploy directory
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir);
fs.mkdirSync(path.join(deployDir, 'server'), { recursive: true });
fs.mkdirSync(path.join(deployDir, 'tmp'), { recursive: true });

// 2. Read root package.json
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));

// 3. Filter dependencies (only backend ones)
const backendDeps = [
  '@neondatabase/serverless',
  'ws',
  'bcryptjs',
  'cloudinary',
  'cookie-parser',
  'cors',
  'dotenv',
  'express',
  'google-auth-library',
  'jsonwebtoken',
  'multer',
  'pg',
  'sharp',
  'twilio',
];

const newDeps = {};
for (const dep of backendDeps) {
  if (pkg.dependencies[dep]) {
    newDeps[dep] = pkg.dependencies[dep];
  }
}

// 4. cPanel entry (startup file should be app.js in application root)
fs.writeFileSync(
  path.join(deployDir, 'app.js'),
  `// cPanel / Namecheap: set "Application startup file" to app.js
import './server/index.js';
`,
);

// 5. Create new package.json for deployment
const deployPkg = {
  name: pkg.name + '-api',
  version: pkg.version,
  type: 'module',
  main: 'app.js',
  scripts: {
    start: 'node app.js',
  },
  engines: { node: '>=18' },
  dependencies: newDeps,
};

fs.writeFileSync(
  path.join(deployDir, 'package.json'),
  JSON.stringify(deployPkg, null, 2)
);

// 6. Copy server files
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'data') {
        copyDir(srcPath, destPath);
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(path.join(rootDir, 'server'), path.join(deployDir, 'server'));

// 7. Create restart.txt
fs.writeFileSync(path.join(deployDir, 'tmp', 'restart.txt'), Date.now().toString());

// 8. Quick check script (run in cPanel Terminal: cd api-server && node verify.mjs)
fs.writeFileSync(
  path.join(deployDir, 'verify.mjs'),
  `import 'dotenv/config';
const required = ['DATABASE_URL', 'JWT_SECRET'];
let ok = true;
for (const key of required) {
  const set = Boolean(process.env[key]);
  console.log(set ? '✓' : '✗', key, set ? '' : '(missing — add in cPanel Node → Environment variables)');
  if (!set) ok = false;
}
console.log('CLIENT_ORIGIN', process.env.CLIENT_ORIGIN || '(not set)');
if (!ok) process.exit(1);
const modules = ['express', 'sharp', 'multer', '@neondatabase/serverless', 'ws'];
for (const name of modules) {
  try {
    await import(name);
    console.log('✓', name);
  } catch (e) {
    console.error('✗', name, '— run NPM Install:', e.message);
    ok = false;
  }
}
if (!ok) process.exit(1);
console.log('Deps OK. Next: node app.js');
`,
);

// 9. Env template for cPanel (do not commit real secrets)
fs.writeFileSync(
  path.join(deployDir, '.env.example'),
  `NODE_ENV=production
PORT=
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
JWT_SECRET=
CLIENT_ORIGIN=https://raafortagro.com,https://www.raafortagro.com,https://admin.raafortagro.com
COOKIE_DOMAIN=.raafortagro.com
GOOGLE_CLIENT_ID=
`,
);

console.log('Backend prepared in deploy-server/');
