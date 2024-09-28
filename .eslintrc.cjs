module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    // 'eslint:recommended',
    // 'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['unused-imports', '@typescript-eslint'],
  rules: {
    'unused-imports/no-unused-imports': 'warn',
    'no-duplicate-case': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-func-assign': 'error',
  },
  globals: {
    JSX: 'readonly',
  },
}
