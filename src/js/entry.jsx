import { marked } from 'marked';
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from '#js/components/App.jsx';
import HeaderActions from '#js/components/Header/HeaderActions.jsx';
import getInitialTheme from '#js/utils/getInitialTheme.js';
import getLanguageResolver from '#js/utils/getLanguageResolver.js';
import { LanguageContext } from '#js/contexts.js';
import registerServiceWorker from '#js/registerServiceWorker.js';
import english from '#json/language/en.json';

// Disable annoying deprecation warning for something we are not using
// https://github.com/markedjs/marked/issues/2793
marked.use({ mangle: false });

// Enable service worker if conditions satisfied
registerServiceWorker();

// Wrap apps with a language resolver
const languageWrapper = (children) => (
    <LanguageContext.Provider value={getLanguageResolver(english)}>
        {children}
    </LanguageContext.Provider>
);

// Get initial theme from user's saved or system settings
const initialTheme = getInitialTheme();

// Render application
const root = createRoot(document.getElementById('mount'));
const headerActions = createRoot(document.getElementById('header-actions'));
root.render(languageWrapper(<App initialTheme={initialTheme} />));
headerActions.render(languageWrapper(<HeaderActions initialTheme={initialTheme} />));
