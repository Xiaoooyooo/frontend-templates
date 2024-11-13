import globals from "globals";
// import stylistic from "@stylistic/eslint-plugin";
import parserTs from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import tailwindcss from "eslint-plugin-tailwindcss";
import pluginPrettier from "eslint-plugin-prettier/recommended";

/** @type {import("eslint").Linter.Config} */
const config = [
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parser: parserTs,
      parserOptions: {
        projectService: true,
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        // project: "./tsconfig.json",
      },
    },
  },
  {
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  // stylistic.configs["disable-legacy"],
  ...tailwindcss.configs["flat/recommended"],
  { ignores: ["dist", "node_modules"] },
  pluginPrettier,
];

export default config;
