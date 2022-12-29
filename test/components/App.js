import React from 'react';
import { assert } from 'chai';
import { render, screen } from '@testing-library/react';

import App from 'js/components/App';

describe('<App />', () => {
    it('should render a draft button', async () => {
        render(<App />);

        const submit = screen.findByRole('button', { name: 'Draft' });
        assert.isNotNull(submit);
    });
});
