(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

import '../lib/polyfills.cjs';

import assert from 'assert';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { BoundaryProvider, useBoundary, useRef } from 'react-ref-boundary';

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
    const ref = useRef<HTMLDivElement | null>(null);
    return <div ref={ref} />;
  }

  function BoundaryChecker({ getRefs }: { getRefs: (refs: unknown) => void }) {
    const boundary = useBoundary();
    getRefs(boundary.refs);
    return <div />;
  }

  it('refs', () => {
    let refs: unknown[] = [];
    function getRefs(x: unknown) {
      refs = x as unknown as unknown[];
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
    if (typeof window !== 'undefined') return; // fails on browser, but not node

    {
      const r = root;
      if (r) assert.throws(() => act(() => r.render(<BoundaryComponent />)));
    }
  });

  it('errors: useBoundary without provider', () => {
    if (typeof window !== 'undefined') return; // fails on browser, but not node

    let refs: unknown[] = [];
    function getRefs(x: unknown) {
      refs = x as unknown as unknown[];
    }

    {
      const r = root;
      if (r) assert.throws(() => act(() => r.render(<BoundaryChecker getRefs={getRefs} />)));
    }
    assert.equal(refs.length, 0);
  });
});
