import path from "path";
import url from "url";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/*.svg?jsx",
      svgrOptions: {
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
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
