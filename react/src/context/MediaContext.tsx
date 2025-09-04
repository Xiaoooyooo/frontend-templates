import { createContext, use } from "react";

type IMediaContext = {
  isMobile: boolean;
};

const MediaContext = createContext({} as IMediaContext);

export function useMediaContext() {
  return use(MediaContext);
}

export default MediaContext;
