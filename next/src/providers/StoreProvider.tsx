"use client";
import { createAppStore } from "@/store";
import { createContext, PropsWithChildren, useState } from "react";

export const StoreContext = createContext(
  {} as ReturnType<typeof createAppStore>,
);

export function StoreProvider({ children }: PropsWithChildren) {
  const [store] = useState(() => {
    return createAppStore();
  });

  return <StoreContext value={store}>{children}</StoreContext>;
}
