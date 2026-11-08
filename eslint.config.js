import js from "@eslint/js";
import noUnsanitized from "eslint-plugin-no-unsanitized";
import security from "eslint-plugin-security";

const browserGlobals = {
  __DEPLOY_PREVIEW__: "readonly",
  clearTimeout: "readonly",
  AbortSignal: "readonly",
  console: "readonly",
  document: "readonly",
  fetch: "readonly",
  FormData: "readonly",
  IntersectionObserver: "readonly",
  localStorage: "readonly",
  requestAnimationFrame: "readonly",
  setTimeout: "readonly",
  URLSearchParams: "readonly",
  URL: "readonly",
  window: "readonly",
};

export default [
  {
    ignores: ["dist/**", "node_modules/**", "tmp/**"],
  },
  js.configs.recommended,
  security.configs.recommended,
  noUnsanitized.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: browserGlobals,
    },
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
      "security/detect-object-injection": "off",
    },
  },
];
