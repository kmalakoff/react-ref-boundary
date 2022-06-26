import React, { useState, useRef as useRefReact, useEffect, createContext, useContext } from 'react';
const RefContext = /*#__PURE__*/createContext(null);
export const BoundaryProvider = ({
  children
}) => {
  const [refs] = useState([]);

  function addRef(ref) {
    refs.push(ref);
    return () => refs.splice(refs.indexOf(ref), 1);
  }

  return /*#__PURE__*/React.createElement(RefContext.Provider, {
    value: {
      addRef,
      refs
    }
  }, children);
};
export function useRef() {
  const ref = useRefReact();
  const context = useContext(RefContext);
  if (!context) throw new Error('Missing react-ref-boundary context. Check for correct use of BoundaryProvider');
  useEffect(() => context.addRef(ref));
  return ref;
}
export function useBoundary() {
  const context = useContext(RefContext);
  if (!context) throw new Error('Missing react-ref-boundary context. Check for correct use of BoundaryProvider');
  return {
    refs: context.refs
  };
}
//# sourceMappingURL=index.mjs.map