import { assert } from 'chai';

import draftLeaders, { NotEnoughLeadersError } from '#js/calculation/draftLeaders.ts';

const leaders = [
    {
        id: 'Abraham Lincoln',
        civilization: 'American',
        longName: 'Abraham Lincoln (American)',
        dlc: ['Vanilla'],
    },
    {
        id: 'Teddy Roosevelt',
        civilization: 'American',
        longName: 'Teddy Roosevelt (Bull Moose) (American)',
        dlc: ['Vanilla'],
    },
    {
        id: 'Teddy Roosevelt',
        civilization: 'American',
        longName: 'Teddy Roosevelt (Rough Rider) (American)',
        dlc: ['Vanilla'],
    },
    {
        id: 'Alexander',
        civilization: 'Macedonian',
        longName: 'Alexander (Macedonian)',
        dlc: ['Vanilla'],
    },
    {
        id: 'Amanitore',
        civilization: 'Nubian',
        longName: 'Amanitore (Nubian)',
        dlc: ['Vanilla'],
    },
];

function getSettings(overrides = {}) {
    return {
        players: [{ name: 'Player 1', enabledDlc: ['Vanilla'] }],
        numChoices: 1,
        bans: [],
        duplications: [],
        mods: [],
        ...overrides,
    };
}

/**
 * Count the leaders left in the pool after deduplication, by asking for more than could exist.
 *
 * @param {String[]} duplications
 *
 * @returns {Number}
 */
function countAvailableLeaders(duplications) {
    try {
        draftLeaders(leaders, getSettings({ duplications, numChoices: 99 }));
    } catch (error) {
        if (error instanceof NotEnoughLeadersError) {
            return error.availableLeaders;
        }

        throw error;
    }

    throw new Error('Expected a NotEnoughLeadersError');
}

describe('draftLeaders()', () => {
    describe('deduplication', () => {
        it('should allow one leader per civilization and per leader by default', () => {
            // American, Macedonian, and Nubian
            assert.equal(countAvailableLeaders([]), 3);
        });

        it('should allow multiple leaders per civilization when set', () => {
            // Abraham Lincoln, one Teddy Roosevelt, Alexander, and Amanitore
            assert.equal(countAvailableLeaders(['civilization']), 4);
        });

        it('should allow multiple personalities per leader when set', () => {
            // Still limited to one leader per civilization
            assert.equal(countAvailableLeaders(['id']), 3);
        });

        it('should allow every leader when both are set', () => {
            assert.equal(countAvailableLeaders(['civilization', 'id']), 5);
        });

        it('should never draft two leaders of the same civilization or leader', () => {
            // Run repeatedly, as the kept leaders are random
            [...Array(20)].forEach(() => {
                const [{ choices }] = draftLeaders(leaders, getSettings({ numChoices: 3 }));

                assert.equal(new Set(choices.map(({ civilization }) => civilization)).size, 3);
                assert.equal(new Set(choices.map(({ id }) => id)).size, 3);
            });
        });
    });
});
