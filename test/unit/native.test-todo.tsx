import assert from 'assert';
import type { ComponentRef } from 'react';
import { useRef as useReactRef } from 'react';
import { View } from 'react-native';
import { BoundaryProvider, useBoundary, useRef } from 'react-ref-boundary';
// @ts-expect-error: no types for react-test-renderer
import { act, create } from 'react-test-renderer';

describe('react-native', () => {
  function NonBoundaryComponent() {
    const ref = useReactRef<ComponentRef<typeof View>>(null);
    return <View ref={ref} />;
  }

  function BoundaryComponent() {
    const ref = useRef<ComponentRef<typeof View> | null>(null);
    return <View ref={ref} />;
  }

  function BoundaryChecker({ getRefs }: { getRefs: (refs: unknown) => void }) {
    const boundary = useBoundary();
    getRefs(boundary.refs);
    return <View />;
  }

  it('refs', async () => {
    let refs: unknown[] = [];
    function getRefs(x: unknown) {
      refs = x as unknown as unknown[];
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
