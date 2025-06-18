import type { FC, ReactNode, Ref, RefObject } from 'react';
import { createContext, createElement, useContext, useEffect, useRef as useReactRef, useState } from 'react';

export type RefContextType = {
  addRef: (ref: Ref<unknown>) => void;
  refs: Ref<unknown>[];
};

const RefContext = createContext<RefContextType | undefined>(undefined);

export interface BoundaryProviderProps {
  children?: ReactNode;
}
export const BoundaryProvider: FC<BoundaryProviderProps> = ({ children }) => {
  const state = useState([]);
  const refs = state[0];

  function addRef(ref) {
    refs.push(ref);
    return () => refs.splice(refs.indexOf(ref), 1);
  }

  return createElement(
    RefContext.Provider,
    {
      value: {
        addRef,
        refs,
      },
    },
    children
  );
};

export function useRef<T>(initialValue: T): RefObject<T> {
  const ref = useReactRef<T>(initialValue);
  const context = useContext(RefContext);
  if (!context) throw new Error('react-ref-boundary: addRef not found on context. You might be missing the BoundaryProvider or have multiple instances of react-ref-boundary');
  useEffect(() => context.addRef(ref));
  return ref;
}

export function useBoundary() {
  const context = useContext(RefContext);
  if (!context) throw new Error('Missing react-ref-boundary context. Check for correct use of BoundaryProvider');
  return { refs: context.refs };
}
