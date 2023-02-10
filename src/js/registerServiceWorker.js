/* eslint-disable no-console */
/* global REGISTER_SERVICE_WORKER */

function registerServiceWorker() {
    if ('serviceWorker' in navigator && REGISTER_SERVICE_WORKER) {
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
