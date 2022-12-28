import React from 'react';
import { createRoot } from 'react-dom/client';

import App from 'js/components/App';
import 'scss/app.scss';

// Fetch environment from window
const { APP_NAME } = window.env;

// Render application
const root = createRoot(document.getElementById('mount'));
root.render(<App name={APP_NAME} />);
