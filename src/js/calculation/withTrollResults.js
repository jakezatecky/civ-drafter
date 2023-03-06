import random from 'lodash/random';

import { trollFactor } from 'js/constants/calculation';

/**
 * Troll the user by duplicating a single leader for all players.
 *
 * @param {Object} players
 *
 * @returns {{trollLeader, players}|{trollLeader: null, players}}
 */
function withTrollResults(players) {
    // There must be more than one player and we must roll a zero
    // Only then can Cap'n Crunch bless us
    const timeToTroll = players.length > 1 && random(0, trollFactor) === 0;

    if (!timeToTroll) {
        return { players };
    }

    // Everybody's choices become the first player's first choice
    const numChoices = players[0].choices.length;
    const trollLeader = players[0].choices[0];
    const newPlayerChoices = players.map(({ name }) => ({
        name,
        choices: Array(numChoices)
            .fill(trollLeader)
            .map((leader, choiceIndex) => ({ ...leader, id: choiceIndex })),
    }));

    return { trollLeader, players: newPlayerChoices };
}

export default withTrollResults;
