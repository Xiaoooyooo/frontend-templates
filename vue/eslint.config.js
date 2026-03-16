import { defineConfig, globalIgnores } from "eslint/config";
import tsEslint from "typescript-eslint";
import eslintPluginVue from "eslint-plugin-vue";
import prettier from "eslint-plugin-prettier/recommended";

export default defineConfig(
  ...tsEslint.configs.recommended,
  ...eslintPluginVue.configs["flat/recommended"],
  prettier,
  globalIgnores(["dist", "node_modules"]),
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
);
