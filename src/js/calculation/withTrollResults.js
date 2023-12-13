import random from 'lodash/random';

/**
 * Troll the user by duplicating a single leader for all players.
 *
 * @param {Object} players
 * @param {int} trollFactor
 *
 * @returns {{trollLeader, players}|{trollLeader: null, players}}
 */
function withTrollResults(players, trollFactor) {
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
        choices: Array(numChoices)
            .fill(trollLeader)
            .map((leader, choiceIndex) => ({ ...leader, id: choiceIndex })),
    }));

    return { trollLeader, players: newPlayerChoices };
}

export default withTrollResults;
