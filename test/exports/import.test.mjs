import assert from 'assert';
import { BoundaryProvider, useBoundary, useRef } from 'react-ref-boundary';

describe('exports .mjs', () => {
  it('defaults', () => {
    assert.equal(typeof BoundaryProvider, 'function');
    assert.equal(typeof useRef, 'function');
    assert.equal(typeof useBoundary, 'function');
  });
});
