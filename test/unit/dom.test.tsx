(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

import '../lib/polyfills.cjs';

import assert from 'assert';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { BoundaryProvider, type BoundaryRef, useBoundary, useRef } from 'react-ref-boundary';

const suite = typeof document === 'undefined' ? describe.skip : describe;

suite('react-dom', () => {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    {
      const r = root;
      if (r) act(() => r.unmount());
    }
    root = null;
    if (container) container.remove();
    container = null;
  });

  function NonBoundaryComponent() {
    const ref = React.useRef<HTMLDivElement>(null);
    return <div ref={ref} />;
  }

  function BoundaryComponent() {
    const ref = useRef<HTMLDivElement>(null);
    return <div ref={ref} />;
  }

  function BoundaryChecker({ getRefs }: { getRefs: (refs: readonly BoundaryRef[]) => void }) {
    const boundary = useBoundary();
    getRefs(boundary.refs);
    return <div />;
  }

  it('refs', () => {
    let refs: readonly BoundaryRef[] = [];
    function getRefs(x: readonly BoundaryRef[]) {
      refs = x;
    }
    assert.equal(refs.length, 0);
    {
      const r = root;
      if (r)
        act(() =>
          r.render(
            <BoundaryProvider>
              <BoundaryComponent />
              <NonBoundaryComponent />
              <BoundaryComponent />
              <BoundaryChecker getRefs={getRefs} />
            </BoundaryProvider>
          )
        );
    }
    assert.equal(refs.length, 2);
  });

  it('errors: useRef without provider', () => {
    {
      const r = root;
      assert.ok(r);
      assert.throws(() => act(() => r.render(<BoundaryComponent />)), /react-ref-boundary/);
    }
  });

  it('errors: useBoundary without provider', () => {
    let refs: readonly BoundaryRef[] = [];
    function getRefs(x: readonly BoundaryRef[]) {
      refs = x;
    }

    {
      const r = root;
      assert.ok(r);
      assert.throws(() => act(() => r.render(<BoundaryChecker getRefs={getRefs} />)), /react-ref-boundary/);
    }
    assert.equal(refs.length, 0);
  });
});
