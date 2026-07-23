import { createContext, use, type PropsWithChildren } from "react";
import useMediaQuery from "@/lib/hooks/useMediaQuery";

type IMediaContext = {
  isMobile: boolean;
};

const MediaContext = createContext({} as IMediaContext);

export function useMediaContext() {
  return use(MediaContext);
}

export function MediaContextProvider({ children }: PropsWithChildren) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return <MediaContext value={{ isMobile }}>{children}</MediaContext>;
}
