import assert from 'assert';
// @ts-ignore
import { BoundaryProvider, useBoundary, useRef } from 'react-ref-boundary';

describe('exports .ts', () => {
  it('defaults', () => {
    assert.equal(typeof BoundaryProvider, 'function');
    assert.equal(typeof useRef, 'function');
    assert.equal(typeof useBoundary, 'function');
  });
});
