import { createRoot } from 'react-dom/client';

import App from '#js/components/App.jsx';
import getInitialTheme from '#js/utils/getInitialTheme.js';
import getLanguageResolver from '#js/utils/getLanguageResolver.js';
import { LanguageContext } from '#js/contexts.js';
import registerServiceWorker from '#js/registerServiceWorker.js';
import english from '#json/language/en.json';

// Enable service worker if conditions satisfied
registerServiceWorker();

// Render application, using the user's saved or system theme
const root = createRoot(document.getElementById('mount'));
root.render(
    <LanguageContext.Provider value={getLanguageResolver(english)}>
        <App
            headerActionsContainer={document.getElementById('header-actions')}
            initialTheme={getInitialTheme()}
        />
    </LanguageContext.Provider>,
);
