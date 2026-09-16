import assert from 'assert';
import type React from 'react';
import { act, useRef as useReactRef } from 'react';
import { BoundaryProvider, type BoundaryRef, useBoundary, useRef } from 'react-ref-boundary';
import { createRoot } from 'test-renderer';

const Host = 'host' as unknown as React.ElementType;
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('component renderer', () => {
  function NonBoundaryComponent() {
    const ref = useReactRef<unknown>(null);
    return <Host ref={ref} />;
  }

  function BoundaryComponent() {
    const ref = useRef<unknown>(null);
    return <Host ref={ref} />;
  }

  function BoundaryChecker({ getRefs }: { getRefs: (refs: readonly BoundaryRef[]) => void }) {
    const boundary = useBoundary();
    getRefs(boundary.refs);
    return <Host />;
  }

  it('collects refs from boundary components', async () => {
    let refs: readonly BoundaryRef[] = [];
    function getRefs(x: readonly BoundaryRef[]) {
      refs = x;
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
      assert.notEqual(refs[0].current, null);
    } finally {
      await act(async () => {
        root.unmount();
      });
    }
  });

  it('keeps the registry and attached ref stable across rerenders', async () => {
    let registry: readonly { current: unknown }[] = [];
    let renderCount = 0;
    function Reporter() {
      const boundary = useBoundary();
      if (renderCount++ === 0) registry = boundary.refs;
      else assert.strictEqual(boundary.refs, registry);
      return <Host />;
    }
    function App({ value }: { value: string }) {
      return (
        <BoundaryProvider>
          <BoundaryComponent />
          <Reporter />
          <Host>{value}</Host>
        </BoundaryProvider>
      );
    }

    const root = createRoot();
    try {
      await act(async () => root.render(<App value="first" />));
      const firstRef = registry[0];
      assert.equal(registry.length, 1);
      assert.notEqual(firstRef.current, null);
      await act(async () => root.render(<App value="second" />));
      assert.strictEqual(registry[0], firstRef);
      assert.notEqual(registry[0].current, null);
    } finally {
      await act(async () => root.unmount());
    }
  });

  it('removes only the unmounted boundary component', async () => {
    let registry: readonly { current: unknown }[] = [];
    function Reporter() {
      registry = useBoundary().refs;
      return <Host />;
    }
    function BoundaryItem({ name }: { name: string }) {
      const ref = useRef<unknown>(null);
      return <Host id={name} ref={ref} />;
    }
    function App({ showFirst }: { showFirst: boolean }) {
      return (
        <BoundaryProvider>
          {showFirst && <BoundaryItem name="first" />}
          <BoundaryItem name="second" />
          <Reporter />
        </BoundaryProvider>
      );
    }

    const root = createRoot();
    try {
      await act(async () => root.render(<App showFirst={true} />));
      const secondRef = registry[1];
      assert.equal(registry.length, 2);
      await act(async () => root.render(<App showFirst={false} />));
      assert.equal(registry.length, 1);
      assert.strictEqual(registry[0], secondRef);
    } finally {
      await act(async () => root.unmount());
    }
  });

  it('keeps nested provider registries isolated', async () => {
    let outer: readonly { current: unknown }[] = [];
    let inner: readonly { current: unknown }[] = [];
    function Reporter({ nested }: { nested: boolean }) {
      const refs = useBoundary().refs;
      if (nested) inner = refs;
      else outer = refs;
      return <Host />;
    }
    function BoundaryItem() {
      const ref = useRef<unknown>(null);
      return <Host ref={ref} />;
    }

    const root = createRoot();
    try {
      await act(async () =>
        root.render(
          <BoundaryProvider>
            <BoundaryItem />
            <Reporter nested={false} />
            <BoundaryProvider>
              <BoundaryItem />
              <Reporter nested={true} />
            </BoundaryProvider>
          </BoundaryProvider>
        )
      );
      assert.equal(outer.length, 1);
      assert.equal(inner.length, 1);
      assert.notStrictEqual(outer, inner);
    } finally {
      await act(async () => root.unmount());
    }
  });

  it('cleans up Strict Mode effect registration', async () => {
    let registry: readonly { current: unknown }[] = [];
    function Reporter() {
      registry = useBoundary().refs;
      return <Host />;
    }
    const root = createRoot({ isStrictMode: true });
    try {
      await act(async () =>
        root.render(
          <BoundaryProvider>
            <BoundaryComponent />
            <Reporter />
          </BoundaryProvider>
        )
      );
      assert.equal(registry.length, 1);
    } finally {
      await act(async () => root.unmount());
    }
  });
});
