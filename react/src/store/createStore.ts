import { create, type StateCreator } from "zustand";
import { devtools, type DevtoolsOptions } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export default function createStore<T>(
  setup: StateCreator<
    T,
    [["zustand/devtools", never], ["zustand/immer", never]]
  >,
  devOptions: DevtoolsOptions = {},
) {
  return create<T>()(
    devtools(immer(setup), Object.assign({ enabled: __DEV__ }, devOptions)),
  );
}
