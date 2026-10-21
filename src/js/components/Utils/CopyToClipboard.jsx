import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import { LanguageContext } from '#js/contexts.js';

// How long the success or failure message remains visible
const messageDuration = 2500;

const statusIcons = {
    copying: 'fa-solid fa-circle-notch fa-spin',
    success: 'fa-solid fa-check',
    failure: 'fa-solid fa-triangle-exclamation',
};

function hasClipboardApi() {
    return typeof ClipboardItem !== 'undefined' && 'write' in navigator.clipboard;
}

const propTypes = {
    domSelector: PropTypes.string.isRequired,
};

function CopyToClipboard({ domSelector }) {
    const language = useContext(LanguageContext);
    const [status, setStatus] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const hideTimer = useRef(null);
    const copyText = language('actions.copyToClipboard');

    // Stop any pending hide when unmounting
    useEffect(() => () => clearTimeout(hideTimer.current), []);

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

    function finish(newStatus) {
        setStatus(newStatus);
        hideTimer.current = setTimeout(() => setShowMessage(false), messageDuration);
    }

    function onCopy() {
        // Ignore clicks while a copy is underway, as Firefox cancels a pending clipboard write when
        // another one starts
        if (status === 'copying') {
            return;
        }

        clearTimeout(hideTimer.current);
        setStatus('copying');
        setShowMessage(true);

        // Hand the clipboard a pending image, rather than awaiting it first, as Safari rejects
        // clipboard writes that happen after the click event has finished
        navigator.clipboard.write([
            new ClipboardItem({ 'image/png': renderImage() }),
        ]).then(() => {
            finish('success');
        }).catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to copy draft results: ', error);
            finish('failure');
        });
    }

    // Ensure the browser supports the clipboard API
    if (!hasClipboardApi()) {
        return null;
    }

    const tooltipClassName = classNames('tooltip', 'bs-tooltip-top', 'copy-to-clipboard-message', {
        show: showMessage,
        'copy-to-clipboard-failure': status === 'failure',
    });

    return (
        <div className="copy-to-clipboard">
            <button
                aria-busy={status === 'copying'}
                aria-label={copyText}
                className="btn-copy"
                title={copyText}
                type="button"
                onClick={onCopy}
            >
                <span className="fa fa-copy" />
            </button>
            {/* Always rendered, so that screen readers announce changes to the message */}
            <div className={tooltipClassName} role="status">
                {status !== null ? (
                    <>
                        <div className="tooltip-arrow" />
                        <div className="tooltip-inner">
                            <span aria-hidden="true" className={statusIcons[status]} />
                            {' '}
                            {language(`clipboard.${status}`)}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}

CopyToClipboard.propTypes = propTypes;

export default CopyToClipboard;
