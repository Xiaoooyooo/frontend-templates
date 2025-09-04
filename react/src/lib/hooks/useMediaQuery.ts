import { useEffect, useState } from "react";

export default function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => {
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    function onChange() {
      setMatch(media.matches);
    }
    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
    };
  }, [query]);

  return match;
}
