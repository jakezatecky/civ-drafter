import axios from 'axios';
import React from 'react';
import { assert } from 'chai';
import { render, screen } from '@testing-library/react';
import sinon from 'sinon';

import App from 'js/components/App';

describe('<App />', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should render a draft button', async () => {
        sinon.stub(axios, 'get').resolves(Promise.resolve([]));

        render(<App />);

        const submit = screen.findByRole('button', { name: 'Draft' });
        assert.isNotNull(submit);
    });
});
