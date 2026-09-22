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
];
