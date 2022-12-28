import React from 'react';
import { createRoot } from 'react-dom/client';

import App from 'js/components/App';
import 'scss/app.scss';

// Render application
const root = createRoot(document.getElementById('mount'));
root.render(<App />);
