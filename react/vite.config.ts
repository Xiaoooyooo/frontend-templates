import path from "path";
import url from "url";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const __DEV__ = process.env.NODE_ENV !== "production";

export default defineConfig({
  plugins: [
    react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
    tailwindcss(),
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
  define: { __DEV__ },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
