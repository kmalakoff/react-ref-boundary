/**
 * @jest-environment jsdom
 */

global.IS_REACT_ACT_ENVIRONMENT = true;

import assert from 'assert';
import { useRef as useReactRef } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { BoundaryProvider, useBoundary, useRef } from 'react-ref-boundary';

describe('react-dom', () => {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    root = null;
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
    return <useReactRefFragment />;
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
    try {
      act(() => root.render(<BoundaryComponent />));
    } catch (err) {
      assert.ok(err);
    }
  });

  it('errors: useBoundary without provider', () => {
    let refs = [];
    function getRefs(x) {
      refs = x;
    }

    try {
      act(() => root.render(<BoundaryChecker getRefs={getRefs} />));
    } catch (err) {
      assert.ok(err);
    }
    assert.equal(refs.length, 0);
  });
});
