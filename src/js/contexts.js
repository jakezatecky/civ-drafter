import { createContext } from 'react';

/** @type {import('react').Context<import('#js/utils/getLanguageResolver.js').LanguageResolver>} */
const LanguageContext = createContext((key) => key);

// eslint-disable-next-line import-x/prefer-default-export
export { LanguageContext };
