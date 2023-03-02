import { assert } from 'chai';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DraftSettings from 'js/components/DraftSettings';

const baseLeaders = [
    {
        id: 'Abraham Lincoln',
        civilization: 'American',
        shortName: 'Abraham Lincoln',
        longName: 'Abraham Lincoln (American)',
        image: 'blank.png',
    },
    {
        id: 'Alexander',
        civilization: 'Macedonian',
        shortName: 'Alexander',
        longName: 'Alexander (Macedonian)',
        image: 'blank.png',
    },
    {
        id: 'Amanitore',
        civilization: 'Nubian',
        shortName: 'Amanitore',
        longName: 'Amanitore (Nubian)',
        image: 'blank.png',
    },
];

describe('<DraftSettings />', () => {
    afterEach(() => {
        localStorage.removeItem('draftSettings');
    });

    // https://github.com/jakezatecky/civ-drafter/issues/7
    it('should not include banned leaders in the results', async () => {
        const bannedRuler = 'Alexander (Macedonian)';
        const results = [];

        // Define settings through `localStorage`
        localStorage.setItem('draftSettings', JSON.stringify({
            numPlayers: 2,
            numChoices: 1,
            bans: [bannedRuler],
        }));

        render((
            <>
                <DraftSettings
                    leaders={baseLeaders}
                    onSubmit={({ players }) => {
                        results.push(
                            players.map(({ choices }) => choices[0]),
                        );
                    }}
                />
                <button form="draft-form" type="submit">Draft!</button>
            </>
        ));

        const user = userEvent.setup();
        const submit = await screen.findByText('Draft!');

        // Randomizing 20 times should be sufficient for testing purposes
        await Promise.all([...Array(20)].map(async () => {
            await user.click(submit);
        }));

        // Confirm that banned ruler does not appear in the list, but Abraham Lincoln does
        const hasBannedRuler = results.some(
            (playerSet) => playerSet.some(({ longName }) => longName === bannedRuler),
        );
        const hasAllowedRuler = results.some(
            (playerSet) => playerSet.some(({ longName }) => longName === 'Abraham Lincoln (American)'),
        );
        assert.isFalse(hasBannedRuler);
        assert.isTrue(hasAllowedRuler);
    });
});
