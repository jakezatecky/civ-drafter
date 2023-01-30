import axios from 'axios';
import { assert } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { render, screen } from '@testing-library/react';

import App from 'js/components/App';

const baseLeaders = [{
    id: 'Robert the Bruce',
    shortName: 'Robert the Bruce',
    longName: 'Robert the Bruce (Scottish)',
    civilization: 'Scottish',
    image: 'Robert_the_Bruce_(Civ6).png',
    dlc: 'Rise and Fall',
}];

describe('<App />', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should render a draft button', async () => {
        sinon.stub(axios, 'get').resolves(Promise.resolve({
            status: 200,
            data: baseLeaders,
        }));

        render(<App initialTheme="light" />);

        const submit = await screen.findByRole('button', { name: 'Draft!' });
        assert.isNotNull(submit);
    });
});
