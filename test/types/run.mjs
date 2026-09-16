import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { safeRmSync } from 'fs-remove-compat';
import resolveBin from 'resolve-bin-sync';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
mkdirSync(path.join(repoRoot, '.tmp'), { recursive: true });
const fixtureRoot = mkdtempSync(path.join(repoRoot, '.tmp/type-fixture-'));
const fixtureSource = path.dirname(fileURLToPath(import.meta.url));
const packageName = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8')).name;
const nodeModules = path.join(fixtureRoot, 'node_modules');

try {
  cpSync(path.join(fixtureSource, 'package.json'), path.join(fixtureRoot, 'package.json'));
  cpSync(path.join(fixtureSource, 'tsconfig.json'), path.join(fixtureRoot, 'tsconfig.json'));
  cpSync(path.join(fixtureSource, 'src'), path.join(fixtureRoot, 'src'), { recursive: true });
  mkdirSync(nodeModules);
  symlinkSync(repoRoot, path.join(nodeModules, packageName), 'junction');
  symlinkSync(path.join(repoRoot, 'node_modules', 'react'), path.join(nodeModules, 'react'), 'junction');

  const tsds = resolveBin('ts-dev-stack', 'tsds');
  if (!existsSync(tsds)) throw new Error(`Missing repository tsds executable: ${tsds}`);
  execFileSync(process.execPath, [tsds, 'build'], { cwd: fixtureRoot, stdio: 'inherit' });
  if (!existsSync(path.join(fixtureRoot, 'dist', 'cjs', 'index.js'))) throw new Error('Type fixture did not build its public-name import');
  const sourcePath = path.join(fixtureRoot, 'src', 'index.tsx');
  const source = readFileSync(sourcePath, 'utf8');
  writeFileSync(sourcePath, source.replaceAll(/\s*\/\/ @ts-expect-error[^\n]*\n/g, '\n'));
  const negative = spawnSync(process.execPath, [tsds, 'build'], { cwd: fixtureRoot, encoding: 'utf8' });
  if (negative.error) throw negative.error;
  const output = `${negative.stdout}\n${negative.stderr}`;
  if (negative.status === 0 || !output.includes('TS2339') || !output.includes('TS2345')) {
    throw new Error(`Type fixture did not reject readonly mutation and callback registration:\n${output}`);
  }
} finally {
  safeRmSync(fixtureRoot);
}
