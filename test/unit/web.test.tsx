// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true;
import '../lib/polyfills.cjs'

import assert from 'assert';
import React, { useRef as useReactRef } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { View } from 'react-native-web';

// @ts-ignore
import { BoundaryProvider, useBoundary, useRef } from 'react-ref-boundary';

describe('react-native-web', () => {
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
    const ref = useReactRef<View>(null);
    return <View ref={ref} />;
  }

  function BoundaryComponent() {
    const ref = useRef<View>(null);
    return <View ref={ref} />;
  }

  function BoundaryChecker({ getRefs }) {
    const boundary = useBoundary();
    getRefs(boundary.refs);
    return <View />;
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
});
