import { assert } from 'chai';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DraftArea from 'js/components/DraftArea';
import wrapper from '../languageWrapper';

const baseLeaders = [
    {
        id: 'Abraham Lincoln',
        civilization: 'American',
        shortName: 'Abraham Lincoln',
        longName: 'Abraham Lincoln (American)',
        image: 'blank.png',
        dlc: ['Vanilla'],
    },
    {
        id: 'Alexander',
        civilization: 'Macedonian',
        shortName: 'Alexander',
        longName: 'Alexander (Macedonian)',
        image: 'blank.png',
        dlc: ['Vanilla'],
    },
    {
        id: 'Amanitore',
        civilization: 'Nubian',
        shortName: 'Amanitore',
        longName: 'Amanitore (Nubian)',
        image: 'blank.png',
        dlc: ['Vanilla'],
    },
    {
        id: 'Teddy Roosevelt',
        shortName: 'Teddy Roosevelt (Bull Moose)',
        longName: 'Teddy Roosevelt (Bull Moose) (American)',
        civilization: 'American',
        image: 'blank.png',
        dlc: ['Vanilla'],
    },
];

describe('<DraftArea />', () => {
    afterEach(() => {
        localStorage.removeItem('draftSettings');
    });

    // https://github.com/jakezatecky/civ-drafter/issues/7
    it('should not include banned leaders in the results', async () => {
        // Define settings through `localStorage`
        localStorage.setItem('draftSettings', JSON.stringify({
            numPlayers: 2,
            numChoices: 1,
            bans: ['Alexander (Macedonian)'],
            duplications: [],
        }));

        render(<DraftArea leaders={baseLeaders} />, { wrapper });

        const user = userEvent.setup();
        const submit = await screen.findByText('Draft!');

        let numBannedAppeared = 0;
        let numAllowedAppeared = 0;

        // Randomizing 20 times should be sufficient for testing purposes
        // (2/3)^20 = ~0.03% chance the banned leader could evade this test if the code is improper
        await Promise.all([...Array(20)].map(async () => {
            await user.click(submit);
            const bannedElement = await screen.queryByText('Alexander');
            const allowedElement = await screen.queryByText('Amanitore');

            if (bannedElement !== null) {
                numBannedAppeared += 1;
            }

            if (allowedElement !== null) {
                numAllowedAppeared += 1;
            }
        }));

        // Confirm that banned ruler does not appear in the list, but Amanitore does
        assert.equal(numBannedAppeared, 0);
        assert.equal(numAllowedAppeared, 20);
    });

    it('should allow multiple leaders per civilization when set', async () => {
        // Define settings through `localStorage`
        localStorage.setItem('draftSettings', JSON.stringify({
            numPlayers: 4,
            numChoices: 1,
            bans: [],
            duplications: ['civilization'],
        }));

        render(<DraftArea leaders={baseLeaders} />, { wrapper });

        const user = userEvent.setup();
        const submit = await screen.findByText('Draft!');

        await user.click(submit);
        const abraham = await screen.queryByText('Abraham Lincoln');
        const teddy = await screen.queryByText('Teddy Roosevelt (Bull Moose)');

        // Confirm that both men appear in the result
        assert.isNotNull(abraham);
        assert.isNotNull(teddy);
    });
});
