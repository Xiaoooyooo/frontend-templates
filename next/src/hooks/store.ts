import { use } from "react";
import { useStore as _useStore } from "zustand";
import { AppState } from "@/store";
import { StoreContext } from "@/providers/StoreProvider";

type Selector<T> = (state: AppState) => T;

export function useStore<T>(selector: Selector<T>) {
  const store = use(StoreContext);

  if (!store) {
    throw new Error("`useStore` should use in `StoreProvider`");
  }

  return _useStore(store, selector);
}
