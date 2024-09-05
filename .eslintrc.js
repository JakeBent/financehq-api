module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-underscore-dangle': 0,
    quotes: ['error', 'single', { avoidEscape: true }],
  },
};
