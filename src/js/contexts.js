import { createContext } from 'react';

const ThemeContext = createContext('light');
const LanguageContext = createContext(() => {});

export {
    ThemeContext,
    LanguageContext,
};
