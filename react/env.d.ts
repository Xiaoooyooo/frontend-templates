/// <reference types="vite/client" />

declare module "*.svg?jsx" {
  import React from "react";
  const C: React.FC<React.SVGAttributes<SVGElement>>;

  export default C;
}

declare namespace React {
  interface CSSProperties {
    // Allow custom CSS variables
    [key: `--${string}`]: string | number;
  }
}

declare const __DEV__: boolean;
