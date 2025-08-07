import createStore from "./createStore";

type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

export const useCounterStore = createStore<CounterState>((set, get, store) => {
  return {
    count: 0,
    increment() {
      set((state) => {
        state.count += 1;
      });
    },
    decrement() {
      set((state) => {
        state.count -= 1;
      });
    },
  };
});
