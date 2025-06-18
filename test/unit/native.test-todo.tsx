import assert from 'assert';
import { useRef as useReactRef } from 'react';
import { View } from 'react-native';
// @ts-ignore
import { BoundaryProvider, useBoundary, useRef } from 'react-ref-boundary';
import { act, create } from 'react-test-renderer';

describe('react-native', () => {
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

  it('refs', async () => {
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
        </BoundaryProvider>
      )
    );
    assert.equal(refs.length, 2);
  });
});
