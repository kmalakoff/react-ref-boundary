import React from 'react';
export declare type RefContextType = {
    addRef: (ref: React.Ref<unknown>) => void;
    refs: React.Ref<unknown>[];
};
export interface BoundaryProviderProps {
    children?: React.ReactNode;
}
export declare const BoundaryProvider: React.FC<BoundaryProviderProps>;
export declare function useRef<T>(initialValue: T): React.RefObject<T>;
export declare function useBoundary(): {
    refs: React.Ref<unknown>[];
};
declare const _default: {
    BoundaryProvider: React.FC<BoundaryProviderProps>;
    useRef: typeof useRef;
    useBoundary: typeof useBoundary;
};
export default _default;
