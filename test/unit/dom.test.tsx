(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

import assert from 'assert';
import React from 'react';

import { BoundaryProvider, type BoundaryRef, useBoundary, useRef } from 'react-ref-boundary';
import { act, type MountedRoot, mount, unmount } from '../lib/react-dom.tsx';

const invokeBoundaryRef = useRef;
const invokeBoundary = useBoundary;

const suite = typeof document === 'undefined' ? describe.skip : describe;

suite('react-dom', () => {
  let container: HTMLDivElement | null = null;
  let root: MountedRoot | null = null;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = mount(container);
  });

  afterEach(() => {
    {
      const r = root;
      unmount(r);
    }
    root = null;
    if (container) container.remove();
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

  function BoundaryChecker({ getRefs }: { getRefs: (refs: readonly BoundaryRef[]) => void }) {
    const boundary = useBoundary();
    getRefs(boundary.refs);
    return <div />;
  }

  it('refs', () => {
    let refs: readonly BoundaryRef[] = [];
    function getRefs(x: readonly BoundaryRef[]) {
      refs = x;
    }
    assert.equal(refs.length, 0);
    {
      const r = root;
      assert.ok(r);
      act(() =>
        r.render(
          <BoundaryProvider>
            <BoundaryComponent />
            <NonBoundaryComponent />
            <BoundaryComponent />
            <BoundaryChecker getRefs={getRefs} />
          </BoundaryProvider>
        )
      );
    }
    assert.equal(refs.length, 2);
  });

  it('keeps the registry and attached ref stable across rerenders', () => {
    let registry: readonly { current: unknown }[] = [];
    let renderCount = 0;
    function Reporter() {
      const boundary = useBoundary();
      if (renderCount++ === 0) registry = boundary.refs;
      else assert.strictEqual(boundary.refs, registry);
      return <div />;
    }
    function App({ value }: { value: string }) {
      return (
        <BoundaryProvider>
          <BoundaryComponent />
          <Reporter />
          <div>{value}</div>
        </BoundaryProvider>
      );
    }

    const r = root;
    assert.ok(r);
    act(() => {
      r.render(<App value="first" />);
    });
    const firstRef = registry[0];
    assert.equal(registry.length, 1);
    assert.notEqual(firstRef.current, null);
    act(() => {
      r.render(<App value="second" />);
    });
    assert.strictEqual(registry[0], firstRef);
    assert.notEqual(registry[0].current, null);
  });

  it('removes only the unmounted boundary component', () => {
    let registry: readonly { current: unknown }[] = [];
    function Reporter() {
      registry = useBoundary().refs;
      return <div />;
    }
    function BoundaryItem({ name }: { name: string }) {
      const ref = useRef<HTMLDivElement>(null);
      return <div id={name} ref={ref} />;
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

    const r = root;
    assert.ok(r);
    act(() => {
      r.render(<App showFirst={true} />);
    });
    const secondRef = registry[1];
    assert.equal(registry.length, 2);
    act(() => {
      r.render(<App showFirst={false} />);
    });
    assert.equal(registry.length, 1);
    assert.strictEqual(registry[0], secondRef);
  });

  it('keeps nested provider registries isolated', () => {
    let outer: readonly { current: unknown }[] = [];
    let inner: readonly { current: unknown }[] = [];
    function Reporter({ nested }: { nested: boolean }) {
      const refs = useBoundary().refs;
      if (nested) inner = refs;
      else outer = refs;
      return <div />;
    }
    function BoundaryItem() {
      const ref = useRef<HTMLDivElement>(null);
      return <div ref={ref} />;
    }

    const r = root;
    assert.ok(r);
    act(() =>
      r.render(
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
  });

  it('cleans up Strict Mode effect registration', () => {
    let registry: readonly { current: unknown }[] = [];
    function Reporter() {
      registry = useBoundary().refs;
      return <div />;
    }

    const r = root;
    assert.ok(r);
    act(() =>
      r.render(
        <React.StrictMode>
          <BoundaryProvider>
            <BoundaryComponent />
            <Reporter />
          </BoundaryProvider>
        </React.StrictMode>
      )
    );
    assert.equal(registry.length, 1);
  });

  it('errors: useRef without provider', () => {
    let capturedError: unknown;
    function MissingProvider() {
      try {
        invokeBoundaryRef<HTMLDivElement>(null);
      } catch (error) {
        capturedError = error;
      }
      return null;
    }

    const r = root;
    assert.ok(r);
    act(() => {
      r.render(<MissingProvider />);
    });
    assert.ok(capturedError instanceof Error);
    assert.ok(/react-ref-boundary/.test(capturedError.message));
  });

  it('errors: useBoundary without provider', () => {
    let capturedError: unknown;
    function MissingProvider() {
      try {
        invokeBoundary();
      } catch (error) {
        capturedError = error;
      }
      return null;
    }

    const r = root;
    assert.ok(r);
    act(() => {
      r.render(<MissingProvider />);
    });
    assert.ok(capturedError instanceof Error);
    assert.ok(/react-ref-boundary/.test(capturedError.message));
  });
});
