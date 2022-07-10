/**
 * @jest-environment jsdom
 */

global.IS_REACT_ACT_ENVIRONMENT = true;

import assert from 'assert';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { BoundaryProvider, useRef, useBoundary } from 'react-ref-boundary';

describe('react-dom', function () {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  beforeEach(function () {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(function () {
    act(() => root.unmount());
    root = null;
    container.remove();
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

  function BoundaryChecker({ getRefs }) {
    const boundary = useBoundary();
    getRefs(boundary.refs);
    return <React.Fragment />;
  }

  it('refs', function () {
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
        </BoundaryProvider>,
      ),
    );
    assert.equal(refs.length, 2);
  });

  it('errors: useRef without provider', function () {
    try {
      act(() => root.render(<BoundaryComponent />));
    } catch (err) {
      assert.ok(err);
    }
  });

  it('errors: useBoundary without provider', function () {
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
