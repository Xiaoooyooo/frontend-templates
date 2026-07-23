import createStore from "./createStore";

type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

const useCounterStore = createStore<CounterState>((set, get, store) => {
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

export default useCounterStore;
