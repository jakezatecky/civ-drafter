import React from 'react';
import { assert } from 'chai';
import { render, screen } from '@testing-library/react';

import App from '../../src/js/components/App';

describe('<App />', () => {
    it('should render a hello message with `props.name`', () => {
        render(<App name="Gregory" />);

        assert.equal(screen.getByRole('heading').textContent, 'Hello, Gregory!');
    });
});
