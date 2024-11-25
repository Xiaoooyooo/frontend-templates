import type { MutableRefObject, RefCallback } from "react";

export default function useMergeRefs<T>(
  ...refs: (RefCallback<T> | MutableRefObject<T> | null)[]
): RefCallback<T> {
  return function (instance: T) {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    });
  };
}
