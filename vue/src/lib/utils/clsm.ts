import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export default function clsm(...classes: ClassValue[]) {
  return twMerge(clsx(...classes));
}
