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
  'bcryptjs',
  'cookie-parser',
  'cors',
  'dotenv',
  'express',
  'google-auth-library',
  'jsonwebtoken',
  'pg',
  'twilio'
];

const newDeps = {};
for (const dep of backendDeps) {
  if (pkg.dependencies[dep]) {
    newDeps[dep] = pkg.dependencies[dep];
  }
}

// 4. Create new package.json for deployment
const deployPkg = {
  name: pkg.name + '-api',
  version: pkg.version,
  type: 'module',
  main: 'server/index.js',
  scripts: {
    start: 'node server/index.js'
  },
  dependencies: newDeps
};

fs.writeFileSync(
  path.join(deployDir, 'package.json'),
  JSON.stringify(deployPkg, null, 2)
);

// 5. Copy server files
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

// 6. Create restart.txt
fs.writeFileSync(path.join(deployDir, 'tmp', 'restart.txt'), Date.now().toString());

console.log('Backend prepared in deploy-server/');
