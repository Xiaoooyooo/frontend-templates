import { Linter } from "eslint";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";
import pluginVue from "eslint-plugin-vue";
import tailwindcss from "eslint-plugin-tailwindcss";
import parserTs from "@typescript-eslint/parser";
import pluginPrettier from "eslint-plugin-prettier/recommended";

/**
 * @type {Linter.Config}
 */
const config = [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parser: parserTs,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        projectService: true,
      },
    },
  },
  { ignores: ["dist", "node_modules"] },
  {
    /**
     * @see https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
     */
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  },
  stylistic.configs["disable-legacy"],
  ...pluginVue.configs["flat/recommended"],
  pluginPrettier,
  ...tailwindcss.configs["flat/recommended"],
  {
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
];

export default config;
