import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default tseslint.config(
  // ── Global ignores ──
  {
    ignores: ['dist/', 'coverage/', 'jest.config.js'],
  },

  // ── Base configs ──
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,

  // ── Main config ──
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ── Code quality (original custom rules) ──
      'max-lines': ['error', 500],
      'max-lines-per-function': ['error', 100],
      complexity: ['error', 20],
      'max-params': ['error', 6],
      'max-depth': ['error', 5],
      'max-nested-callbacks': ['error', 5],

      // ── Import sorting ──
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],

      // ── Best practices ──
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'no-console': 'error',

      // ── TypeScript rules (replaces airbnb-typescript/base) ──
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        { selector: 'typeLike', format: ['PascalCase'] },
      ],
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/dot-notation': ['error', { allowKeywords: true }],
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions', 'functions', 'methods'] }],
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-loop-func': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/only-throw-error': 'error',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: false, allowTernary: false, allowTaggedTemplates: false },
      ],
      '@typescript-eslint/no-use-before-define': ['error', { functions: true, classes: true, variables: true }],
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],

      // ── Relaxed TypeScript rules (from original config) ──
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // ── Prettier ──
      'prettier/prettier': ['error', { printWidth: 120 }],
    },
  },

  // ── Test file overrides ──
  {
    files: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
);
