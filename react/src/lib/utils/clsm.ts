import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";

export default function clsm(...classNames: ClassValue[]) {
  return twMerge(clsx(...classNames));
}
