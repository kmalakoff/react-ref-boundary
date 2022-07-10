import React from 'react';
const RefContext = /*#__PURE__*/ React.createContext(undefined);
export const BoundaryProvider = ({ children ,  })=>{
    const state = React.useState([]);
    const refs = state[0];
    function addRef(ref) {
        refs.push(ref);
        return ()=>refs.splice(refs.indexOf(ref), 1);
    }
    return /*#__PURE__*/ React.createElement(RefContext.Provider, {
        value: {
            addRef,
            refs
        }
    }, children);
};
export function useRef(initialValue) {
    const ref = React.useRef(initialValue);
    const context = React.useContext(RefContext);
    if (!context) throw new Error('react-ref-boundary: addRef not found on context. You might be missing the BoundaryProvider or have multiple instances of react-ref-boundary');
    React.useEffect(()=>context.addRef(ref));
    return ref;
}
export function useBoundary() {
    const context = React.useContext(RefContext);
    if (!context) throw new Error('Missing react-ref-boundary context. Check for correct use of BoundaryProvider');
    return {
        refs: context.refs
    };
}
export default {
    BoundaryProvider,
    useRef,
    useBoundary
};
