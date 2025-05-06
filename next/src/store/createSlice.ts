import { StateCreator } from "zustand";
import { AppState } from ".";

type SliceCreator<T> = StateCreator<
  AppState,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  T
>;

export function createSlice<T>(sliceCreator: SliceCreator<T>) {
  return function (...args: Parameters<SliceCreator<T>>) {
    return sliceCreator(...args);
  };
}
