import PropTypes from 'prop-types';
import { useContext } from 'react';

import { LanguageContext } from '#js/contexts.js';

function hasClipboardApi() {
    return typeof ClipboardItem !== 'undefined' && 'write' in navigator.clipboard;
}

const propTypes = {
    domSelector: PropTypes.string.isRequired,
};

function CopyToClipboard({ domSelector }) {
    const language = useContext(LanguageContext);
    const copyText = language('actions.copyToClipboard');

    async function renderImage() {
        // Dynamically import `modern-screenshot` to avoid loading it unnecessarily
        const { domToBlob } = await import('modern-screenshot');
        const resultsArea = document.querySelector(domSelector);

        // Extract the background color (changes depending on theme)
        const body = document.querySelector('body');
        const bodyBg = window.getComputedStyle(body).getPropertyValue('background-color');

        return domToBlob(resultsArea, {
            backgroundColor: bodyBg,
            scale: 1,
            type: 'image/png',
        });
    }

    function onCopy() {
        // Hand the clipboard a pending image, rather than awaiting it first, as Safari rejects
        // clipboard writes that happen after the click event has finished
        navigator.clipboard.write([
            new ClipboardItem({ 'image/png': renderImage() }),
        ]).catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to copy draft results: ', error);
        });
    }

    // Ensure the browser supports the clipboard API
    if (!hasClipboardApi()) {
        return null;
    }

    return (
        <button
            aria-label={copyText}
            className="btn-copy"
            title={copyText}
            type="button"
            onClick={onCopy}
        >
            <span className="fa fa-copy" />
        </button>
    );
}

CopyToClipboard.propTypes = propTypes;

export default CopyToClipboard;
