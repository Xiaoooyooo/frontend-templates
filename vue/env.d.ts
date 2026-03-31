/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module "*.svg?component" {
  import type { FunctionalComponent, SVGAttributes } from "vue";
  const C: FunctionalComponent<SVGAttributes>;
  export default C;
}

type Timer = ReturnType<typeof setTimeout | typeof setInterval>;
