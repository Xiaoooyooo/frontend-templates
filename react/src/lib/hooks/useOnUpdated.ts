import { useEffect, useRef } from "react";
import useLatestRef from "./useLatestRef";

export default function useOnUpdated(hook: () => void, deps: any[]) {
  const isMountedRef = useRef(false);
  const hookRef = useLatestRef(hook);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    hookRef.current();
  }, deps); // eslint-disable-line
}
