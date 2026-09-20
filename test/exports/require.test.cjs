const assert = require('assert');
const path = require('path');
const { execFileSync } = require('child_process');
const { BoundaryProvider, useRef, useBoundary } = require('react-ref-boundary');

describe('exports .cjs', () => {
  it('defaults', () => {
    assert.equal(typeof BoundaryProvider, 'function');
    assert.equal(typeof useRef, 'function');
    assert.equal(typeof useBoundary, 'function');
  });
  it('resolves one native entry for both import styles', () => {
    const root = path.dirname(require.resolve('react-ref-boundary/package.json'));
    const resolved = execFileSync(process.execPath, ['--conditions=react-native', '-p', "require.resolve('react-ref-boundary')"], { cwd: root, encoding: 'utf8' }).trim();
    assert.equal(resolved, path.join(root, 'dist/esm/index.js'));
  });
});
