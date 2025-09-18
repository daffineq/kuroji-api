import baseConfig from '@hono/eslint-config';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  ...baseConfig,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.min.js',
      '.env*',
      '*.log',
      'tmp/**',
      'temp/**'
    ]
  },
  {
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'unicorn/prefer-optional-catch-binding': 'warn',
      'unicorn/filename-case': ['warn', { case: 'kebabCase' }],
      'unicorn/no-null': 'off',
      'unicorn/prefer-switch': 'warn',
      'unicorn/prefer-ternary': 'warn',
      'unicorn/prefer-top-level-await': 'warn',
      'unicorn/prefer-array-find': 'warn',
      'unicorn/no-array-reduce': 'off',
      'unicorn/prefer-logical-operator-over-ternary': 'warn',
      'unicorn/consistent-function-scoping': 'warn',
      'unicorn/prefer-object-from-entries': 'warn',
      'unicorn/prefer-modern-math-apis': 'warn',
      'unicorn/prefer-modern-dom-apis': 'warn'
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
      }
    }
  }
];
