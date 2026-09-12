import assert from 'assert';
import type React from 'react';
import type { ComponentRef } from 'react';
import { act, useRef as useReactRef } from 'react';
import { BoundaryProvider, useBoundary, useRef } from 'react-ref-boundary';
import { createRoot } from 'test-renderer';

const Host = 'host' as unknown as React.ElementType;
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('component renderer', () => {
  function NonBoundaryComponent() {
    const ref = useReactRef<ComponentRef<typeof Host>>(null);
    return <Host ref={ref} />;
  }

  function BoundaryComponent() {
    const ref = useRef<ComponentRef<typeof Host> | null>(null);
    return <Host ref={ref} />;
  }

  function BoundaryChecker({ getRefs }: { getRefs: (refs: unknown) => void }) {
    const boundary = useBoundary();
    getRefs(boundary.refs);
    return <Host />;
  }

  it('collects refs from boundary components', async () => {
    let refs: unknown[] = [];
    function getRefs(x: unknown) {
      refs = x as unknown as unknown[];
    }
    const root = createRoot();
    assert.equal(refs.length, 0);
    try {
      await act(async () => {
        root.render(
          <BoundaryProvider>
            <BoundaryComponent />
            <NonBoundaryComponent />
            <BoundaryComponent />
            <BoundaryChecker getRefs={getRefs} />
          </BoundaryProvider>
        );
      });
      assert.equal(refs.length, 2);
    } finally {
      await act(async () => {
        root.unmount();
      });
    }
  });
});
