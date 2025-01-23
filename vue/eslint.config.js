import globals from "globals";
import tsEslint from "typescript-eslint";
import eslintPluginVue from "eslint-plugin-vue";
import tailwindcss from "eslint-plugin-tailwindcss";
import prettier from "eslint-plugin-prettier/recommended";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  {
    files: ["**/*.{ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        /** @see https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser */
        parser: tsEslint.parser,
        projectService: true,
        extraFileExtensions: [".vue"],
      },
    },
  },
  ...tsEslint.configs.recommended,
  ...eslintPluginVue.configs["flat/recommended"],
  ...tailwindcss.configs["flat/recommended"],
  prettier,
  { ignores: ["dist", "node_modules"] },
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default config;
