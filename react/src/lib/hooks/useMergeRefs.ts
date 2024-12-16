import type { RefObject, RefCallback } from "react";

export default function useMergeRefs<T>(
  ...refs: (RefCallback<T> | RefObject<T> | null)[]
): RefCallback<T> {
  return function (instance: T) {
    const cleanups: ((() => void) | void)[] = [];
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        cleanups.push(ref(instance));
      } else if (ref) {
        ref.current = instance;
      }
    });

    return function () {
      cleanups.forEach((cleanup) => {
        cleanup?.();
      });
    };
  };
}
