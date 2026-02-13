import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";

export default defineConfig(
  globalIgnores(["node_modules", "dist"]),
  tseslint.configs.recommended,
  prettier,
  {
    rules: {},
  },
);
