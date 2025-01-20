import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["**/legacy/", "**/dist/"],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        NodeJS: "readonly",
      },

      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",

      parserOptions: {
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: ".",
      },
    },

    rules: {
      "accessor-pairs": "error",
      "block-spacing": ["error", "never"],

      "brace-style": [
        "error",
        "stroustrup",
        {
          allowSingleLine: true,
        },
      ],

      curly: ["error", "multi-line", "consistent"],
      "dot-location": ["error", "property"],
      "dot-notation": "error",
      "func-call-spacing": "error",
      "handle-callback-err": "error",
      "key-spacing": "error",
      "keyword-spacing": "error",

      "new-cap": [
        "error",
        {
          newIsCap: true,
        },
      ],

      "no-array-constructor": "error",
      "no-caller": "error",
      "no-console": "error",
      "no-duplicate-imports": "error",
      "no-else-return": "error",
      "no-eval": "error",
      "no-floating-decimal": "error",
      "no-implied-eval": "error",
      "no-iterator": "error",
      "no-label-var": "error",
      "no-labels": "error",
      "no-lone-blocks": "error",
      "no-mixed-spaces-and-tabs": "error",
      "no-multi-spaces": "error",
      "no-multi-str": "error",
      "no-new": "error",
      "no-new-func": "error",
      "no-new-object": "error",
      "no-new-wrappers": "error",
      "no-octal-escape": "error",
      "no-path-concat": "error",
      "no-proto": "error",
      "no-prototype-builtins": "off",

      "no-redeclare": [
        "error",
        {
          builtinGlobals: true,
        },
      ],

      "no-self-compare": "error",
      "no-sequences": "error",

      "no-shadow": [
        "warn",
        {
          builtinGlobals: false,
          hoist: "functions",
        },
      ],

      "no-tabs": "error",
      "no-template-curly-in-string": "error",
      "no-throw-literal": "error",
      "no-undef": "error",
      "no-undef-init": "error",
      "no-unmodified-loop-condition": "error",
      "no-unneeded-ternary": "error",
      "no-useless-call": "error",
      "no-useless-computed-key": "error",
      "no-useless-constructor": "error",
      "no-useless-rename": "error",
      "no-var": "error",
      "no-whitespace-before-property": "error",

      "object-curly-spacing": [
        "error",
        "never",
        {
          objectsInObjects: false,
        },
      ],

      "object-property-newline": [
        "error",
        {
          allowAllPropertiesOnSameLine: true,
        },
      ],

      "operator-linebreak": [
        "error",
        "none",
        {
          overrides: {
            "?": "before",
            ":": "before",
            "&&": "before",
          },
        },
      ],

      "prefer-const": "error",

      "quote-props": [
        "error",
        "consistent-as-needed",
        {
          keywords: true,
        },
      ],

      quotes: [
        "error",
        "double",
        {
          allowTemplateLiterals: true,
        },
      ],

      "rest-spread-spacing": "error",
      semi: "error",
      "semi-spacing": "error",
      "space-before-blocks": "error",
      "space-in-parens": "error",
      "space-infix-ops": "error",

      "space-unary-ops": [
        "error",
        {
          words: true,
          nonwords: false,

          overrides: {
            typeof: false,
          },
        },
      ],

      "spaced-comment": [
        "error",
        "always",
        {
          exceptions: ["-", "*"],
        },
      ],

      "template-curly-spacing": "error",
      "wrap-iife": ["error", "inside"],
      "yield-star-spacing": "error",
      yoda: "error",
    },
  },
  {
    files: ["scripts/**/*"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
    },
  },
];
