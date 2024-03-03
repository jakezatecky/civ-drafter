import React, { useContext } from 'react';

import { LanguageContext } from '#js/contexts.js';

function LoadingIndicator() {
    const language = useContext(LanguageContext);

    return (
        <div className="loading-indicator">
            <span aria-label={language('loading')} className="fa-solid fa-circle-notch fa-spin" />
        </div>
    );
}

export default LoadingIndicator;
