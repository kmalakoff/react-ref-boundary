import type { FC, ReactNode, Ref, RefObject } from 'react';
export declare type RefContextType = {
    addRef: (ref: Ref<unknown>) => void;
    refs: Ref<unknown>[];
};
export interface BoundaryProviderProps {
    children?: ReactNode;
}
export declare const BoundaryProvider: FC<BoundaryProviderProps>;
export declare function useRef<T>(initialValue: T): RefObject<T>;
export declare function useBoundary(): {
    refs: Ref<unknown>[];
};
declare const _default: {
    BoundaryProvider: FC<BoundaryProviderProps>;
    useRef: typeof useRef;
    useBoundary: typeof useBoundary;
};
export default _default;
