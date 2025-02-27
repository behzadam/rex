import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  {
    // Global settings
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      globals: {
        node: true,
        es2021: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': ['error', { endOfLine: 'auto' }], // Enforce Prettier rules
      indent: 'off', // Disable ESLint's indent rule (Prettier handles it)
      quotes: 'off', // Disable ESLint's quotes rule (Prettier handles it)
      semi: 'off', // Disable ESLint's semi rule (Prettier handles it)
    },
  },
  {
    // TypeScript-specific rules
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
  {
    // Ignore files
    ignores: ['node_modules/', 'dist/'],
  },
]
