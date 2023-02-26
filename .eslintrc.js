module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  ignorePatterns: "*.test.ts",
  rules: {
    "handle-callback-err": "warn",
    "max-nested-callbacks": ["error", { max: 4 }],
    "max-statements-per-line": ["error", { max: 2 }],
    "no-empty-function": "error",
    "no-shadow": "off", // we will use a ts-specific rule.
    "no-var": "error",
    "prefer-const": "error",
    yoda: "error",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
      },
    ],
  },
};
