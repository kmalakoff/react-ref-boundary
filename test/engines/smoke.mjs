import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const packageName = process.argv[2];
if (!packageName) throw new Error('Missing package name');

const imported = await import(packageName);
const required = createRequire(import.meta.url)(packageName);

assert.equal(typeof imported.BoundaryProvider, 'function');
assert.equal(typeof imported.useRef, 'function');
assert.equal(typeof imported.useBoundary, 'function');
assert.equal(typeof required.BoundaryProvider, 'function');
assert.equal(typeof required.useRef, 'function');
assert.equal(typeof required.useBoundary, 'function');
