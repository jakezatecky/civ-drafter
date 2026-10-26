import random from 'lodash/random.js';

import type { Draft, DraftPlayer } from '#js/types.ts';

/**
 * Troll the user by duplicating a single leader for all players.
 *
 * @param trollFactor One in this many drafts trolls the players; 0 disables it.
 */
function withTrollResults(players: DraftPlayer[], trollFactor: number): Draft {
    const timeToTroll = (
        // Trolling must not be disabled
        trollFactor > 0 &&
        // There must be more than one player
        players.length > 1 &&
        // We must roll a zero
        random(0, trollFactor - 1) === 0
    );

    if (!timeToTroll) {
        return { players };
    }

    // Everybody's choices become the first player's first choice
    const numChoices = players[0].choices.length;
    const trollLeader = players[0].choices[0];
    const newPlayerChoices = players.map(({ name }) => ({
        name,
        choices: Array.from({ length: numChoices }, (_, choiceIndex) => (
            { ...trollLeader, id: choiceIndex }
        )),
    }));

    return { trollLeader, players: newPlayerChoices };
}

export default withTrollResults;
