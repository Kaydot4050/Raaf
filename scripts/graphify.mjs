import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const npmGlobal = execSync('npm root -g', { encoding: 'utf8' }).trim();
const bun = path.join(npmGlobal, 'bun', 'bin', 'bun.exe');
const cli = path.join(npmGlobal, 'graphify-ts', 'src', 'cli.ts');
const args = process.argv.slice(2).join(' ');

execSync(`"${bun}" "${cli}" ${args}`, { stdio: 'inherit', cwd: root });
