import React from 'react';
import { createRoot } from 'react-dom/client';

import App from 'js/components/App';
import ThemeSwitcher from 'js/components/ThemeSwitcher';
import getInitialTheme from 'js/utils/getInitialTheme';
import getLanguageResolver from 'js/utils/getLanguageResolver';
import { LanguageContext } from 'js/contexts';
import registerServiceWorker from 'js/registerServiceWorker';
import english from 'json/language/en.json';

const initialTheme = getInitialTheme();

// Enable service worker if conditions satisfied
registerServiceWorker();

const languageWrapper = (children) => (
    <LanguageContext.Provider value={getLanguageResolver(english)}>
        {children}
    </LanguageContext.Provider>
);

// Render application
const root = createRoot(document.getElementById('mount'));
const headerActions = createRoot(document.getElementById('header-actions'));
root.render(languageWrapper(<App initialTheme={initialTheme} />));
headerActions.render(languageWrapper(<ThemeSwitcher initialTheme={initialTheme} />));
