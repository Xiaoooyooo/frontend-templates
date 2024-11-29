/// <reference types="vite/client" />

declare module "*.svg?component" {
  import type { FunctionalComponent, SVGAttributes } from "vue";
  const C: FunctionalComponent<SVGAttributes>;
  export default C;
}

declare const Timer: ReturnType<typeof setTimeout | typeof setInterval>;
