import takiyonConfig from 'eslint-config-takiyon-react';
import globals from 'globals';

export default [
    ...takiyonConfig,
    {
        // Front-end and test files
        files: ['src/js/**/*.{js,jsx}', 'test/**/*.{js,jsx}'],
        languageOptions: {
            globals: globals.browser,
        },
    },
    {
        // Test files
        files: ['test/**/*.{js,jsx}'],
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
