module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: false },
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  overrides: [
    {
      files: ["*.js", "*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "react/prop-types": "off",
        "prefer-const": ["error", { destructuring: "all" }],
      },
    },
  ],
  rules: {
    indent: ["error", 4, { SwitchCase: 1 }],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "space-before-function-paren": ["error", "always"],
    "key-spacing": ["error", { afterColon: true }],
    "arrow-spacing": [
      "error",
      {
        before: true,
        after: true,
      },
    ],
    "space-before-blocks": [
      "error",
      {
        functions: "never",
        keywords: "never",
        classes: "always",
      },
    ],
    "space-infix-ops": ["error", { int32Hint: false }],
    "space-unary-ops": [
      2,
      {
        words: true,
        nonwords: false,
        overrides: {
          new: false,
          "++": true,
        },
      },
    ],
    "padding-line-between-statements": [
      "error",
      {
        blankLine: "never",
        prev: "*",
        next: [
          "singleline-const",
          "singleline-let",
          "singleline-var",
          "expression",
        ],
      },
      {
        blankLine: "always",
        prev: "*",
        next: [
          "multiline-const",
          "multiline-let",
          "multiline-var",
          "multiline-expression",
          "multiline-block-like",
        ],
      },
      {
        blankLine: "always",
        prev: [
          "multiline-const",
          "multiline-let",
          "multiline-var",
          "multiline-expression",
          "multiline-block-like",
        ],
        next: "*",
      },
    ],
    "no-multiple-empty-lines": ["error", { max: 1 }],
    "object-curly-newline": [
      "error",
      {
        ObjectExpression: { multiline: true },
        ObjectPattern: { multiline: true },
        ImportDeclaration: "never",
        ExportDeclaration: { multiline: true },
      },
    ],
    "react/jsx-curly-newline": [
      "error",
      {
        multiline: "require",
        singleline: "forbid",
      },
    ],
    "react/jsx-props-no-multi-spaces": ["error"],
    "react/jsx-first-prop-new-line": ["error", "multiline"],
    "react/jsx-closing-bracket-location": [1, "line-aligned"],
    "object-curly-spacing": ["error", "never"],
    "brace-style": ["error", "1tbs"],
    "padded-blocks": ["error", "never"],
    "array-element-newline": ["error", "consistent"],
    "array-bracket-newline": ["error", "consistent"],
    "no-unused-vars": [
      "error",
      {
        vars: "local",
        ignoreRestSiblings: true,
      },
    ],
    "object-property-newline": [
      "error",
      { allowAllPropertiesOnSameLine: false },
    ],
    "comma-spacing": [
      "error",
      {
        before: false,
        after: true,
      },
    ],
    "quote-props": ["error", "as-needed"],
  },
};
