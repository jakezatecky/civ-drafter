import html2canvas from 'html2canvas';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import rgb2hex from 'rgb2hex';

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

    function onCopy() {
        const resultsArea = document.querySelector(domSelector);

        // Extract the background color (changes depending on theme)
        const body = document.querySelector('body');
        const bodyBg = window.getComputedStyle(body).getPropertyValue('background-color');

        // Convert to hex (a requirement for `html2canvas`)
        const { hex: bodyBgHex } = rgb2hex(bodyBg);

        html2canvas(resultsArea, {
            backgroundColor: bodyBgHex,
            logging: false,
            scale: 1,
        }).then((canvas) => {
            // Write canvas to clipboard
            canvas.toBlob((blob) => {
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob }),
                ]);
            });
        });
    }

    // Some browsers (e.g., Firefox) do not yet support this feature
    if (!hasClipboardApi()) {
        return null;
    }

    return (
        <button
            aria-label={copyText}
            className="btn btn-primary btn-copy"
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
