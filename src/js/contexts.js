import { createContext } from 'react';

const ThemeContext = createContext('light');
/** @type {import('react').Context<import('#js/utils/getLanguageResolver.js').LanguageResolver>} */
const LanguageContext = createContext((key) => key);

export {
    ThemeContext,
    LanguageContext,
};
