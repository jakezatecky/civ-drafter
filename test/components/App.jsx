import { assert } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { render, screen } from '@testing-library/react';

import App from '#js/components/App.jsx';
import wrapper from '../languageWrapper.jsx';

describe('<App />', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should render a draft button', async () => {
        render(<App initialTheme="light" />, { wrapper });

        const submit = await screen.findByRole('button', { name: 'Draft!' });
        assert.isNotNull(submit);
    });
});
