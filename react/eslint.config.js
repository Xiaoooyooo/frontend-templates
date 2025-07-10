import globals from "globals";
import tsEslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
// import tailwindcss from "eslint-plugin-tailwindcss";
import pluginPrettier from "eslint-plugin-prettier/recommended";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  {
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      sourceType: "module",
      globals: globals.browser,
      parser: tsEslint.parser,
      parserOptions: {
        projectService: true,
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
      },
    },
  },
  { plugins: { react: pluginReact } },
  {
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  ...tsEslint.configs.recommended,
  // ...tailwindcss.configs["flat/recommended"],
  pluginPrettier,
  { ignores: ["dist", "node_modules"] },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
];

export default config;
