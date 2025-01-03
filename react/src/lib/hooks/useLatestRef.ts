import { useRef } from "react";

export default function useLatestRef<T>(value: T) {
  const ref = useRef(value);

  ref.current = value;

  return ref;
}
