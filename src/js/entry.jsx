import React from 'react';
import { createRoot } from 'react-dom/client';

import App from 'js/components/App';
import ThemeSwitcher from 'js/components/ThemeSwitcher';
import getInitialTheme from 'js/utils/getInitialTheme';
import registerServiceWorker from 'js/registerServiceWorker';
import 'scss/app.scss';

const initialTheme = getInitialTheme();

// Enable service worker if conditions satisfied
registerServiceWorker();

// Render application
const root = createRoot(document.getElementById('mount'));
const headerActions = createRoot(document.getElementById('header-actions'));
root.render(<App initialTheme={initialTheme} />);
headerActions.render(<ThemeSwitcher initialTheme={initialTheme} />);
