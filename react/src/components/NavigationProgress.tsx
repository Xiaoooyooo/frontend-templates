import { useEffect, useState } from "react";

export default function NavigationProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: Timer;
    function update() {
      setProgress((p) => p + (100 - p) * 0.1);
      timer = setTimeout(update, 1000);
    }
    update();
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative h-[100dvh]">
      <div
        className="h-1 bg-sky-600 transition-all duration-200"
        style={{ width: progress + "%" }}
      />
    </div>
  );
}
