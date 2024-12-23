import { useEffect, useRef } from "react";

export default function useOnUpdated(hook: () => void, deps: any[]) {
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    const cleanup = hook();

    return cleanup;
  }, deps); // eslint-disable-line
}
