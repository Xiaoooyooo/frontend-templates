import { createSlice } from "./createSlice";

export type CounterState = {
  // namespace
  counter: {
    count: number;
    increment: (delta?: number) => void;
  };
};

export const createCounterSlice = createSlice<CounterState>((set) => ({
  counter: {
    count: 0,
    increment(delta = 1) {
      set((state) => {
        state.counter.count += delta;
      });
    },
  },
}));

export type CounterState1 = {
  counter1: {
    count1: 0;
    increment1: (delta?: number) => void;
  };
};

export const createCounter1Slice = createSlice<CounterState1>((set) => ({
  counter1: {
    count1: 0,
    increment1(delta = 1) {
      set((state) => {
        state.counter1.count1 += delta;
      });
    },
  },
}));
