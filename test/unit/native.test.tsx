import assert from 'assert';
import React from 'react';
import { create, act } from 'react-test-renderer';

import { View } from 'react-native';
import { BoundaryProvider, useRef, useBoundary } from 'react-ref-boundary';

describe('react-native', function () {
  function NonBoundaryComponent() {
    const ref = React.useRef<View>(null);
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

  it('refs', async function () {
    let refs = [];
    function getRefs(x) {
      refs = x;
    }
    assert.equal(refs.length, 0);
    await act(() =>
      create(
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
});
