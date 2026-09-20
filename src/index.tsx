import React, { type FC, type ReactNode, type RefObject } from 'react';

const { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef: useReactRef } = React;

export type BoundaryRef = RefObject<unknown>;

export type RefContextType = {
  addRef: (ref: BoundaryRef) => () => void;
  refs: readonly BoundaryRef[];
};

const RefContext = createContext<RefContextType | undefined>(undefined);

export interface BoundaryProviderProps {
  children?: ReactNode;
}
export const BoundaryProvider: FC<BoundaryProviderProps> = ({ children }) => {
  const refs = useReactRef<BoundaryRef[]>([]);
  const addRef = useCallback((ref: BoundaryRef) => {
    refs.current.push(ref);
    let registered = true;
    return () => {
      if (!registered) return;
      registered = false;
      const index = refs.current.indexOf(ref);
      if (index >= 0) refs.current.splice(index, 1);
    };
  }, []);
  const contextValue = useMemo<RefContextType>(() => ({ addRef, refs: refs.current }), [addRef]);

  return createElement(
    RefContext.Provider,
    {
      value: contextValue,
    },
    children
  );
};

export function useRef<T>(initialValue: T): RefObject<T>;
export function useRef<T>(initialValue: T | null): RefObject<T | null>;
export function useRef<T>(initialValue: T | null): RefObject<T | null> {
  const ref = useReactRef<T | null>(initialValue);
  const context = useContext(RefContext);
  if (!context) throw new Error('react-ref-boundary: addRef not found on context. You might be missing the BoundaryProvider or have multiple instances of react-ref-boundary');
  useEffect(() => context.addRef(ref), [context]);
  return ref;
}

export function useBoundary(): Readonly<{ refs: readonly BoundaryRef[] }> {
  const context = useContext(RefContext);
  if (!context) throw new Error('Missing react-ref-boundary context. Check for correct use of BoundaryProvider');
  return { refs: context.refs };
}
