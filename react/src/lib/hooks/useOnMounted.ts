import { useEffect } from "react";

export default function useOnMounted(hook: () => void | (() => void)) {
  useEffect(() => {
    const cleanup = hook();

    return cleanup;
  }, []); // eslint-disable-line
}
