import React from 'react';

function LoadingIndicator() {
    return (
        <div className="loading-indicator">
            <span aria-label="Loading..." className="fa-solid fa-circle-notch fa-spin" />
        </div>
    );
}

export default LoadingIndicator;
