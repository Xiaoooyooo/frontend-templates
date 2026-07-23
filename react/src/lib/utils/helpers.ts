// General-purpose utility functions

import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";

/**
 * @param classNames classNames to merge
 * @returns merged classNames
 */
export function clsm(...classNames: ClassValue[]) {
  return twMerge(clsx(...classNames));
}

/**
 * @param func function to debounce
 * @param delay debounce delay time (milliseconds)
 * @returns debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: number;
  return function (this: ThisType<T>, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * @param func function to throttle
 * @param delay throttle delay time (milliseconds)
 * @returns throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: number;
  return function (this: ThisType<T>, ...args: Parameters<T>) {
    if (timeoutId) {
      return;
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = 0;
    }, delay);
  };
}

/**
 * @param min minimum value
 * @param max maximum value
 * @returns random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param length length of random string
 * @returns random string of specified length
 */
export function randomString(length: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomInt(0, chars.length - 1));
  }
  return result;
}

/**
 * @description sleep for specified time (milliseconds)
 * @param delay sleep time (milliseconds)
 * @param signal abort signal
 */
export async function sleep(delay: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(resolve, delay);
    signal?.addEventListener("abort", (e) => {
      clearTimeout(timeoutId);
      reject(e);
    });
  });
}
