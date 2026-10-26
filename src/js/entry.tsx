import { createRoot } from 'react-dom/client';

import App from '#js/components/App.tsx';
import getInitialTheme from '#js/utils/getInitialTheme.ts';
import getLanguageResolver from '#js/utils/getLanguageResolver.ts';
import { LanguageContext } from '#js/contexts.ts';
import registerServiceWorker from '#js/registerServiceWorker.ts';
import english from '#json/language/en.json';

// Enable service worker if conditions satisfied
registerServiceWorker();

// Render application, using the user's saved or system theme
const root = createRoot(document.getElementById('mount')!);
root.render(
    <LanguageContext.Provider value={getLanguageResolver(english)}>
        <App
            headerActionsContainer={document.getElementById('header-actions')!}
            initialTheme={getInitialTheme()}
        />
    </LanguageContext.Provider>,
);
