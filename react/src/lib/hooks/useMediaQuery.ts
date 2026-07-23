import { useEffect, useState } from "react";

export default function useMediaQuery(query: string) {
  const [media] = useState(() => window.matchMedia(query));
  const [match, setMatch] = useState(() => {
    return media.matches;
  });

  useEffect(() => {
    function onChange() {
      setMatch(media.matches);
    }
    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return match;
}
