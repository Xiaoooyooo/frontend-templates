import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  createCounterSlice,
  createCounter1Slice,
  CounterState,
  CounterState1,
} from "./counter";
import { __DEV__ } from "@/lib/constants";

export type AppState = CounterState & CounterState1;

export function createAppStore() {
  return createStore<AppState>()(
    devtools(
      immer((...args) => ({
        ...createCounterSlice(...args),
        ...createCounter1Slice(...args),
      })),
      {
        enabled: __DEV__,
      },
    ),
  );
}
