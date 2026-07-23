import { useEffect } from "react";
import useCounterStore from "@/store/counter";
import { useThemeContext } from "@/context/ThemeContext";

export default function Home() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);

  useEffect(() => {
    console.log("count changed", count);
  }, [count]);

  return (
    <div>
      <h1 className="p-10 text-center text-3xl" onClick={increment}>
        Welcome Home, Counter is: {count}
      </h1>
    </div>
  );
}
