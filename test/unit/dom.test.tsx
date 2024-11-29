// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true;
import '../lib/polyfills.cjs';

import assert from 'assert';
import React, { useRef as useReactRef } from 'react';
import { type Root, createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
// @ts-ignore
import { BoundaryProvider, useBoundary, useRef } from 'react-ref-boundary';

describe('react-dom', () => {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  beforeEach(() => {
    // @ts-ignore
    container = document.createElement('div');
    // @ts-ignore
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    root = null;
    // @ts-ignore
    container.remove();
    container = null;
  });

  function NonBoundaryComponent() {
    const ref = useReactRef<HTMLDivElement>(null);
    return <div ref={ref} />;
  }

  function BoundaryComponent() {
    const ref = useRef<HTMLDivElement>(null);
    return <div ref={ref} />;
  }

  function BoundaryChecker({ getRefs }) {
    const boundary = useBoundary();
    getRefs(boundary.refs);
    return <div />;
  }

  it('refs', () => {
    let refs = [];
    function getRefs(x) {
      refs = x;
    }
    assert.equal(refs.length, 0);
    act(() =>
      root.render(
        <BoundaryProvider>
          <BoundaryComponent />
          <NonBoundaryComponent />
          <BoundaryComponent />
          <BoundaryChecker getRefs={getRefs} />
        </BoundaryProvider>
      )
    );
    assert.equal(refs.length, 2);
  });

  it('errors: useRef without provider', () => {
    if (typeof window !== 'undefined') return; // fails on browser, but not node

    assert.throws(() => act(() => root.render(<BoundaryComponent />)));
  });

  it('errors: useBoundary without provider', () => {
    if (typeof window !== 'undefined') return; // fails on browser, but not node

    let refs = [];
    function getRefs(x) {
      refs = x;
    }

    assert.throws(() => act(() => root.render(<BoundaryChecker getRefs={getRefs} />)));
    assert.equal(refs.length, 0);
  });
});
