# react-ref-boundary

React context for grouping react references by boundary in react dom, native and web. Ideal for group references for contains checks when using react portals.

```sh
npm install react-ref-boundary react
```

The package requires React and Node.js 16 or newer.

### Example 1

```tsx
import { Fragment, useRef as useReactRef } from "react";
import { BoundaryProvider, useRef, useBoundary } from "react-ref-boundary";

function NonBoundaryComponent() {
  const ref = useReactRef<HTMLDivElement>(null);
  return <div ref={ref} />;
}

function BoundaryComponent() {
  const ref = useRef<HTMLDivElement | null>(null);
  return <div ref={ref} />;
}

function BoundaryChecker() {
  const boundary = useBoundary();
  return (
    <button
      onClick={(event) => {
        if (
          !boundary.refs.some(
            (ref) => ref.current && ref.current.contains(event.target as Node),
          )
        ) {
          // outside all of the references
        }
      }}
    />
  );
}

function BoundaryReporter({ getRefs }) {
  const boundary = useBoundary();
  getRefs(boundary.refs);
  return <Fragment />;
}

export default function App() {
  return (
    <BoundaryProvider>
      <BoundaryComponent />
      <NonBoundaryComponent />
      <BoundaryComponent />
      <BoundaryChecker />
      <BoundaryReporter getRefs={(refs) => console.log(refs.length)} />
    </BoundaryProvider>
  );
}
```

### Documentation

[API Docs](https://kmalakoff.github.io/react-ref-boundary/)
