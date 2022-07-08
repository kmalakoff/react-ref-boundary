/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const { BoundaryProvider, useRef, useBoundary } = require('react-ref-boundary');

describe('exports .cjs', function () {
  it('defaults', function () {
    assert.equal(typeof BoundaryProvider, 'function');
    assert.equal(typeof useRef, 'function');
    assert.equal(typeof useBoundary, 'function');
  });
});
