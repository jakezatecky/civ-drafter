import shuffle from 'lodash/shuffle.js';

import type { DraftPlayer, DraftSettings, Leader } from '#js/types.ts';

class NotEnoughLeadersError extends Error {
    totalChoices: number;

    availableLeaders: number;

    constructor(totalChoices: number, availableLeaders: number) {
        super('Not enough available leaders');

        this.totalChoices = totalChoices;
        this.availableLeaders = availableLeaders;
    }
}

/**
 * De-duplicate the randomized pool by allowing only one leader for a given attribute.
 *
 * For example, when `attributeKey === 'civilization'`, we reduce the pool to allow for only one
 * leader with `civilization === 'Chinese'`.
 */
function deduplicateByAttribute(leaderPool: Leader[], attributeKey: keyof Leader): Leader[] {
    const seenValues = new Set();

    // Keep the first leader with each value, as we have already shuffled the list
    return leaderPool.filter((leader) => {
        const attributeValue = leader[attributeKey];

        if (seenValues.has(attributeValue)) {
            return false;
        }

        seenValues.add(attributeValue);

        return true;
    });
}

/**
 * See `deduplicateByAttribute`.
 */
function deduplicateByAttributes(leaderPool: Leader[], attributes: (keyof Leader)[]): Leader[] {
    return attributes.reduce(
        (pool, attributeKey) => deduplicateByAttribute(pool, attributeKey),
        leaderPool,
    );
}

/**
 * Return a random list of `numChoices` for each player, after removing all bans, shuffling the
 * available pool, and pruning leaders if the caller does not allow duplications.
 */
function draftLeaders(leaders: Leader[], {
    players,
    numChoices,
    bans,
    duplications: duplicatedAttributes,
    mods,
}: DraftSettings): DraftPlayer[] {
    // Remove banned leaders and leaders that don't respect mods settings from the selection pool
    const availablePool = leaders.filter(
        ({ longName, mod }) => (
            !bans.includes(longName) &&
            (!mod || mod.every((leaderMod) => mods.includes(leaderMod)))
        ),
    );

    // Shuffle the available leaders for randomization
    const shuffledPool = shuffle(availablePool);

    // Determine which, if any, attributes we will group the pool by.
    // By default, Civilization restricts players to one leader per persona AND civilization, but
    // players can relax those restrictions.
    const uniqueAttributes: (keyof Leader)[] = ['civilization', 'id'];
    const deduplicationAttributes = uniqueAttributes.filter(
        (attribute) => !duplicatedAttributes.includes(attribute),
    );
    const finalPool = deduplicateByAttributes(shuffledPool, deduplicationAttributes);

    // Calculate the worst-case scenario of picking leaders, where the players with the most DLC
    // snatch all the non-DLC leaders and leave no leaders for the less DLC-endowed players
    const minimumPotential = finalPool.filter(({ dlc: requiredDlc }) => (
        players.every(({ enabledDlc: playerDlc }) => (
            requiredDlc.every((dlc) => playerDlc.includes(dlc))
        ))
    ));

    // Ensure we have enough leaders to satisfy the total choices
    const totalChoices = players.length * numChoices;
    const notEnoughLeaders = totalChoices > minimumPotential.length;

    if (notEnoughLeaders) {
        throw new NotEnoughLeadersError(totalChoices, minimumPotential.length);
    }

    // Leaders already drafted by an earlier player
    const draftedLeaders = new Set<Leader>();

    // Constructing the available player choices
    return players.map(({ name, enabledDlc }) => {
        const choices: Leader[] = [];
        let numExtracted = 0;

        // Extract the next `numChoices` leaders from the pool
        finalPool.some((leader) => {
            // Quota satisfied; pull out
            if (numExtracted === numChoices) {
                return true;
            }

            const { dlc: requiredDlc } = leader;

            if (
                !draftedLeaders.has(leader) &&
                requiredDlc.every((dlc) => enabledDlc.includes(dlc))
            ) {
                // Player has DLC; draft leader
                numExtracted += 1;
                choices.push(leader);
                draftedLeaders.add(leader);
            }

            return false;
        });

        return { name, choices };
    });
}

export { NotEnoughLeadersError };
export default draftLeaders;
