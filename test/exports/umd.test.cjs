const assert = require('assert');

let umd = null;
try {
  umd = require('react-ref-boundary/umd');
} catch (_) {
  umd = require('react-ref-boundary/dist/umd/react-ref-boundary.cjs');
}
const reactRefBoundary = typeof window !== 'undefined' ? window.reactRefBoundary : umd.default || umd;
const { BoundaryProvider, useRef, useBoundary } = reactRefBoundary;

describe('exports umd', () => {
  it('defaults', () => {
    assert.equal(typeof BoundaryProvider, 'function');
    assert.equal(typeof useRef, 'function');
    assert.equal(typeof useBoundary, 'function');
  });
});
