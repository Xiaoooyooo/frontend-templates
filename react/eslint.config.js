import { defineConfig, globalIgnores } from "eslint/config";
import tsEslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import pluginPrettier from "eslint-plugin-prettier/recommended";

export default defineConfig(
  ...tsEslint.configs.recommended,
  // @see https://github.com/jsx-eslint/eslint-plugin-react#configuration-new-eslintconfigjs
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "19",
      },
    },
  },
  pluginReact.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  pluginPrettier,
  globalIgnores(["dist", "node_modules"]),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "react-hooks/immutability": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
);
