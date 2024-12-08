import type { FC, ReactNode, Ref, RefObject } from 'react';
export type RefContextType = {
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
