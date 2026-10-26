import { LanguageContext } from '#js/contexts.ts';
import getLanguageResolver from '#js/utils/getLanguageResolver.ts';
import english from '#json/language/en.json';

export default function wrapper({ children }) {
    return (
        <LanguageContext.Provider value={getLanguageResolver(english)}>
            {children}
        </LanguageContext.Provider>
    );
}
