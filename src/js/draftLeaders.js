import shuffle from 'lodash/shuffle';

class NotEnoughLeadersError extends Error {
    name = 'NotEnoughLeadersError';

    constructor(totalChoices, availableLeaders) {
        super('Not enough available leaders');

        this.totalChoices = totalChoices;
        this.availableLeaders = availableLeaders;
    }
}

/**
 * Return a random list of `numChoices` for each player, after removing all bans and randomizing
 * personas.
 *
 * Some leaders have multiple personas, but the game will not permit more than one in a single game.
 * This function handles that deleting all other personas
 *
 * @param {Array} leaders
 * @param {Number} numPlayers
 * @param {Number} numChoices
 * @param {Array} bans
 */
function draftLeaders(leaders, numPlayers, numChoices, bans) {
    // Flatten bans to leader names for simple comparison
    const flatBans = bans.map(({ name }) => name);

    // Remove banned leaders from the selection pool
    const availablePool = leaders.filter(({ longName }) => !flatBans.includes(longName));

    // Shuffle the available leaders for randomization
    const shuffledPool = shuffle(availablePool);

    // Compile the indexes of all personas.
    const personas = {};
    shuffledPool.forEach(({ leaderId }, index) => {
        if (leaderId !== undefined) {
            if (personas[leaderId] === undefined) {
                personas[leaderId] = [];
            }

            personas[leaderId].push(index);
        }
    });

    // Reduce each leader to one persona
    Object.keys(personas).forEach((leaderId) => {
        // Keep the first persona, as we have already shuffled the list
        // Use the remaining indexes to remove the other personas
        delete personas[leaderId][0];
        personas[leaderId].forEach((leaderIndex) => {
            delete shuffledPool[leaderIndex];
        });
    });

    // Now filter out all deleted entries
    const finalPool = shuffledPool.filter((leader) => leader !== undefined);

    // Ensure we have enough leaders to satisfy the total choices
    const totalChoices = numPlayers * numChoices;
    const notEnoughLeaders = totalChoices > finalPool.length;

    if (notEnoughLeaders) {
        throw new NotEnoughLeadersError(totalChoices, finalPool.length);
    }

    // Constructing the available player choices
    const playerChoices = [...Array(numPlayers)];
    playerChoices.forEach((player, index) => {
        // Extract  the next `numChoices` leaders from the pool
        playerChoices[index] = {
            index,
            choices: finalPool.slice(index * numChoices, (index + 1) * numChoices),
        };
    });

    return playerChoices;
}

export { NotEnoughLeadersError };
export default draftLeaders;
