import type { RefObject } from 'react';
import { BoundaryProvider, type BoundaryRef, type RefContextType, useBoundary, useRef } from 'react-ref-boundary';

export function Component() {
  const ref = useRef<HTMLDivElement>(null);
  const arbitraryRef = useRef({ value: 'stored' });
  const refs: readonly BoundaryRef[] = useBoundary().refs;
  const nullable: RefObject<HTMLDivElement | null> = ref;
  void nullable;
  void arbitraryRef;

  // @ts-expect-error: boundary registries are readonly to consumers
  refs.push(ref);

  return <BoundaryProvider />;
}

export function checkRegistrationTypes(context: RefContextType) {
  const callbackRef = (value: unknown) => value;

  // @ts-expect-error: boundary registration accepts object refs, not callback refs
  context.addRef(callbackRef);
}

void Component;
