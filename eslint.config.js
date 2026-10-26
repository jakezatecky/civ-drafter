import takiyonConfig from 'eslint-config-takiyon-react';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

// Flag unused arguments, unless named with a leading `_` to show that they are deliberately unused
const unusedVarsOptions = {
    vars: 'all',
    args: 'all',
    argsIgnorePattern: '^_',
    ignoreRestSiblings: true,
};

export default [
    ...takiyonConfig,
    ...tsEslint.configs.recommendedTypeChecked.map((config) => ({
        ...config,
        files: ['**/*.{ts,tsx}'],
    })),
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
        rules: {
            '@typescript-eslint/no-deprecated': 'error',
            '@typescript-eslint/no-unused-vars': ['error', unusedVarsOptions],
        },
    },
    {
        files: ['**/*.{js,jsx}'],
        rules: {
            'no-unused-vars': ['error', unusedVarsOptions],
        },
    },
    {
        rules: {
            'react/jsx-filename-extension': ['error', {
                allow: 'as-needed',
                extensions: ['jsx', 'tsx'],
            }],
            // TypeScript already rejects props that a component's type does not declare
            'react/prop-types': 'off',
        },
    },
    {
        // Front-end and test files
        files: ['src/js/**/*.{ts,tsx}', 'test/**/*.{js,ts,tsx}'],
        languageOptions: {
            globals: globals.browser,
        },
    },
    {
        // Test files
        files: ['test/**/*.{js,ts,tsx}'],
        languageOptions: {
            globals: globals.mocha,
        },
    },
    {
        // Build files
        files: ['*.js'],
        languageOptions: {
            globals: globals.node,
        },
    },
    {
        // Command-line scripts for generating assets, which report their progress to the console
        files: ['scripts/**/*.js'],
        languageOptions: {
            globals: globals.node,
        },
        rules: {
            'import-x/no-extraneous-dependencies': ['error', {
                devDependencies: true,
                optionalDependencies: false,
            }],
            'no-console': 'off',
        },
    },
];
