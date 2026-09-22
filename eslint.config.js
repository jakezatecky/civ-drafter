import takiyonConfig from 'eslint-config-takiyon-react';
import globals from 'globals';

export default [
    ...takiyonConfig,
    {
        // Front-end files
        files: ['src/js/**/*.{js,jsx}'],
        languageOptions: {
            globals: {
                APP_NAME: 'readonly',
                ...globals.browser,
            },
        },
    },
    {
        // Test files
        files: ['test/**/*.{js,jsx}'],
        languageOptions: {
            globals: {
                APP_NAME: 'readonly',
                ...globals.browser,
                ...globals.mocha,
            },
        },
    },
    {
        // Build files
        files: ['*.{js,jsx}'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
];
