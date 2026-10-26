import { assert } from 'chai';

import draftLeaders, { NotEnoughLeadersError } from '#js/calculation/draftLeaders.ts';
import type { DraftSettings, Leader } from '#js/types.ts';

const leaders: Leader[] = [
    {
        id: 'Abraham Lincoln',
        civilization: 'American',
        shortName: 'Abraham Lincoln',
        longName: 'Abraham Lincoln (American)',
        image: 'blank.png',
        dlc: ['Vanilla'],
    },
    {
        id: 'Teddy Roosevelt',
        civilization: 'American',
        shortName: 'Teddy Roosevelt (Bull Moose)',
        longName: 'Teddy Roosevelt (Bull Moose) (American)',
        image: 'blank.png',
        dlc: ['Vanilla'],
    },
    {
        id: 'Teddy Roosevelt',
        civilization: 'American',
        shortName: 'Teddy Roosevelt (Rough Rider)',
        longName: 'Teddy Roosevelt (Rough Rider) (American)',
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
];

function getSettings(overrides: Partial<DraftSettings> = {}): DraftSettings {
    return {
        numPlayers: 1,
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
 */
function countAvailableLeaders(duplications: string[]): number {
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
            Array.from({ length: 20 }).forEach(() => {
                const [{ choices }] = draftLeaders(leaders, getSettings({ numChoices: 3 }));

                assert.equal(new Set(choices.map(({ civilization }) => civilization)).size, 3);
                assert.equal(new Set(choices.map(({ id }) => id)).size, 3);
            });
        });
    });
});
