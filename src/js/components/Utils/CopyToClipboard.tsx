import classNames from 'classnames';
import {
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import { LanguageContext } from '#js/contexts.ts';

// How long the success or failure message remains visible
const messageDuration = 2500;

// Render the image at double resolution, so that it stays crisp on the high-density displays that
// it is often viewed on, regardless of the display that copied it
const imageScale = 2;

type CopyStatus = 'copying' | 'success' | 'failure';

const statusIcons: Record<CopyStatus, string> = {
    copying: 'fa-solid fa-circle-notch fa-spin',
    success: 'fa-solid fa-check',
    failure: 'fa-solid fa-triangle-exclamation',
};

function hasClipboardApi() {
    return typeof ClipboardItem !== 'undefined' && 'write' in navigator.clipboard;
}

interface CopyToClipboardProps {
    // The element to capture as an image
    domSelector: string;
}

function CopyToClipboard({ domSelector }: CopyToClipboardProps) {
    const language = useContext(LanguageContext);
    const [status, setStatus] = useState<CopyStatus | null>(null);
    const [showMessage, setShowMessage] = useState(false);
    const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const copyText = language('actions.copyToClipboard');

    // Stop any pending hide when unmounting
    useEffect(() => () => clearTimeout(hideTimer.current), []);

    async function renderImage() {
        // Dynamically import `modern-screenshot` to avoid loading it unnecessarily
        const { domToBlob } = await import('modern-screenshot');
        const resultsArea = document.querySelector(domSelector);

        if (resultsArea === null) {
            throw new Error(`Cannot find ${domSelector} to copy`);
        }

        // Extract the background color (changes depending on theme)
        const bodyBg = window.getComputedStyle(document.body).getPropertyValue('background-color');

        return domToBlob(resultsArea, {
            backgroundColor: bodyBg,
            scale: imageScale,
            type: 'image/png',
        });
    }

    function finish(newStatus: CopyStatus) {
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

export default CopyToClipboard;
