"use client";

import { useStore } from "@/hooks/store";

export default function Counter() {
  const { count, increment } = useStore((state) => state.counter);
  const { count1, increment1 } = useStore((state) => state.counter1);
  return (
    <div>
      <p>
        counter is: {count}, counter1 is: {count1}
      </p>
      <button onClick={() => increment(1)}>increment counter</button>
      <button onClick={() => increment1(1)}>increment counter1</button>
    </div>
  );
}
