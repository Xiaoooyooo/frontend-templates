"use client";

import { useStore } from "@/hooks/store";
import Image from "next/image";

export default function Counter() {
  const { count, increment } = useStore((state) => state.counter);
  const { count1, increment1 } = useStore((state) => state.counter1);
  return (
    <div className="flex flex-col items-center pt-10">
      <div>
        This is an app created with
        <Image
          className="ml-2 inline align-bottom dark:invert"
          src="/next.svg"
          width={180}
          height={38}
          alt=""
        />
      </div>
      <div className="mt-10">
        counter is: {count}, counter1 is: {count1}
      </div>
      <div className="flex gap-4">
        <button className="cursor-pointer" onClick={() => increment(1)}>
          increment counter
        </button>
        <button className="cursor-pointer" onClick={() => increment1(1)}>
          increment counter1
        </button>
      </div>
    </div>
  );
}
