import React from 'react';

import { LanguageContext } from '#js/contexts.js';
import getLanguageResolver from '#js/utils/getLanguageResolver.js';
import english from '#json/language/en.json';

export default function wrapper({ children }) {
    return (
        <LanguageContext.Provider value={getLanguageResolver(english)}>
            {children}
        </LanguageContext.Provider>
    );
}
