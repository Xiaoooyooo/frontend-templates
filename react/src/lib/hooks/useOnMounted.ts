import { useEffect, useRef } from "react";

export default function useOnMounted(hook: () => void) {
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (isMountedRef.current) {
      return;
    }
    isMountedRef.current = true;
    hook();
  }, []); // eslint-disable-line
}
