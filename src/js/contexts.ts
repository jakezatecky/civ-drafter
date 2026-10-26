import { createContext } from 'react';

import type { LanguageResolver } from '#js/utils/getLanguageResolver.ts';

const LanguageContext = createContext<LanguageResolver>((key) => key);

// eslint-disable-next-line import-x/prefer-default-export
export { LanguageContext };
