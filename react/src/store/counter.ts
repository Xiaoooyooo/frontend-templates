import { atom } from "jotai";

export const count = atom(0);

// readonly atom
export const double = atom((get) => {
  return get(count) * 2;
});

// writeonly atom
// updating the value using the write-only atom prevents the extra rerenders in our app.
export const increment = atom(null, (get, set) => {
  set(count, get(count) + 1);
});
