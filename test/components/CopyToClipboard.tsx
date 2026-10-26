import { assert } from 'chai';
import sinon, { type SinonStub } from 'sinon';
import {
    act,
    fireEvent,
    render,
    screen,
} from '@testing-library/react';

import CopyToClipboard from '#js/components/Utils/CopyToClipboard.tsx';
import wrapper from '../languageWrapper.tsx';

// jsdom has no Clipboard API, so stand in for the parts the component uses
class FakeClipboardItem {
    items: Record<string, unknown>;

    constructor(items: Record<string, unknown>) {
        this.items = items;

        // The image cannot render in jsdom, so silence that rejection, as a browser would
        Object.values(items).forEach((item) => {
            Promise.resolve(item).catch(() => {});
        });
    }
}

// The test adds and removes these globals, which jsdom lacks
const testGlobals = globalThis as { ClipboardItem?: unknown };
const testNavigator = navigator as { clipboard?: unknown };

describe('<CopyToClipboard />', () => {
    let write: SinonStub<[FakeClipboardItem[]], Promise<void>>;

    beforeEach(() => {
        write = sinon.stub();
        testGlobals.ClipboardItem = FakeClipboardItem;
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: { write },
        });
    });

    afterEach(() => {
        sinon.restore();
        delete testGlobals.ClipboardItem;
        delete testNavigator.clipboard;
    });

    function renderButton() {
        render(<CopyToClipboard domSelector=".draft-results" />, { wrapper });

        return screen.getByRole('button', { name: 'Copy to clipboard' });
    }

    it('should not render when the browser lacks the Clipboard API', () => {
        delete testGlobals.ClipboardItem;

        render(<CopyToClipboard domSelector=".draft-results" />, { wrapper });

        assert.isNull(screen.queryByRole('button', { name: 'Copy to clipboard' }));
    });

    // Safari rejects clipboard writes that happen after the click event has finished
    it('should write a PNG to the clipboard during the click', () => {
        write.returns(Promise.withResolvers<void>().promise);

        fireEvent.click(renderButton());

        assert.isTrue(write.calledOnce);
        const [[item]] = write.firstCall.args;
        assert.instanceOf(item, FakeClipboardItem);
        assert.instanceOf(item.items['image/png'], Promise);
    });

    it('should show a message while copying and on success', async () => {
        const deferred = Promise.withResolvers<void>();
        write.returns(deferred.promise);

        fireEvent.click(renderButton());

        const status = screen.getByRole('status');
        assert.include(status.textContent, 'Copying...');
        assert.isTrue(status.classList.contains('show'));

        deferred.resolve();

        await screen.findByText('Copied to clipboard!');
        assert.isTrue(status.classList.contains('show'));
    });

    it('should show a message on failure', async () => {
        const consoleError = sinon.stub(console, 'error');
        const deferred = Promise.withResolvers<void>();
        write.returns(deferred.promise);

        fireEvent.click(renderButton());
        deferred.reject(new Error('Write permission denied'));

        await screen.findByText('Unable to copy to clipboard');
        const status = screen.getByRole('status');
        assert.isTrue(status.classList.contains('copy-to-clipboard-failure'));
        assert.isTrue(consoleError.calledOnce);
    });

    it('should hide the message after a short time', async () => {
        // Let time pass normally (for `findByText`), while allowing a jump ahead
        const clock = sinon.useFakeTimers({
            toFake: ['setTimeout', 'clearTimeout'],
            shouldAdvanceTime: true,
        });
        write.resolves();

        fireEvent.click(renderButton());
        await screen.findByText('Copied to clipboard!');

        const status = screen.getByRole('status');
        assert.isTrue(status.classList.contains('show'));

        act(() => {
            clock.tick(2500);
        });

        assert.isFalse(status.classList.contains('show'));
    });

    // Firefox cancels a pending clipboard write when another one starts
    it('should ignore clicks while a copy is underway', async () => {
        const deferred = Promise.withResolvers<void>();
        write.returns(deferred.promise);

        const button = renderButton();
        fireEvent.click(button);
        fireEvent.click(button);

        assert.isTrue(write.calledOnce);

        // Once finished, copying is allowed again
        deferred.resolve();
        await screen.findByText('Copied to clipboard!');
        write.returns(Promise.withResolvers<void>().promise);
        fireEvent.click(button);

        assert.isTrue(write.calledTwice);
    });
});
