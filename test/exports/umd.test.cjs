const assert = require('assert');

const umd = require('react-ref-boundary/umd');
const reactRefBoundary = umd.default || umd;
const { BoundaryProvider, useRef, useBoundary } = reactRefBoundary;

describe('exports umd', () => {
  it('defaults', () => {
    assert.equal(typeof BoundaryProvider, 'function');
    assert.equal(typeof useRef, 'function');
    assert.equal(typeof useBoundary, 'function');
  });
});
