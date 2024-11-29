/// <reference types="vite/client" />

declare module "*.svg?jsx" {
  import React from "react";
  const C: React.FC<React.SVGAttributes<SVGElement>>;

  export default C;
}

declare const Timer: ReturnType<typeof setTimeout | typeof setInterval>;
