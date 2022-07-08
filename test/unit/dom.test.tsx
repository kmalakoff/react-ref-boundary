/**
 * @jest-environment jsdom
 */

import assert from 'assert';
import React from 'react';
import { render } from '@testing-library/react';

import { BoundaryProvider, useRef, useBoundary } from 'react-ref-boundary';

describe('react-dom', function () {
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
    render(
      <BoundaryProvider>
        <BoundaryComponent />
        <NonBoundaryComponent />
        <BoundaryComponent />
        <BoundaryChecker getRefs={getRefs} />
      </BoundaryProvider>,
    );
    assert.equal(refs.length, 2);
  });

  it('errors: useRef without provider', function () {
    try {
      render(<BoundaryComponent />);
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
      render(<BoundaryChecker getRefs={getRefs} />);
    } catch (err) {
      assert.ok(err);
    }
    assert.equal(refs.length, 0);
  });
});
