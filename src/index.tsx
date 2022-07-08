import React from 'react';

export type RefContextType = {
  addRef: (ref: React.Ref<unknown>) => void;
  refs: React.Ref<unknown>[];
};

const RefContext = React.createContext<RefContextType | undefined>(undefined);

export interface BoundaryProviderProps {
  children?: React.ReactNode;
}
export const BoundaryProvider: React.FC<BoundaryProviderProps> = ({
  children,
}) => {
  const state = React.useState([]);
  const refs = state[0];

  function addRef(ref) {
    refs.push(ref);
    return () => refs.splice(refs.indexOf(ref), 1);
  }

  return (
    <RefContext.Provider value={{ addRef, refs }}>
      {children}
    </RefContext.Provider>
  );
};

export function useRef<T>(initialValue: T): React.RefObject<T> {
  const ref = React.useRef<T>(initialValue);
  const context = React.useContext(RefContext);
  if (!context)
    throw new Error(
      'react-ref-boundary: addRef not found on context. You might be missing the BoundaryProvider or have multiple instances of react-ref-boundary',
    );
  React.useEffect(() => context.addRef(ref));
  return ref;
}

export function useBoundary() {
  const context = React.useContext(RefContext);
  if (!context)
    throw new Error(
      'Missing react-ref-boundary context. Check for correct use of BoundaryProvider',
    );
  return { refs: context.refs };
}
