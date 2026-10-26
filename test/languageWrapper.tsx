import type { ReactNode } from 'react';

import { LanguageContext } from '#js/contexts.ts';
import getLanguageResolver from '#js/utils/getLanguageResolver.ts';
import english from '#json/language/en.json';

interface WrapperProps {
    children: ReactNode;
}

export default function wrapper({ children }: WrapperProps) {
    return (
        <LanguageContext.Provider value={getLanguageResolver(english)}>
            {children}
        </LanguageContext.Provider>
    );
}
