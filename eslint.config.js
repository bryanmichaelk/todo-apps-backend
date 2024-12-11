import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

/** @type {import('eslint').Linter.Config} */
export default [
  {
    files: ["**/*.{js,jsx}"], // Hanya berlaku untuk file JavaScript dan JSX
    languageOptions: {
      ecmaVersion: 2020, // Tentukan ECMAScript version
      globals: globals.browser, // Definisikan global untuk browser
    },
    plugins: {
      "react-hooks": reactHooks, // Plugin untuk hooks React
      "react-refresh": reactRefresh, // Plugin untuk refresh React
    },
    rules: {
      // Aturan untuk react-hooks
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Menonaktifkan aturan no-unused-vars
      "@eslint/js/no-unused-vars": "off",
    },
  },
];
