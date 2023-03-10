import React from 'react';

import { LanguageContext } from 'js/contexts';
import getLanguageResolver from 'js/utils/getLanguageResolver';
import english from 'json/language/en.json';

export default function wrapper({ children }) {
    return (
        <LanguageContext.Provider value={getLanguageResolver(english)}>
            {children}
        </LanguageContext.Provider>
    );
}
