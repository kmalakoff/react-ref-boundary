const assert = require('assert');
const { BoundaryProvider, useRef, useBoundary } = require('react-ref-boundary/dist/umd/react-ref-boundary.min.js');

describe('exports react-ref-boundary/dist/umd/react-ref-boundary.js', () => {
  it('defaults', () => {
    assert.equal(typeof BoundaryProvider, 'function');
    assert.equal(typeof useRef, 'function');
    assert.equal(typeof useBoundary, 'function');
  });
});
