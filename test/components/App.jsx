import { assert } from 'chai';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '#js/components/App.tsx';
import wrapper from '../languageWrapper.jsx';

describe('<App />', () => {
    let headerActionsContainer;

    beforeEach(() => {
        headerActionsContainer = document.createElement('div');
        document.body.append(headerActionsContainer);
    });

    afterEach(() => {
        headerActionsContainer.remove();
        localStorage.removeItem('theme');
        delete document.documentElement.dataset.bsTheme;
    });

    function renderApp(initialTheme = 'light') {
        render(
            <App headerActionsContainer={headerActionsContainer} initialTheme={initialTheme} />,
            { wrapper },
        );
    }

    it('should render a draft button', async () => {
        renderApp();

        const submit = await screen.findByRole('button', { name: 'Draft!' });
        assert.isNotNull(submit);
    });

    it('should render the theme switcher in the header', () => {
        renderApp();

        const switcher = screen.getByRole('button', { name: 'Switch to dark theme' });
        assert.isTrue(headerActionsContainer.contains(switcher));
    });

    it('should apply the initial theme to the page', () => {
        renderApp('dark');

        assert.equal(document.documentElement.dataset.bsTheme, 'dark');
        assert.isNull(localStorage.getItem('theme'));
    });

    it('should apply and save the theme when switched', async () => {
        const user = userEvent.setup();
        renderApp();

        await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

        assert.equal(document.documentElement.dataset.bsTheme, 'dark');
        assert.equal(localStorage.getItem('theme'), 'dark');

        await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));

        assert.equal(document.documentElement.dataset.bsTheme, 'light');
        assert.equal(localStorage.getItem('theme'), 'light');
    });
});
