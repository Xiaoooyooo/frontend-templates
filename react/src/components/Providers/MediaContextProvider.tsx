import type { PropsWithChildren } from "react";
import MediaContext from "@/context/MediaContext";
import useMediaQuery from "@/lib/hooks/useMediaQuery";

export default function MediaContextProvider({ children }: PropsWithChildren) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return <MediaContext value={{ isMobile }}>{children}</MediaContext>;
}
