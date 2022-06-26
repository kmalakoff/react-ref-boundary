import React, { Ref, RefObject, ReactNode } from 'react';
export declare type RefContextType = {
    addRef: (ref: Ref<unknown>) => void;
    refs: Ref<unknown>[];
};
export interface BoundaryProviderProps {
    children?: ReactNode;
}
export declare const BoundaryProvider: React.FC<BoundaryProviderProps>;
export declare function useRef<T>(): RefObject<T>;
export declare function useBoundary(): {
    refs: React.Ref<unknown>[];
};
