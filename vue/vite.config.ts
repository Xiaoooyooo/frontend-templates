import url from "url";
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgr from "vite-svg-loader";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    svgr({
      svgoConfig: {
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                // viewBox is required to resize SVGs with CSS.
                // @see https://github.com/svg/svgo/issues/1128
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
