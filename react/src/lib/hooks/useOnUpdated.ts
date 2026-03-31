import { useEffect, useRef, type DependencyList } from "react";

export default function useOnUpdated(hook: () => void, deps: DependencyList) {
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      return;
    }
    const cleanup = hook();

    return cleanup;
  }, deps); // eslint-disable-line

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
}
