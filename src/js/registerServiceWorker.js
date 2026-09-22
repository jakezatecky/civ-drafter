/* global process */
/* eslint-disable no-console */

function registerServiceWorker() {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js').then(() => {
                // Success
            }).catch((registrationError) => {
                console.error('SW registration failed: ', registrationError);
            });
        });
    }
}

export default registerServiceWorker;
